import { BASE_URL1 } from "./constants";
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/users/loginuser",
  },

  DASHBOARD: {
    SUMMARY: "/dashboard",
  },

  USERS: {
    LIST: "/users",
    DETAIL: (id) => `/users/${id}`,
  },

  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id) => `/products/${id}`,
  },

  DEPARTMENTS: {
    CREATE: "/dept/createdept",
  },

  PERMISSIONS: {
    CREATE: "/permission/createpermission",
  },

  PRODUCTION: {
    ASSEMBLY_SHIFT: "/proddata/assemblyshift",
    PROD_DATA: "/proddata/yesterday",

    IMM_SHIFTWISE: `${BASE_URL1}/proddata/immshiftwise`,
    IMM_LOG: `${BASE_URL1}/proddata/immlog`,
  },

  TENANTS: {
    CREATE: `${BASE_URL1}/tenant/createtenant`,
    LIST: `${BASE_URL1}/tenant/list`,
    VERIFY: `${BASE_URL1}/tenant/verifytenant`,
  },

  USER_ROLES: {
    CREATE: `${BASE_URL1}/user-role/createrolesuper`,
    DELETE: `${BASE_URL1}/user-role/delete`,
  },
};