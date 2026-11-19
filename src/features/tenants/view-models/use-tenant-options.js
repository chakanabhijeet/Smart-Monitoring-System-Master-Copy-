"use client";

import { useQuery } from "@tanstack/react-query";

import { tenantService } from "../services/tenant.service";
import { normalizeTenantListResponse } from "../models/tenant.model";
import { getApiErrorMessage } from "@/lib/api-error";
import { TENANTS_QUERY_KEY } from "./use-tenants-view-model";

/*
 * Tenants for dropdowns on other screens (roles, employees, ...).
 * It uses the SAME saved list as the Tenants page, so if you have already
 * opened that page the dropdown fills instantly with no extra request.
 */
export function useTenantOptions() {
  const query = useQuery({
    queryKey: [...TENANTS_QUERY_KEY, "asc"],
    queryFn: () => tenantService.getTenants("asc"),
    select: (raw) => normalizeTenantListResponse(raw).tenants,
    staleTime: 30 * 1000,
  });

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