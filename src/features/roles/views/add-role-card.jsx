"use client";

import { Controller } from "react-hook-form";
import { AlertCircle, ArrowRight, Plus, RefreshCw, UserCog } from "lucide-react";

export default function AddRoleCard({
  tenant,
  form,
  onSubmit,
  isSaving,
  error,
}) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
          <Plus className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Add role</h2>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            For <span className="font-semibold">{tenant.name}</span>
          </p>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/20 p-3 text-sm text-rose-700 dark:text-rose-200"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="mt-5">
        <label
          htmlFor="roleName"
          className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Role name
        </label>

        {/*
          A <Controller> keeps the field in sync with the form even after
          reset(), so it works for the 2nd, 3rd... role too.
        */}
        <Controller
          control={form.control}
          name="roleName"
          render={({ field, fieldState }) => (
            <>
              <div className="relative">
                <UserCog className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                <input
                  id="roleName"
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="e.g. plant admin"
                  autoComplete="off"
                  aria-invalid={Boolean(fieldState.error)}
                  aria-describedby={
                    fieldState.error ? "roleName-error" : undefined
                  }
                  className={`h-12 w-full rounded-xl border bg-slate-50 dark:bg-slate-800 pl-11 pr-4 text-[15px] text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                    fieldState.error
                      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                      : "border-slate-200 dark:border-slate-700 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
                  }`}
                />
              </div>

              {fieldState.error && (
                <p
                  id="roleName-error"
                  className="mt-1.5 text-xs font-medium text-rose-600 dark:text-rose-400"
                  role="alert"
                >
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />

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