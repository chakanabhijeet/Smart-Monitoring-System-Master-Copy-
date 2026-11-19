"use client";

import { AlertCircle, ArrowRight, Plus, RefreshCw, UserCog } from "lucide-react";

export default function AddRoleCard({
  tenant,
  form,
  onSubmit,
  isSaving,
  error,
}) {
  const {
    register,
    formState: { errors },
  } = form;

  const invalid = Boolean(errors.roleName);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Plus className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">Add role</h2>
          <p className="truncate text-xs text-slate-500">
            For <span className="font-semibold">{tenant.name}</span>
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-5">
        <label
          htmlFor="roleName"
          className="mb-1.5 block text-sm font-semibold text-slate-800"
        >
          Role name
        </label>

        <div className="relative">
          <UserCog className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
          <input
            id="roleName"
            placeholder="e.g. plant admin"
            autoComplete="off"
            aria-invalid={invalid}
            aria-describedby={invalid ? "roleName-error" : undefined}
            className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
              invalid
                ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                : "border-slate-200 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
            }`}
            {...register("roleName")}
          />
        </div>

        {errors.roleName && (
          <p
            id="roleName-error"
            className="mt-1.5 text-xs font-medium text-rose-600"
            role="alert"
          >
            {errors.roleName.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3453e0] to-[#1f84d6] text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create role
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
}