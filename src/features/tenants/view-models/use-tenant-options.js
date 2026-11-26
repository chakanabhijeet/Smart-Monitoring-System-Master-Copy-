
"use client";

import { useQuery } from "@tanstack/react-query";

import { tenantListQuery } from "../queries/tenant.queries";
import { getApiErrorMessage } from "@/lib/api-error";

/*
 * Tenants for dropdowns on other screens (roles, employees, ...).
 * It uses the SAME saved list as the Tenants page (tenantListQuery),
 * so if you have already opened that page the dropdown fills instantly
 * with no extra request.
 */
export function useTenantOptions() {
  const query = useQuery(tenantListQuery("asc"));

  return {
    tenants: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    errorMessage: query.isError
      ? getApiErrorMessage(query.error, "Unable to load tenants.")
      : "",
    retry: () => query.refetch(),
  };
}