"use client";

import { Controller } from "react-hook-form";
import { Hash, Trash2 } from "lucide-react";

export default function DeleteByIdCard({ tenant, form, onSubmit }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
          <Trash2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Delete by role ID
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            For a role that is not in the list on the right.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-5">
        <label
          htmlFor="roleId"
          className="mb-1.5 block text-sm font-semibold text-slate-800 dark:text-slate-200"
        >
          Role ID
        </label>

        <Controller
          control={form.control}
          name="roleId"
          render={({ field, fieldState }) => (
            <>
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Hash className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400 dark:text-slate-400" />
                  <input
                    id="roleId"
                    name={field.name}
                    ref={field.ref}
                    value={field.value ?? ""}
                    // keeps only digits, so the ID is always a number
                    onChange={(event) =>
                      field.onChange(event.target.value.replace(/\D/g, ""))
                    }
                    onBlur={field.onBlur}
                    inputMode="numeric"
                    placeholder="e.g. 9"
                    autoComplete="off"
                    aria-invalid={Boolean(fieldState.error)}
                    aria-describedby={
                      fieldState.error ? "roleId-error" : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-slate-50 dark:bg-slate-800 pl-11 pr-4 font-mono text-[15px] text-slate-900 dark:text-white outline-none transition placeholder:font-sans placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 ${
                      fieldState.error
                        ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                        : "border-slate-200 dark:border-slate-700 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/30 bg-rose-50 dark:bg-rose-900/20 px-5 text-sm font-bold text-rose-700 dark:text-rose-200 transition hover:bg-rose-100 dark:hover:bg-rose-900/30"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>

              {fieldState.error && (
                <p
                  id="roleId-error"
                  className="mt-1.5 text-xs font-medium text-rose-600"
                  role="alert"
                >
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />

        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          The role is deleted from{" "}
          <span className="font-semibold">{tenant.name}</span>. You will be
          asked to confirm first.
        </p>
      </form>
    </section>
  );
}