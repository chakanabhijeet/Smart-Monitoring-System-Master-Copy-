"use client";

import { Hash, Trash2 } from "lucide-react";

export default function DeleteByIdCard({ tenant, form, onSubmit }) {
  const {
    register,
    formState: { errors },
  } = form;

  const invalid = Boolean(errors.roleId);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <Trash2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">
            Delete by role ID
          </h2>
          <p className="text-xs text-slate-500">
            For a role that is not in the list on the right.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} noValidate className="mt-5">
        <label
          htmlFor="roleId"
          className="mb-1.5 block text-sm font-semibold text-slate-800"
        >
          Role ID
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Hash className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
            <input
              id="roleId"
              inputMode="numeric"
              placeholder="e.g. 9"
              autoComplete="off"
              aria-invalid={invalid}
              aria-describedby={invalid ? "roleId-error" : undefined}
              className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 font-mono text-[15px] text-slate-900 outline-none transition placeholder:font-sans placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                invalid
                  ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                  : "border-slate-200 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
              }`}
              {...register("roleId")}
            />
          </div>

          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        {errors.roleId && (
          <p
            id="roleId-error"
            className="mt-1.5 text-xs font-medium text-rose-600"
            role="alert"
          >
            {errors.roleId.message}
          </p>
        )}

        <p className="mt-3 text-xs text-slate-400">
          The role is deleted from <span className="font-semibold">{tenant.name}</span>.
          You will be asked to confirm first.
        </p>
      </form>
    </section>
  );
}