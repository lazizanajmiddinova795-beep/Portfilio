import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // Create the initial admin user
  // In production, change the password after first login via Settings
  const adminEmail = process.env.ADMIN_EMAIL || "admin@restroflow.com";
  const adminPassword = process.env.ADMIN_PASSWORD_HASH
    ? null // if hash is already in env, we use the hash as plain text seed
    : "admin123";

  const hashedPassword = adminPassword
    ? await bcrypt.hash(adminPassword, 12)
    : process.env.ADMIN_PASSWORD_HASH || await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Seed default settings
  await prisma.setting.upsert({
    where: { key: "site_name" },
    update: {},
    create: { key: "site_name", value: "Laziza Najmiddinova Portfolio" },
  });

  await prisma.setting.upsert({
    where: { key: "contact_email" },
    update: {},
    create: { key: "contact_email", value: adminEmail },
  });

  console.log("✅ Default settings seeded");
  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
