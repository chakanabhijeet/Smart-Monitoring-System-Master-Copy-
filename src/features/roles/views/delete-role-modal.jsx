"use client";

import {
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  SearchX,
  Trash2,
} from "lucide-react";

import Modal from "@/components/common/modal";

function Details({ target, tone }) {
  const box =
    tone === "emerald"
      ? "border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/20"
      : tone === "amber"
        ? "border-amber-200 dark:border-amber-900/30 bg-amber-50 dark:bg-amber-900/20"
        : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800";

  return (
    <div className={`rounded-xl border p-4 ${box}`}>
      {target.name && (
        <p className="text-sm font-bold text-slate-900 dark:text-white">{target.name}</p>
      )}
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
        Role ID:{" "}
        <span className="rounded bg-white dark:bg-slate-900 px-1.5 py-0.5 font-mono font-semibold text-slate-800 dark:text-white">
          {target.id}
        </span>
      </p>
      {target.tenantName && (
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Tenant: <span className="font-semibold">{target.tenantName}</span>
        </p>
      )}
    </div>
  );
}

export default function DeleteRoleModal({
  target,
  outcome,
  error,
  isDeleting,
  onConfirm,
  onClose,
}) {
  /* ------------------------------ result ------------------------------ */

  if (outcome) {
    const notFound = outcome.outcome === "not_found";

    return (
      <Modal
        title={notFound ? "Role not found" : "Role deleted"}
        icon={notFound ? SearchX : CheckCircle2}
        tone={notFound ? "amber" : "emerald"}
        size="sm"
        onClose={onClose}
      >
        <Details target={target} tone={notFound ? "amber" : "emerald"} />

        <p
          className={`mt-4 text-sm font-medium ${
            notFound ? "text-amber-800 dark:text-amber-200" : "text-emerald-800 dark:text-emerald-200"
          }`}
        >
          {outcome.message}
        </p>

        {notFound && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            It may already have been deleted. It has been removed from your
            list.
          </p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-[#3453e0] to-[#1f84d6] px-6 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110"
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  /* ------------------------------ confirm ------------------------------ */

  return (
    <Modal
      title="Delete role?"
      description="This cannot be undone."
      icon={Trash2}
      tone="rose"
      size="sm"
      closeDisabled={isDeleting}
      onClose={onClose}
    >
      <Details target={target} />

      {error && (
        <div
          className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-6 text-sm font-bold text-white shadow-md shadow-rose-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              {error ? "Try again" : "Delete role"}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}