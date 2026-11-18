"use client";

import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";

import Modal from "@/components/common/modal";
import { useCreateTenantViewModel } from "../view-models/use-create-tenant-view-model";

function inputClasses(invalid) {
  return `h-12 w-full rounded-xl border bg-slate-50 px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
    invalid
      ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
      : "border-slate-200 focus:border-[#3b4fe0] focus:ring-[#3b4fe0]/15"
  }`;
}

function Field({ label, htmlFor, hint, error, children }) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600" role="alert">
          {error}
        </p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
    </div>
  );
}

export default function CreateTenantModal({ onClose }) {
  const { form, onSubmit, isSaving, serverError, createdTenant, addAnother } =
    useCreateTenantViewModel();

  const {
    register,
    formState: { errors },
  } = form;

  /* ------------------------------ success ------------------------------ */

  if (createdTenant) {
    return (
      <Modal
        title="Tenant created"
        description="The new tenant has been added to the list."
        icon={CheckCircle2}
        tone="emerald"
        onClose={onClose}
      >
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-bold text-emerald-900">
            {createdTenant.name}
          </p>
          <p className="mt-1 text-xs text-emerald-800">
            Tenant code:{" "}
            <span className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold">
              {createdTenant.code}
            </span>
          </p>
          {createdTenant.address && (
            <p className="mt-1 text-xs text-emerald-800">
              Address: {createdTenant.address}
            </p>
          )}
        </div>

        <p className="mt-4 text-sm text-slate-500">
          This tenant is <span className="font-semibold">not verified</span>{" "}
          yet. In the list, click its amber badge to verify it.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={addAnother}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Add another
          </button>
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

  /* ------------------------------ form ------------------------------ */

  return (
    <Modal
      title="Add tenant"
      description="Create a new tenant. It starts as not verified."
      icon={Building2}
      tone="indigo"
      closeDisabled={isSaving}
      onClose={onClose}
    >
      {serverError && (
        <div
          className="mb-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          role="alert"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-4">
        <Field
          label="Tenant name"
          htmlFor="tenantName"
          error={errors.tenantName?.message}
        >
          <input
            id="tenantName"
            placeholder="e.g. Abhijeet Plastics Chakan"
            autoComplete="off"
            className={inputClasses(Boolean(errors.tenantName))}
            {...register("tenantName")}
          />
        </Field>

        <Field
          label="Tenant code"
          htmlFor="tenantCode"
          hint="Must be unique. Letters, numbers, - and _ only."
          error={errors.tenantCode?.message}
        >
          <input
            id="tenantCode"
            placeholder="e.g. chakan"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className={`${inputClasses(Boolean(errors.tenantCode))} font-mono`}
            {...register("tenantCode")}
          />
        </Field>

        <Field
          label="Address"
          htmlFor="address"
          error={errors.address?.message}
        >
          <input
            id="address"
            placeholder="e.g. Chakan, Pune"
            autoComplete="off"
            className={inputClasses(Boolean(errors.address))}
            {...register("address")}
          />
        </Field>

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#3453e0] to-[#1f84d6] px-6 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create tenant
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}