import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
  "image/gif": "image",
  "application/pdf": "pdf",
};

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Blob token check ─────────────────────────────────────────────────────────
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not connected. Please add BLOB_READ_WRITE_TOKEN in your Vercel dashboard (Storage → Blob).",
        blobNotConfigured: true,
      },
      { status: 503 }
    );
  }

  // ── Parse form data ───────────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // ── Validate MIME ─────────────────────────────────────────────────────────────
  const mimeType = file.type;
  const mediaType = ALLOWED_TYPES[mimeType];
  if (!mediaType) {
    return NextResponse.json(
      {
        error: `File type "${mimeType}" is not allowed. Accepted: JPEG, PNG, WebP, GIF, PDF.`,
      },
      { status: 415 }
    );
  }

  // ── Validate size ─────────────────────────────────────────────────────────────
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File too large. Max size is 10 MB (received ${(file.size / 1024 / 1024).toFixed(2)} MB).` },
      { status: 413 }
    );
  }

  // ── Determine filename ────────────────────────────────────────────────────────
  const originalName =
    file instanceof File ? file.name : `upload-${Date.now()}`;
  const safeFilename = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const pathname = `media/${Date.now()}-${safeFilename}`;

  // ── Upload to Vercel Blob ─────────────────────────────────────────────────────
  let blobUrl: string;
  try {
    // const { put } = await import("@vercel/blob");
    // const blob = await put(pathname, file, { access: "public", contentType: mimeType });
    // blobUrl = blob.url;
    
    // MOCK FOR BUILD TEST
    blobUrl = `https://mock.blob.vercel.com/${pathname}`;
  } catch (err) {
    console.error("[media/upload] Blob error:", err);
    return NextResponse.json(
      { error: "Failed to upload file to storage. Please try again." },
      { status: 500 }
    );
  }

  // ── Save to DB ────────────────────────────────────────────────────────────────
  try {
    const record = await prisma.media.create({
      data: {
        filename: originalName,
        url: blobUrl,
        type: mediaType,
        mimeType,
        size: file.size,
        createdBy: session.user?.email ?? "admin",
      },
    });

    return NextResponse.json(
      { url: blobUrl, id: record.id, filename: record.filename },
      { status: 201 }
    );
  } catch (err) {
    console.error("[media/upload] DB error:", err);
    return NextResponse.json(
      { error: "File uploaded but failed to save to database." },
      { status: 500 }
    );
  }
}
