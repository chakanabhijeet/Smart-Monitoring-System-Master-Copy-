/*
 * ====================================================================
 *  TENANTS STORE (Zustand)
 * ====================================================================
 *
 *  Path: src/features/tenants/store/tenants.store.js
 *
 *  Holds the screen state of the Tenants page:
 *    - toolbar: sort order, search text, status filter
 *    - "Add tenant" popup: open / closed, created tenant, server error
 *    - "Verify tenant" popup: which tenant, result, error
 *
 *  The tenant LIST itself is not here. It lives in TanStack Query
 *  (see ../queries/tenant.queries.js).
 *
 *  Any component can read it, e.g.
 *    const search = useTenantsStore((state) => state.search);
 */

import { create } from "zustand";

// Popup state. Used to start and to reset (when the page is left).
const POPUPS_CLOSED = {
  isCreateOpen: false,
  createdTenant: null,
  createError: "",

  verifyTarget: null,
  verifyResult: null,
  verifyError: "",
};

export const useTenantsStore = create((set) => ({
  /* ---------------- toolbar ---------------- */

  sortOrder: "asc", // "asc" = oldest first, "desc" = newest first
  search: "",
  statusFilter: "all", // all | verified | pending

  setSearch: (search) => set({ search }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  toggleSortOrder: () =>
    set((state) => ({ sortOrder: state.sortOrder === "asc" ? "desc" : "asc" })),

  /* ---------------- popups ---------------- */

  ...POPUPS_CLOSED,

  // "Add tenant"
  openCreate: () =>
    set({ isCreateOpen: true, createdTenant: null, createError: "" }),
  closeCreate: () =>
    set({ isCreateOpen: false, createdTenant: null, createError: "" }),
  setCreatedTenant: (createdTenant) => set({ createdTenant }),
  setCreateError: (createError) => set({ createError }),
  // "Add another" button on the success screen
  addAnother: () => set({ createdTenant: null, createError: "" }),

  // "Verify tenant"
  openVerify: (tenant) =>
    set({ verifyTarget: tenant, verifyResult: null, verifyError: "" }),
  closeVerify: () =>
    set({ verifyTarget: null, verifyResult: null, verifyError: "" }),
  setVerifyResult: (verifyResult) => set({ verifyResult }),
  setVerifyError: (verifyError) => set({ verifyError }),

  // Closes every popup (called when the Tenants page is left)
  resetPopups: () => set(POPUPS_CLOSED),
}));