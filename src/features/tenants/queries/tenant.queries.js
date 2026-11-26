/*
 * ====================================================================
 *  TENANT QUERIES  -  everything TanStack Query needs for the tenant list
 * ====================================================================
 *
 *  Path: src/features/tenants/queries/tenant.queries.js
 *
 *  The Tenants page and the tenant dropdowns on other screens both use
 *  tenantListQuery(), so they always share ONE saved list.
 */

import { tenantService } from "../services/tenant.service";
import { normalizeTenantListResponse } from "../models/tenant.model";

export const TENANTS_QUERY_KEY = ["tenants"];

/*
 * Query keys.
 *   tenantKeys.all        matches every tenant query (used after create / verify)
 *   tenantKeys.list("asc") the list in one sort order
 */
export const tenantKeys = {
  all: TENANTS_QUERY_KEY,
  list: (sortOrder) => [...TENANTS_QUERY_KEY, sortOrder],
};

// Raw API answer -> clean list of tenants
const selectTenants = (raw) => normalizeTenantListResponse(raw).tenants;

// The tenant list (sortOrder: "asc" = oldest first, "desc" = newest first)
export function tenantListQuery(sortOrder = "asc") {
  return {
    queryKey: tenantKeys.list(sortOrder),
    queryFn: () => tenantService.getTenants(sortOrder),
    select: selectTenants,
    staleTime: 30 * 1000,
  };
}

// Marks one tenant as verified inside the saved list, so the badge
// turns green immediately without waiting for the server
export function markTenantVerified(raw, tenantCode) {
  if (!raw || !Array.isArray(raw.data)) return raw;

  return {
    ...raw,
    data: raw.data.map((item) =>
      item?.tenant_code === tenantCode ? { ...item, is_verified: true } : item
    ),
  };
}