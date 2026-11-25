"use client";

import { forwardRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { useCreateEmployeeViewModel } from "../view-models/use-create-employee-view-model";

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

function inputClasses(invalid, hasRight) {
  return `h-[52px] w-full rounded-xl border bg-slate-50 dark:bg-slate-800 pl-11 ${
    hasRight ? "pr-12" : "pr-4"
  } text-[15px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
    invalid
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 dark:border-slate-700 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
  }`;
}

function Field({ label, htmlFor, error, className = "", children }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

const IconInput = forwardRef(function IconInput(
  { icon: Icon, invalid, right, ...props },
  ref
) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-400" />
      <input
        ref={ref}
        {...props}
        className={inputClasses(invalid, Boolean(right))}
      />
      {right && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {right}
        </div>
      )}
    </div>
  );
});

const IconSelect = forwardRef(function IconSelect(
  { icon: Icon, invalid, placeholder, options, ...props },
  ref
) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-400" />
      <select
        ref={ref}
        defaultValue=""
        {...props}
        className={`${inputClasses(invalid, true)} appearance-none`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
    </div>
  );
});

// Works on http (LAN) pages too, where navigator.clipboard is not available
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(area);
      return ok;
    } catch {
      return false;
    }
  }
}

// A titled block inside the form
function Section({ icon: Icon, title, children }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
          <Icon className="h-[18px] w-[18px]" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">
          {title}
        </h2>
        <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
      </div>
      {children}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main view                                                                 */
/* -------------------------------------------------------------------------- */

export default function CreateEmployeeView() {
  "use no memo";

  const {
    form,
    formKey,
    onSubmit,
    departments,
    roles,
    isLoadingLists,
    isSaving,
    serverError,
    createdEmployee,
    dismissCreated,
  } = useCreateEmployeeViewModel();

  const {
    register,
    formState: { errors },
  } = form;

  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState("");

  const handleCopy = async (text, key) => {
    if (!text) return;

    const ok = await copyText(text);

    if (ok) {
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    }
  };

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 dark:bg-slate-950 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1400px] min-w-0">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
            <UserPlus className="h-6 w-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Add new person
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Register a team member. They sign in with their Employee ID and
              the password you set.
            </p>
          </div>
        </header>

        {/* Form card */}
        <div className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-8">
          {/* Success */}
          {createdEmployee && (
            <div className="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/20 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    {createdEmployee.full_name} was registered
                  </p>

                  <p className="mt-0.5 text-xs text-emerald-800 dark:text-emerald-200">
                    Employee ID:{" "}
                    <span className="font-semibold">
                      {createdEmployee.employee_id}
                    </span>
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-slate-900 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Temporary password (shown only once)
                      </p>
                      <p className="truncate font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        {createdEmployee.tempPassword}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(createdEmployee.tempPassword, "temp")
                      }
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied === "temp" ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={dismissCreated}
                  aria-label="Dismiss"
                  className="rounded-lg p-1 text-emerald-700 dark:text-emerald-400 transition hover:bg-emerald-100 dark:hover:bg-emerald-900/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div
              className="mb-6 flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/20 p-3 text-sm text-rose-700 dark:text-rose-200"
              role="alert"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{serverError}</span>
            </div>
          )}

          {/* Form */}
          <form
            key={formKey}
            onSubmit={onSubmit}
            noValidate
            className="space-y-8"
          >
            <Section icon={User} title="Personal details">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field
                  label="Full name"
                  htmlFor="fullName"
                  error={errors.fullName?.message}
                >
                  <IconInput
                    id="fullName"
                    icon={User}
                    placeholder="Enter the full name"
                    autoComplete="off"
                    invalid={Boolean(errors.fullName)}
                    {...register("fullName")}
                  />
                </Field>

                <Field
                  label="Mobile number"
                  htmlFor="phone"
                  error={errors.phone?.message}
                >
                  <IconInput
                    id="phone"
                    icon={Phone}
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    autoComplete="off"
                    invalid={Boolean(errors.phone)}
                    {...register("phone")}
                  />
                </Field>

                <Field
                  label="Email address"
                  htmlFor="email"
                  error={errors.email?.message}
                  className="sm:col-span-2"
                >
                  <IconInput
                    id="email"
                    icon={Mail}
                    type="email"
                    placeholder="name@example.com"
                    autoComplete="off"
                    invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                </Field>
              </div>
            </Section>

            <Section icon={Building2} title="Work details">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field
                  label="Department"
                  htmlFor="departmentId"
                  error={errors.departmentId?.message}
                >
                  <IconSelect
                    id="departmentId"
                    icon={Building2}
                    placeholder={
                      isLoadingLists ? "Loading..." : "Select department"
                    }
                    options={departments}
                    invalid={Boolean(errors.departmentId)}
                    {...register("departmentId")}
                  />
                </Field>

                <Field
                  label="Role"
                  htmlFor="roleId"
                  error={errors.roleId?.message}
                >
                  <IconSelect
                    id="roleId"
                    icon={Briefcase}
                    placeholder={isLoadingLists ? "Loading..." : "Select role"}
                    options={roles}
                    invalid={Boolean(errors.roleId)}
                    {...register("roleId")}
                  />
                </Field>
              </div>
            </Section>

            <Section icon={Lock} title="Sign-in details">
              <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
                <Field
                  label="Employee ID"
                  htmlFor="employeeId"
                  error={errors.employeeId?.message}
                >
                  <IconInput
                    id="employeeId"
                    icon={BadgeCheck}
                    placeholder="name@company"
                    autoComplete="off"
                    invalid={Boolean(errors.employeeId)}
                    {...register("employeeId")}
                  />
                </Field>

                <Field
                  label="Password"
                  htmlFor="password"
                  error={errors.password?.message}
                >
                  <IconInput
                    id="password"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    invalid={Boolean(errors.password)}
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="rounded-md p-1 text-slate-400 transition hover:text-slate-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-[18px] w-[18px]" />
                        ) : (
                          <Eye className="h-[18px] w-[18px]" />
                        )}
                      </button>
                    }
                    {...register("password")}
                  />
                </Field>

                <Field
                  label="Confirm password"
                  htmlFor="confirmPassword"
                  error={errors.confirmPassword?.message}
                >
                  <IconInput
                    id="confirmPassword"
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter the password"
                    autoComplete="new-password"
                    invalid={Boolean(errors.confirmPassword)}
                    {...register("confirmPassword")}
                  />
                </Field>
              </div>
            </Section>

            {/* Actions */}
            <div className="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                All fields are required.
              </p>

              <button
                type="submit"
                disabled={isSaving}
                className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3453e0] to-[#1f84d6] px-8 text-[15px] font-bold text-white shadow-lg shadow-blue-600/25 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[230px]"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-[18px] w-[18px] animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-[18px] w-[18px]" />
                    Register person
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}