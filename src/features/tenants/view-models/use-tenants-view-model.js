"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "../services/tenant.service";
import { normalizeVerifyResponse } from "../models/tenant.model";
import {
  TENANTS_QUERY_KEY,
  markTenantVerified,
  tenantListQuery,
} from "../queries/tenant.queries";
import { useTenantsStore } from "../store/tenants.store";
import { getApiErrorMessage } from "@/lib/api-error";

// Other screens may still import the key from this file, so keep it here too.
export { TENANTS_QUERY_KEY };

export function useTenantsViewModel() {
  const queryClient = useQueryClient();

  /* ------------------------ screen state (Zustand) ------------------------ */

  // Toolbar
  const sortOrder = useTenantsStore((state) => state.sortOrder);
  const search = useTenantsStore((state) => state.search);
  const statusFilter = useTenantsStore((state) => state.statusFilter);
  const setSearch = useTenantsStore((state) => state.setSearch);
  const setStatusFilter = useTenantsStore((state) => state.setStatusFilter);
  const toggleSortOrder = useTenantsStore((state) => state.toggleSortOrder);

  // "Add tenant" popup
  const isCreateOpen = useTenantsStore((state) => state.isCreateOpen);
  const openCreate = useTenantsStore((state) => state.openCreate);
  const closeCreate = useTenantsStore((state) => state.closeCreate);

  // "Verify tenant" popup
  const verifyTarget = useTenantsStore((state) => state.verifyTarget);
  const verifyResult = useTenantsStore((state) => state.verifyResult);
  const verifyError = useTenantsStore((state) => state.verifyError);
  const setVerifyResult = useTenantsStore((state) => state.setVerifyResult);
  const setVerifyError = useTenantsStore((state) => state.setVerifyError);
  const openVerify = useTenantsStore((state) => state.openVerify);
  const closeVerify = useTenantsStore((state) => state.closeVerify);

  // Leaving the page closes any popup that is still open
  const resetPopups = useTenantsStore((state) => state.resetPopups);

  useEffect(() => () => resetPopups(), [resetPopups]);

  /* ------------------------------ list (TanStack Query) ------------------------------ */

  const tenantsQuery = useQuery(tenantListQuery(sortOrder));

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

  /* ------------------------------ verify (TanStack Query) ------------------------------ */

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
    toggleSortOrder,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,

    // create popup
    isCreateOpen,
    openCreate,
    closeCreate,

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