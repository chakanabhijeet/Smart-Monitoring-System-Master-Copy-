import { create } from "zustand";
import { persist } from "zustand/middleware";

/*
 * There is no "list roles" API yet, so this remembers the roles created
 * from THIS browser, grouped by tenant. When a list API exists, delete this
 * store and load the roles from the server instead.
 */
export const useRoleStore = create(
  persist(
    (set) => ({
      // { "3": [ { id, tenantId, name, createdAt }, ... ], ... }
      rolesByTenant: {},

      addRole: (role) =>
        set((state) => {
          const key = String(role.tenantId);
          const current = state.rolesByTenant[key] ?? [];
          const others = current.filter((item) => item.id !== role.id);

          return {
            rolesByTenant: {
              ...state.rolesByTenant,
              [key]: [role, ...others], // newest first
            },
          };
        }),

      removeRole: (tenantId, roleId) =>
        set((state) => {
          const key = String(tenantId);
          const current = state.rolesByTenant[key] ?? [];

          return {
            rolesByTenant: {
              ...state.rolesByTenant,
              [key]: current.filter((item) => item.id !== roleId),
            },
          };
        }),
    }),
    {
      name: "xoomgrid-roles",
      partialize: (state) => ({ rolesByTenant: state.rolesByTenant }),
    }
  )
);