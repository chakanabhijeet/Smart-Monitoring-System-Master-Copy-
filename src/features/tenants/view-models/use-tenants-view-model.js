"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "../services/tenant.service";
import {
  normalizeTenantListResponse,
  normalizeVerifyResponse,
} from "../models/tenant.model";
import { getApiErrorMessage } from "@/lib/api-error";

export const TENANTS_QUERY_KEY = ["tenants"];

// Marks one tenant as verified inside the saved list, so the badge
// turns green immediately without waiting for the server
function markTenantVerified(raw, tenantCode) {
  if (!raw || !Array.isArray(raw.data)) return raw;

  return {
    ...raw,
    data: raw.data.map((item) =>
      item?.tenant_code === tenantCode ? { ...item, is_verified: true } : item
    ),
  };
}

export function useTenantsViewModel() {
  const queryClient = useQueryClient();

  // Toolbar
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | verified | pending

  // Popups
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState(null);
  const [verifyResult, setVerifyResult] = useState(null);
  const [verifyError, setVerifyError] = useState("");

  /* ------------------------------ list ------------------------------ */

  const tenantsQuery = useQuery({
    queryKey: [...TENANTS_QUERY_KEY, sortOrder],
    queryFn: () => tenantService.getTenants(sortOrder),
    select: (raw) => normalizeTenantListResponse(raw).tenants,
    staleTime: 30 * 1000,
  });

  const tenants = tenantsQuery.data ?? [];

  const term = search.trim().toLowerCase();

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      !term ||
      tenant.name.toLowerCase().includes(term) ||
      tenant.code.toLowerCase().includes(term) ||
      tenant.address.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" ? tenant.isVerified : !tenant.isVerified);

    return matchesSearch && matchesStatus;
  });

  const counts = {
    total: tenants.length,
    verified: tenants.filter((tenant) => tenant.isVerified).length,
    pending: tenants.filter((tenant) => !tenant.isVerified).length,
  };

  /* ------------------------------ verify ------------------------------ */

  const verifyMutation = useMutation({
    mutationFn: (tenantCode) => tenantService.verifyTenant(tenantCode),

    onSuccess: (data, tenantCode) => {
      setVerifyResult(normalizeVerifyResponse(data));

      queryClient.setQueriesData({ queryKey: TENANTS_QUERY_KEY }, (raw) =>
        markTenantVerified(raw, tenantCode)
      );

      // Then confirm with the server in the background
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
    },

    onError: (error) => {
      setVerifyError(
        getApiErrorMessage(error, "Unable to verify this tenant.")
      );
    },
  });

  const openVerify = (tenant) => {
    setVerifyTarget(tenant);
    setVerifyResult(null);
    setVerifyError("");
  };

  const closeVerify = () => {
    setVerifyTarget(null);
    setVerifyResult(null);
    setVerifyError("");
  };

  const confirmVerify = () => {
    if (!verifyTarget) return;

    setVerifyError("");
    verifyMutation.mutate(verifyTarget.code);
  };

  return {
    // list
    tenants: filteredTenants,
    counts,
    isLoading: tenantsQuery.isLoading,
    isFetching: tenantsQuery.isFetching,
    isError: tenantsQuery.isError,
    errorMessage: tenantsQuery.isError
      ? getApiErrorMessage(tenantsQuery.error, "Unable to load tenants.")
      : "",
    refresh: () => tenantsQuery.refetch(),

    // toolbar
    sortOrder,
    toggleSortOrder: () =>
      setSortOrder((value) => (value === "asc" ? "desc" : "asc")),
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    // create popup
    isCreateOpen,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),

    // verify popup
    verifyTarget,
    verifyResult,
    verifyError,
    isVerifying: verifyMutation.isPending,
    openVerify,
    closeVerify,
    confirmVerify,
  };
}