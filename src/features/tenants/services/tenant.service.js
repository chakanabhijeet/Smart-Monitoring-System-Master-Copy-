import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";

/*
 * Some answers come back with a normal 200 status but an error inside,
 * e.g. { "error": "tenant Code already exists" }.
 * This turns those into real errors so the screens can show them.
 */
function failWith(response, message) {
  const error = new Error(message);
  error.response = { status: response.status, data: response.data };
  throw error;
}

export const tenantService = {
  // POST /tenant/createtenant
  createTenant: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.TENANTS.CREATE,
      payload
    );

    const data = response.data;

    if (data && typeof data === "object" && data.error) {
      failWith(response, String(data.error));
    }

    return data;
  },

  // POST /tenant/list   body: { sort_order: "asc" | "desc" }
  getTenants: async (sortOrder = "asc") => {
    const response = await apiClient.post(API_ENDPOINTS.TENANTS.LIST, {
      sort_order: sortOrder,
    });

    const data = response.data;

    if (data?.sucess === false || data?.success === false) {
      failWith(response, data?.message || "Unable to load tenants.");
    }

    return data;
  },

  // POST /tenant/verifytenant   body: { tenant_code }
  verifyTenant: async (tenantCode) => {
    const response = await apiClient.post(API_ENDPOINTS.TENANTS.VERIFY, {
      tenant_code: tenantCode,
    });

    const data = response.data;

    if (data && typeof data === "object" && data.error) {
      failWith(response, String(data.error));
    }

    return data;
  },
};