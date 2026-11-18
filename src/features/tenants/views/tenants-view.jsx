"use client";

import {
  AlertCircle,
  ArrowUpDown,
  BadgeCheck,
  Building2,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
} from "lucide-react";

import { useTenantsViewModel } from "../view-models/use-tenants-view-model";
import { formatTenantDate } from "../models/tenant.model";
import CreateTenantModal from "./create-tenant-modal";
import VerifyTenantModal from "./verify-tenant-modal";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "verified", label: "Verified" },
  { value: "pending", label: "Not verified" },
];

function StatTile({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold tabular-nums text-slate-900">
          {value}
        </p>
      </div>
    </div>
  );
}

// Green badge when verified. Amber, clickable badge when not.
function VerificationBadge({ tenant, onVerify }) {
  if (tenant.isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
        <BadgeCheck className="h-3.5 w-3.5" />
        Verified
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onVerify(tenant)}
      title="Click to verify this tenant"
      className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-200 transition hover:-translate-y-0.5 hover:bg-amber-100 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      <ShieldAlert className="h-3.5 w-3.5" />
      Not verified
      <span className="font-medium opacity-70">· Verify</span>
    </button>
  );
}

function ActiveBadge({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        active ? "bg-sky-50 text-sky-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-sky-500" : "bg-slate-400"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function SkeletonRows() {
  return Array.from({ length: 5 }).map((_, index) => (
    <tr key={index} className="border-t border-slate-100">
      <td className="px-5 py-4">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-200" />
        <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-100" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
      </td>
      <td className="px-5 py-4">
        <div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" />
      </td>
      <td className="px-5 py-4">
        <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
      </td>
      <td className="px-5 py-4">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      </td>
    </tr>
  ));
}

export default function TenantsView() {
  const {
    tenants,
    counts,
    isLoading,
    isFetching,
    isError,
    errorMessage,
    refresh,

    sortOrder,
    toggleSortOrder,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    isCreateOpen,
    openCreate,
    closeCreate,

    verifyTarget,
    verifyResult,
    verifyError,
    isVerifying,
    openVerify,
    closeVerify,
    confirmVerify,
  } = useTenantsViewModel();

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto w-full max-w-[1400px] min-w-0">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Tenants</h1>
              <p className="text-sm text-slate-500">
                Create tenants and verify them
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={refresh}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#3453e0] to-[#1f84d6] px-4 py-2 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              Add tenant
            </button>
          </div>
        </header>

        {/* Numbers */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile
            icon={Building2}
            label="Total tenants"
            value={counts.total}
            tone="bg-indigo-50 text-indigo-600"
          />
          <StatTile
            icon={BadgeCheck}
            label="Verified"
            value={counts.verified}
            tone="bg-emerald-50 text-emerald-600"
          />
          <StatTile
            icon={ShieldAlert}
            label="Waiting for verification"
            value={counts.pending}
            tone="bg-amber-50 text-amber-600"
          />
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, code or address"
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#3b4fe0] focus:ring-4 focus:ring-[#3b4fe0]/15"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setStatusFilter(filter.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                    statusFilter === filter.value
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleSortOrder}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowUpDown className="h-4 w-4 text-slate-400" />
              {sortOrder === "asc" ? "Oldest first" : "Newest first"}
            </button>
          </div>
        </div>

        {/* Error */}
        {isError && (
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Unable to load tenants</p>
                <p className="mt-0.5 break-words">{errorMessage}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex shrink-0 items-center justify-center rounded-lg border border-amber-300 bg-white px-3 py-1.5 font-semibold text-amber-800 hover:bg-amber-100"
            >
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Tenant</th>
                  <th className="px-5 py-3 font-semibold">Address</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Verification</th>
                  <th className="px-5 py-3 font-semibold">Created</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <SkeletonRows />
                ) : tenants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-14 text-center text-slate-500"
                    >
                      {isError
                        ? "No data to show."
                        : counts.total === 0
                          ? "No tenants yet. Click “Add tenant” to create the first one."
                          : "No tenants match your search."}
                    </td>
                  </tr>
                ) : (
                  tenants.map((tenant) => (
                    <tr
                      key={tenant.id ?? tenant.code}
                      className="border-t border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">
                          {tenant.name}
                        </p>
                        <span className="mt-1 inline-block rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-slate-600">
                          {tenant.code}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {tenant.address ? (
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            {tenant.address}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <ActiveBadge active={tenant.isActive} />
                      </td>

                      <td className="px-5 py-4">
                        <VerificationBadge
                          tenant={tenant}
                          onVerify={openVerify}
                        />
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatTenantDate(tenant.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Popups. They are mounted only while open, so their form starts fresh each time. */}
      {isCreateOpen && <CreateTenantModal onClose={closeCreate} />}

      {verifyTarget && (
        <VerifyTenantModal
          tenant={verifyTarget}
          isVerifying={isVerifying}
          result={verifyResult}
          error={verifyError}
          onConfirm={confirmVerify}
          onClose={closeVerify}
        />
      )}
    </main>
  );
}