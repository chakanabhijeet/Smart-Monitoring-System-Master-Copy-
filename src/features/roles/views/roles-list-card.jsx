"use client";

import { Info, ShieldCheck, Trash2, UserCog } from "lucide-react";

import { formatRoleDateTime } from "../models/role.model";

export default function RolesListCard({ tenant, roles, onDelete }) {
  return (
    <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Roles</h2>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{tenant.name}</p>
          </div>
        </div>

        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold tabular-nums text-slate-600 dark:text-slate-300">
          {roles.length}
        </span>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl bg-sky-100 dark:bg-sky-900/30 p-3 text-xs leading-5 text-sky-800 dark:text-sky-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Shows the roles created from this browser. Roles created elsewhere
          will appear here once the list API is connected.
        </span>
      </div>

      {roles.length === 0 ? (
        <div className="flex flex-col items-center px-4 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
            <UserCog className="h-7 w-7" />
          </div>
          <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
            No roles added yet
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Add the first role for this tenant using the form.
          </p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
          {roles.map((role) => (
            <li
              key={role.id}
              className="flex items-center justify-between gap-3 py-3.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <UserCog className="h-[18px] w-[18px]" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {role.name}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono font-semibold text-slate-600 dark:text-slate-400">
                      ID {role.id}
                    </span>
                    <span className="ml-2">
                      {formatRoleDateTime(role.createdAt)}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onDelete(role)}
                aria-label={`Delete role ${role.name}`}
                title="Delete role"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 dark:text-slate-500 transition hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
              >
                <Trash2 className="h-[18px] w-[18px]" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}