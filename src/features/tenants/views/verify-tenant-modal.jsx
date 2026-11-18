"use client";

import { AlertCircle, BadgeCheck, RefreshCw, ShieldAlert } from "lucide-react";

import Modal from "@/components/common/modal";

export default function VerifyTenantModal({
  tenant,
  isVerifying,
  result,
  error,
  onConfirm,
  onClose,
}) {
  /* ------------------------------ done ------------------------------ */

  if (result) {
    return (
      <Modal
        title={result.alreadyVerified ? "Already verified" : "Tenant verified"}
        icon={BadgeCheck}
        tone="emerald"
        size="sm"
        onClose={onClose}
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">{tenant.name}</p>
          <p className="mt-1 text-xs text-emerald-800">
            Tenant code:{" "}
            <span className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold">
              {tenant.code}
            </span>
          </p>
          <p className="mt-3 text-sm font-medium text-emerald-800">
            {result.message}
          </p>
        </div>

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
      title="Verify tenant"
      description="Please check the details below before verifying."
      icon={ShieldAlert}
      tone="amber"
      size="sm"
      closeDisabled={isVerifying}
      onClose={onClose}
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-bold text-slate-900">{tenant.name}</p>
        <p className="mt-1 text-xs text-slate-500">
          Tenant code:{" "}
          <span className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-slate-800">
            {tenant.code}
          </span>
        </p>
        {tenant.address && (
          <p className="mt-1 text-xs text-slate-500">
            Address: {tenant.address}
          </p>
        )}
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

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isVerifying}
          className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isVerifying}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 text-sm font-bold text-white shadow-md shadow-emerald-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <BadgeCheck className="h-4 w-4" />
              {error ? "Try again" : "Verify tenant"}
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}