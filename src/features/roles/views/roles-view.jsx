"use client";

import Link from "next/link";
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronDown,
  MousePointerClick,
  RefreshCw,
  ShieldAlert,
  UserCog,
  X,
} from "lucide-react";

import { useRolesViewModel } from "../view-models/use-roles-view-model";
import AddRoleCard from "./add-role-card";
import DeleteByIdCard from "./delete-by-id-card";
import DeleteRoleModal from "./delete-role-modal";
import RolesListCard from "./roles-list-card";

function TenantStatus({ tenant }) {
  if (tenant.isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200">
      <ShieldAlert className="h-3.5 w-3.5" />
      Not verified
    </span>
  );
}

export default function RolesView() {
  const {
    tenants,
    isLoadingTenants,
    isTenantsError,
    tenantsErrorMessage,
    retryTenants,
    tenantId,
    tenant,
    selectTenant,

    roles,

    notice,
    dismissNotice,

    addForm,
    onAdd,
    isCreating,
    createError,

    idForm,
    onDeleteById,

    deleteTarget,
    deleteOutcome,
    deleteError,
    isDeleting,
    requestDelete,
    closeDelete,
    confirmDelete,
  } = useRolesViewModel();

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1400px] min-w-0">
        {/* Header */}
        <header className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
            <UserCog className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Roles</h1>
            <p className="text-sm text-slate-500">
              Create and delete roles for a tenant
            </p>
          </div>
        </header>

        {/* Message */}
        {notice && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-5 flex items-start gap-3 rounded-2xl border p-4 text-sm ${
              notice.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {notice.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            )}
            <p className="flex-1 font-medium">{notice.text}</p>
            <button
              type="button"
              onClick={dismissNotice}
              aria-label="Dismiss message"
              className="rounded-lg p-1 transition hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Tenant picker */}
        <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <label
            htmlFor="tenantId"
            className="mb-1.5 block text-sm font-semibold text-slate-800"
          >
            Tenant
          </label>

          {isLoadingTenants ? (
            <div className="h-12 w-full animate-pulse rounded-xl bg-slate-200 sm:max-w-md" />
          ) : isTenantsError ? (
            <div className="flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                  <p className="font-semibold">Unable to load tenants</p>
                  <p className="mt-0.5 break-words">{tenantsErrorMessage}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={retryTenants}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-semibold text-amber-800 hover:bg-amber-100"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </div>
          ) : tenants.length === 0 ? (
            <p className="text-sm text-slate-500">
              There are no tenants yet.{" "}
              <Link
                href="/tenants"
                className="font-semibold text-[#3b4fe0] hover:underline"
              >
                Create a tenant
              </Link>{" "}
              first.
            </p>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:max-w-md">
                <Building2 className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-400" />
                <select
                  id="tenantId"
                  value={tenantId}
                  onChange={(event) => selectTenant(event.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-[15px] text-slate-900 outline-none transition focus:border-[#3b4fe0] focus:bg-white focus:ring-4 focus:ring-[#3b4fe0]/15"
                >
                  <option value="" disabled>
                    Select a tenant
                  </option>
                  {tenants.map((item) => (
                    <option key={item.id} value={String(item.id)}>
                      {item.name} ({item.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>

              {tenant && <TenantStatus tenant={tenant} />}
            </div>
          )}

          {tenant && !tenant.isVerified && (
            <p className="mt-3 text-xs text-amber-700">
              This tenant is not verified yet. You can verify it from the{" "}
              <Link href="/tenants" className="font-semibold underline">
                Tenants page
              </Link>
              .
            </p>
          )}
        </section>

        {/* Work area */}
        {tenant ? (
          <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div className="space-y-5">
              <AddRoleCard
                tenant={tenant}
                form={addForm}
                onSubmit={onAdd}
                isSaving={isCreating}
                error={createError}
              />
              <DeleteByIdCard
                tenant={tenant}
                form={idForm}
                onSubmit={onDeleteById}
              />
            </div>

            <RolesListCard
              tenant={tenant}
              roles={roles}
              onDelete={requestDelete}
            />
          </div>
        ) : (
          !isLoadingTenants &&
          !isTenantsError &&
          tenants.length > 0 && (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                <MousePointerClick className="h-7 w-7" />
              </div>
              <p className="mt-4 text-base font-semibold text-slate-800">
                Select a tenant to manage its roles
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Choose a tenant above to add or delete roles.
              </p>
            </div>
          )
        )}
      </div>

      {/* Popup. Mounted only while open. */}
      {deleteTarget && (
        <DeleteRoleModal
          target={deleteTarget}
          outcome={deleteOutcome}
          error={deleteError}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onClose={closeDelete}
        />
      )}
    </main>
  );
}