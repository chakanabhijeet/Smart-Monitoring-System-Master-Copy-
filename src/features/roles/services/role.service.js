import apiClient from "@/lib/axios/client";
import { API_ENDPOINTS } from "@/config/api-endpoints";

/*
 * Some answers come back with a normal 200 status but an error inside,
 * e.g. { "error": "..." }. This turns those into real errors so the
 * screens can show them.
 */
function failWith(response, message) {
  const error = new Error(message);
  error.response = { status: response.status, data: response.data };
  throw error;
}

function hasErrorBody(data) {
  return Boolean(
    data && typeof data === "object" && !Array.isArray(data) && data.error
  );
}

export const roleService = {
  // POST /user-role/createrolesuper   body: { user_role, tenant_id }
  createRole: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.USER_ROLES.CREATE,
      payload
    );

    if (hasErrorBody(response.data)) {
      failWith(response, String(response.data.error));
    }

    return response.data;
  },

  // POST /user-role/delete   body: { id, tenant_id }
  deleteRole: async (payload) => {
    const response = await apiClient.post(
      API_ENDPOINTS.USER_ROLES.DELETE,
      payload
    );

    if (hasErrorBody(response.data)) {
      failWith(response, String(response.data.error));
    }

    return response.data;
  },

  /*
   * TODO: when the backend adds a list API, add it here, e.g.
   *   getRoles: async (tenantId) => { ... POST /user-role/list ... }
   * and use it in use-roles-view-model.js instead of the browser store.
   */
};