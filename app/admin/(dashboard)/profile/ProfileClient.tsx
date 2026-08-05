"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { saveProfileAction } from "@/lib/actions/cms.actions";
import type { Profile } from "@/lib/generated/prisma";
import {
  User,
  Mail,
  Image as ImageIcon,
  FileText,
  Plus,
  X,
  Globe,
  Loader2,
  CheckCircle2,
  Save,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RolesJson {
  en: string[];
  uz: string[];
  ru: string[];
}

interface ProfileFormData {
  name: string;
  firstName: string;
  lastName: string;
  age: string;
  location: string;
  team: string;
  email: string;
  telegram: string;
  telegramUrl: string;
  phone: string;
  phoneUrl: string;
  roles: RolesJson;
  avatarUrl: string;
  cvUrl: string;
}

function safeRoles(raw: unknown): RolesJson {
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>;
    return {
      en: Array.isArray(obj.en) ? (obj.en as string[]) : [],
      uz: Array.isArray(obj.uz) ? (obj.uz as string[]) : [],
      ru: Array.isArray(obj.ru) ? (obj.ru as string[]) : [],
    };
  }
  return { en: [], uz: [], ru: [] };
}

function profileToForm(profile: Profile | null): ProfileFormData {
  return {
    name: profile?.name ?? "",
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    age: profile?.age != null ? String(profile.age) : "",
    location: profile?.location ?? "",
    team: profile?.team ?? "",
    email: profile?.email ?? "",
    telegram: profile?.telegram ?? "",
    telegramUrl: profile?.telegramUrl ?? "",
    phone: profile?.phone ?? "",
    phoneUrl: profile?.phoneUrl ?? "",
    roles: safeRoles(profile?.roles),
    avatarUrl: profile?.avatarUrl ?? "",
    cvUrl: profile?.cvUrl ?? "",
  };
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: "var(--neu-bg, #e8f0e8)",
        boxShadow:
          "8px 8px 16px var(--neu-shadow-dark, #c8d8c8), -8px -8px 16px var(--neu-shadow-light, #ffffff)",
      }}
    >
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-green-200/60">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #22c55e20, #16a34a10)",
            boxShadow: "inset 2px 2px 4px #c8d8c8, inset -2px -2px 4px #ffffff",
          }}
        >
          <Icon className="w-4 h-4 text-green-600" />
        </div>
        <h2 className="text-base font-semibold text-gray-700">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function NeuInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-600">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-sm text-gray-700 outline-none transition-all placeholder:text-gray-400 focus:ring-2 focus:ring-green-400/40"
        style={{
          background: "var(--neu-bg, #e8f0e8)",
          boxShadow:
            "inset 4px 4px 8px var(--neu-shadow-dark, #c8d8c8), inset -4px -4px 8px var(--neu-shadow-light, #ffffff)",
        }}
      />
    </div>
  );
}

function RolesList({
  lang,
  label,
  flag,
  roles,
  onChange,
}: {
  lang: keyof RolesJson;
  label: string;
  flag: string;
  roles: string[];
  onChange: (roles: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  const addRole = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onChange([...roles, trimmed]);
    setInputValue("");
  };

  const removeRole = (idx: number) => {
    onChange(roles.filter((_, i) => i !== idx));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRole();
    }
  };

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--neu-bg, #e8f0e8)",
        boxShadow:
          "inset 3px 3px 6px var(--neu-shadow-dark, #c8d8c8), inset -3px -3px 6px var(--neu-shadow-light, #ffffff)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{flag}</span>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <span className="ml-auto text-xs text-gray-400">{lang.toUpperCase()}</span>
      </div>

      {/* Role tags */}
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {roles.length === 0 && (
          <span className="text-xs text-gray-400 italic">No roles yet — add some below</span>
        )}
        {roles.map((role, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-green-700"
            style={{
              background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
              boxShadow: "2px 2px 4px #c8d8c8, -1px -1px 3px #ffffff",
            }}
          >
            {role}
            <button
              onClick={() => removeRole(idx)}
              className="hover:text-red-500 transition-colors ml-0.5"
              type="button"
              aria-label={`Remove "${role}"`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      {/* Add input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Add ${label} role…`}
          className="flex-1 px-3 py-2 rounded-lg text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-green-400/40"
          style={{
            background: "var(--neu-bg, #e8f0e8)",
            boxShadow:
              "inset 2px 2px 5px var(--neu-shadow-dark, #c8d8c8), inset -2px -2px 5px var(--neu-shadow-light, #ffffff)",
          }}
        />
        <button
          onClick={addRole}
          type="button"
          className="px-3 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-1.5 transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "3px 3px 6px #c8d8c8, -2px -2px 5px #ffffff",
          }}
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </div>
  );
}

function AvatarPreview({ url, name }: { url: string; name: string }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [url]);

  const initial = name ? name[0]?.toUpperCase() : "?";

  return (
    <div className="flex items-center gap-4">
      {/* Avatar circle */}
      <div
        className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
        style={{
          background: "var(--neu-bg, #e8f0e8)",
          boxShadow:
            "6px 6px 12px var(--neu-shadow-dark, #c8d8c8), -6px -6px 12px var(--neu-shadow-light, #ffffff)",
        }}
      >
        {url && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Avatar preview"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="text-2xl font-bold"
            style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          >
            {initial}
          </span>
        )}
      </div>
      <div className="text-xs text-gray-500 leading-relaxed">
        <p className="font-medium text-gray-600 mb-1">Avatar Preview</p>
        <p>Paste a URL below to preview your avatar.</p>
        <p>Shows initial letter if URL is invalid.</p>
      </div>
    </div>
  );
}

// ── Auto-save Status ──────────────────────────────────────────────────────────

type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

function AutoSaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-xs font-medium">
      {status === "pending" && (
        <span className="text-gray-400 animate-pulse">Waiting to save…</span>
      )}
      {status === "saving" && (
        <>
          <Loader2 className="w-3.5 h-3.5 text-green-500 animate-spin" />
          <span className="text-green-600">Auto-saving…</span>
        </>
      )}
      {status === "saved" && (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-600">Saved</span>
        </>
      )}
      {status === "error" && (
        <span className="text-red-500">Auto-save failed</span>
      )}
    </div>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────────

interface ProfileClientProps {
  profile: Profile | null;
}

export function ProfileClient({ profile }: ProfileClientProps) {
  const [form, setForm] = useState<ProfileFormData>(() => profileToForm(profile));
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isSaving, setIsSaving] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // ── Helpers ──

  const updateField = useCallback(
    <K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const updateRoles = useCallback(
    (lang: keyof RolesJson, roles: string[]) => {
      setForm((prev) => ({
        ...prev,
        roles: { ...prev.roles, [lang]: roles },
      }));
    },
    []
  );

  // ── Save Logic ──

  const save = useCallback(async (data: ProfileFormData, silent = false) => {
    setIsSaving(true);
    setSaveStatus("saving");

    const result = await saveProfileAction({
      name: data.name,
      firstName: data.firstName,
      lastName: data.lastName,
      age: data.age ? Number(data.age) : undefined,
      location: data.location || undefined,
      team: data.team || undefined,
      email: data.email || undefined,
      telegram: data.telegram || undefined,
      telegramUrl: data.telegramUrl || undefined,
      phone: data.phone || undefined,
      phoneUrl: data.phoneUrl || undefined,
      avatarUrl: data.avatarUrl || undefined,
      cvUrl: data.cvUrl || undefined,
      roles: data.roles,
    });

    setIsSaving(false);

    if (result.success) {
      setSaveStatus("saved");
      if (!silent) toast.success("Profile saved successfully!");
      // Reset to idle after 3s
      setTimeout(() => setSaveStatus("idle"), 3000);
    } else {
      setSaveStatus("error");
      toast.error(result.error ?? "Failed to save profile");
      setTimeout(() => setSaveStatus("idle"), 4000);
    }
  }, []);

  // ── Auto-save Debounce ──

  useEffect(() => {
    // Skip first render — don't auto-save on mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("pending");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      save(form, true);
    }, 3000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  // ── Manual Save ──

  const handleManualSave = async () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    await save(form, false);
  };

  // ── Render ──

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div
        className="rounded-2xl px-5 py-3 flex items-center justify-between"
        style={{
          background: "var(--neu-bg, #e8f0e8)",
          boxShadow:
            "6px 6px 12px var(--neu-shadow-dark, #c8d8c8), -6px -6px 12px var(--neu-shadow-light, #ffffff)",
        }}
      >
        <AutoSaveIndicator status={saveStatus} />
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className="ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "4px 4px 8px #c8d8c8, -2px -2px 5px #ffffff",
          }}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving…" : "Save Profile"}
        </button>
      </div>

      {/* ── Section 1: Personal Info ── */}
      <SectionCard title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeuInput
            label="Display Name"
            id="name"
            value={form.name}
            onChange={(v) => updateField("name", v)}
            placeholder="e.g. Loyhalar"
            required
          />
          <NeuInput
            label="First Name"
            id="firstName"
            value={form.firstName}
            onChange={(v) => updateField("firstName", v)}
            placeholder="e.g. Jasur"
            required
          />
          <NeuInput
            label="Last Name"
            id="lastName"
            value={form.lastName}
            onChange={(v) => updateField("lastName", v)}
            placeholder="e.g. Toshmatov"
            required
          />
          <NeuInput
            label="Age"
            id="age"
            type="number"
            value={form.age}
            onChange={(v) => updateField("age", v)}
            placeholder="e.g. 25"
          />
          <NeuInput
            label="Location"
            id="location"
            value={form.location}
            onChange={(v) => updateField("location", v)}
            placeholder="e.g. Tashkent, Uzbekistan"
          />
          <NeuInput
            label="Team"
            id="team"
            value={form.team}
            onChange={(v) => updateField("team", v)}
            placeholder="e.g. LoyhalarDev"
          />
        </div>
      </SectionCard>

      {/* ── Section 2: Contact ── */}
      <SectionCard title="Contact Information" icon={Mail}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NeuInput
            label="Email Address"
            id="email"
            type="email"
            value={form.email}
            onChange={(v) => updateField("email", v)}
            placeholder="you@example.com"
          />
          <NeuInput
            label="Telegram Handle"
            id="telegram"
            value={form.telegram}
            onChange={(v) => updateField("telegram", v)}
            placeholder="@username"
          />
          <NeuInput
            label="Telegram URL"
            id="telegramUrl"
            type="url"
            value={form.telegramUrl}
            onChange={(v) => updateField("telegramUrl", v)}
            placeholder="https://t.me/username"
          />
          <NeuInput
            label="Phone Number"
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(v) => updateField("phone", v)}
            placeholder="+998 90 123 45 67"
          />
          <div className="md:col-span-2">
            <NeuInput
              label="Phone URL (tel: or wa.me link)"
              id="phoneUrl"
              type="url"
              value={form.phoneUrl}
              onChange={(v) => updateField("phoneUrl", v)}
              placeholder="tel:+998901234567 or https://wa.me/998901234567"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Section 3: Roles (Typing Animation) ── */}
      <SectionCard title="Typing Animation Roles" icon={Globe}>
        <p className="text-xs text-gray-500 mb-4">
          These roles cycle through the typing animation on your hero section. Add each role as a
          separate tag. Press{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-xs font-mono">Enter</kbd>{" "}
          or click <strong>Add</strong> to add.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RolesList
            lang="en"
            label="English"
            flag="🇬🇧"
            roles={form.roles.en}
            onChange={(r) => updateRoles("en", r)}
          />
          <RolesList
            lang="uz"
            label="O'zbek"
            flag="🇺🇿"
            roles={form.roles.uz}
            onChange={(r) => updateRoles("uz", r)}
          />
          <RolesList
            lang="ru"
            label="Русский"
            flag="🇷🇺"
            roles={form.roles.ru}
            onChange={(r) => updateRoles("ru", r)}
          />
        </div>
      </SectionCard>

      {/* ── Section 4: Media ── */}
      <SectionCard title="Media & Files" icon={ImageIcon}>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="space-y-3">
            <div
              className="h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, #c8d8c8, transparent)" }}
            />
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Avatar</span>
            </div>
            <AvatarPreview url={form.avatarUrl} name={form.firstName || form.name} />
            <NeuInput
              label="Avatar URL"
              id="avatarUrl"
              type="url"
              value={form.avatarUrl}
              onChange={(v) => updateField("avatarUrl", v)}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* CV */}
          <div className="space-y-3">
            <div
              className="h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, #c8d8c8, transparent)" }}
            />
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-green-500" />
              <span className="text-sm font-semibold text-gray-700">Curriculum Vitae</span>
            </div>
            <NeuInput
              label="CV / Resume URL"
              id="cvUrl"
              type="url"
              value={form.cvUrl}
              onChange={(v) => updateField("cvUrl", v)}
              placeholder="https://example.com/cv.pdf"
            />
            {form.cvUrl && (
              <a
                href={form.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-green-700 transition-all hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                  boxShadow: "3px 3px 6px #c8d8c8, -2px -2px 4px #ffffff",
                }}
              >
                <FileText className="w-4 h-4" />
                Preview CV →
              </a>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Bottom Save Button */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleManualSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "6px 6px 12px #c8d8c8, -3px -3px 8px #ffffff",
          }}
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}
