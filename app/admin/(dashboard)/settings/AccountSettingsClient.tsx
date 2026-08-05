"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Mail,
  ShieldCheck,
  Lock,
  LogOut,
} from "lucide-react";

import {
  changeEmailSchema,
  changePasswordSchema,
  type ChangeEmailInput,
  type ChangePasswordInput,
} from "@/lib/validations/schemas";
import {
  changeEmailAction,
  changePasswordAction,
} from "@/lib/actions/cms.actions";

// ─── Shared styles ────────────────────────────────────────────────────────────

const neuInput =
  "w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-green-400";

const neuCard =
  "rounded-3xl p-6 sm:p-8 bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]";

const neuBtn =
  "px-6 py-3 rounded-2xl font-semibold bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1)] transition-all disabled:opacity-60 disabled:cursor-not-allowed";

// ─── Password strength helper ─────────────────────────────────────────────────

type StrengthLevel = "weak" | "fair" | "strong" | "very-strong";

function getPasswordStrength(password: string): {
  level: StrengthLevel;
  score: number;
  label: string;
} {
  if (!password) return { level: "weak", score: 0, label: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { level: "weak", score: 1, label: "Weak" };
  if (score === 2) return { level: "fair", score: 2, label: "Fair" };
  if (score === 3 || score === 4)
    return { level: "strong", score: 3, label: "Strong" };
  return { level: "very-strong", score: 4, label: "Very Strong" };
}

const strengthConfig: Record<
  StrengthLevel,
  { bars: number; color: string; textColor: string }
> = {
  weak: { bars: 1, color: "bg-red-400", textColor: "text-red-500" },
  fair: { bars: 2, color: "bg-yellow-400", textColor: "text-yellow-600" },
  strong: { bars: 3, color: "bg-green-400", textColor: "text-green-600" },
  "very-strong": {
    bars: 4,
    color: "bg-green-600",
    textColor: "text-green-700",
  },
};

// ─── Strength Indicator ───────────────────────────────────────────────────────

function PasswordStrengthIndicator({ password }: { password: string }) {
  const strength = useMemo(() => getPasswordStrength(password), [password]);
  if (!password) return null;

  const config = strengthConfig[strength.level];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-2 space-y-1"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((bar) => (
          <motion.div
            key={bar}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              bar <= config.bars ? config.color : "bg-gray-300"
            }`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: bar * 0.05 }}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${config.textColor}`}>
        {strength.label}
      </p>
    </motion.div>
  );
}

// ─── Password Field ───────────────────────────────────────────────────────────

function PasswordField({
  id,
  label,
  placeholder,
  error,
  showStrength,
  value,
  registration,
}: {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  showStrength?: boolean;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registration: any;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-gray-600 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete="off"
          className={`${neuInput} pr-12`}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-gray-400 hover:text-green-600 transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showStrength && value !== undefined && (
        <PasswordStrengthIndicator password={value} />
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-500 mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="p-3 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] shrink-0">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ─── Change Password Form ─────────────────────────────────────────────────────

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  const newPasswordValue = watch("newPassword", "");

  async function onSubmit(data: ChangePasswordInput) {
    const result = await changePasswordAction(data);
    if (result.success) {
      toast.success("Password changed! Signing you out…");
      reset();
      // Wait briefly so the toast is visible, then sign out
      await new Promise((r) => setTimeout(r, 1500));
      await signOut({ callbackUrl: "/admin/login" });
    } else {
      toast.error(result.error ?? "Failed to change password");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <PasswordField
        id="currentPassword"
        label="Current Password"
        placeholder="Enter your current password"
        error={errors.currentPassword?.message}
        registration={register("currentPassword")}
      />

      <PasswordField
        id="newPassword"
        label="New Password"
        placeholder="Enter a strong new password"
        error={errors.newPassword?.message}
        showStrength
        value={newPasswordValue}
        registration={register("newPassword")}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm New Password"
        placeholder="Re-enter your new password"
        error={errors.confirmPassword?.message}
        registration={register("confirmPassword")}
      />

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className={neuBtn}>
          <span className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Saving…
              </>
            ) : (
              <>
                <LogOut size={16} />
                Change Password &amp; Sign Out
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

// ─── Change Email Form ────────────────────────────────────────────────────────

function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailInput>({
    resolver: zodResolver(changeEmailSchema),
  });

  async function onSubmit(data: ChangeEmailInput) {
    const result = await changeEmailAction(data);
    if (result.success) {
      toast.success("Email updated successfully!");
      reset();
    } else {
      toast.error(result.error ?? "Failed to update email");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Current Email (read-only display) */}
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-600 mb-1">
          Current Email
        </label>
        <div
          className={`${neuInput} flex items-center gap-2 opacity-70 cursor-not-allowed select-all`}
        >
          <Mail size={16} className="text-green-500 shrink-0" />
          <span className="truncate">{currentEmail}</span>
        </div>
      </div>

      {/* New Email */}
      <div className="space-y-1">
        <label
          htmlFor="newEmail"
          className="block text-sm font-semibold text-gray-600 mb-1"
        >
          New Email Address
        </label>
        <input
          id="newEmail"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          className={neuInput}
          {...register("newEmail")}
        />
        {errors.newEmail && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {errors.newEmail.message}
          </motion.p>
        )}
      </div>

      {/* Current Password Verification */}
      <PasswordField
        id="emailCurrentPassword"
        label="Confirm with Current Password"
        placeholder="Enter your current password to verify"
        error={errors.currentPassword?.message}
        registration={register("currentPassword")}
      />

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={isSubmitting} className={neuBtn}>
          <span className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
                Updating…
              </>
            ) : (
              <>
                <Mail size={16} />
                Update Email
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function AccountSettingsClient({
  currentEmail,
}: {
  currentEmail: string;
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Page Header */}
      <motion.div variants={cardVariants}>
        <div className="flex items-center gap-3 mb-1">
          <ShieldCheck className="text-green-500" size={28} />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
            Account Settings
          </h1>
        </div>
        <p className="text-gray-500 text-sm ml-10">
          Manage your login credentials securely.
        </p>
      </motion.div>

      {/* Change Password Card */}
      <motion.div variants={cardVariants} className={neuCard}>
        <SectionHeader
          icon={<KeyRound size={20} />}
          title="Change Password"
          description="Use a strong password with uppercase letters, numbers, and symbols."
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-6" />

        <ChangePasswordForm />
      </motion.div>

      {/* Change Email Card */}
      <motion.div variants={cardVariants} className={neuCard}>
        <SectionHeader
          icon={<Lock size={20} />}
          title="Change Email"
          description="Update the email address associated with your admin account."
        />

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent mb-6" />

        <ChangeEmailForm currentEmail={currentEmail} />
      </motion.div>
    </motion.div>
  );
}
