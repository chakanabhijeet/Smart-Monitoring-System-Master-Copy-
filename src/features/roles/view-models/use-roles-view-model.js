"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import { roleService } from "../services/role.service";
import { deleteByIdSchema, roleSchema } from "../models/role.schema";
import {
  buildCreateRolePayload,
  buildDeleteRolePayload,
  normalizeDeleteResponse,
  normalizeRole,
} from "../models/role.model";
import { useRoleStore } from "../store/role.store";
import { useTenantOptions } from "@/features/tenants/view-models/use-tenant-options";
import { getApiErrorMessage } from "@/lib/api-error";

const NO_ROLES = [];
const NOTICE_MS = 6000;

export function useRolesViewModel() {
  /* ------------------------------ tenant ------------------------------ */

  const {
    tenants,
    isLoading: isLoadingTenants,
    isError: isTenantsError,
    errorMessage: tenantsErrorMessage,
    retry: retryTenants,
  } = useTenantOptions();

  const [pickedTenantId, setPickedTenantId] = useState("");

  // With only one tenant there is nothing to choose, so it is selected for you
  const onlyTenantId = tenants.length === 1 ? String(tenants[0].id) : "";
  const tenantId = pickedTenantId || onlyTenantId;
  const tenant =
    tenants.find((item) => String(item.id) === tenantId) ?? null;

  /* ------------------------------ roles (this browser) ------------------------------ */

  const roles = useRoleStore((state) => state.rolesByTenant[tenantId]) ?? NO_ROLES;
  const addRole = useRoleStore((state) => state.addRole);
  const removeRole = useRoleStore((state) => state.removeRole);

  /* ------------------------------ messages ------------------------------ */

  const [notice, setNotice] = useState(null); // { type: "success" | "error", text }

  useEffect(() => {
    if (!notice) return undefined;

    const timer = setTimeout(() => setNotice(null), NOTICE_MS);

    return () => clearTimeout(timer);
  }, [notice]);

  /* ------------------------------ forms ------------------------------ */

  const addForm = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: { roleName: "" },
    mode: "onTouched",
  });

  const idForm = useForm({
    resolver: zodResolver(deleteByIdSchema),
    defaultValues: { roleId: "" },
    mode: "onTouched",
  });

  const [createError, setCreateError] = useState("");

  const selectTenant = (value) => {
    setPickedTenantId(value);
    setCreateError("");
    setNotice(null);
    addForm.reset({ roleName: "" });
    idForm.reset({ roleId: "" });
  };

  /* ------------------------------ create ------------------------------ */

  const createMutation = useMutation({
    mutationFn: ({ roleName, tenantId: targetTenantId }) =>
      roleService.createRole(
        buildCreateRolePayload({ roleName, tenantId: targetTenantId })
      ),

    onSuccess: (data, variables) => {
      const role = normalizeRole(data, Number(variables.tenantId));

      if (role.id !== null) addRole(role);

      addForm.reset({ roleName: "" });

      setNotice({
        type: "success",
        text: `Role “${role.name || variables.roleName}” was created${
          role.id !== null ? ` (ID ${role.id})` : ""
        }.`,
      });
    },

    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to create the role. Please try again."
      );

      // "already exists" belongs under the Role name field
      if (/exist|already|duplicate/i.test(message)) {
        addForm.setError("roleName", { type: "server", message });
        return;
      }

      setCreateError(message);
    },
  });

  const onAdd = addForm.handleSubmit((values) => {
    if (!tenantId) return;

    setCreateError("");
    createMutation.mutate({ roleName: values.roleName, tenantId });
  });

  /* ------------------------------ delete ------------------------------ */

  // { id, name, tenantId, tenantName }  (name is empty when deleting by ID)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteOutcome, setDeleteOutcome] = useState(null); // { outcome, message }
  const [deleteError, setDeleteError] = useState("");

  const finishDelete = (variables, result) => {
    // Deleted, or already gone: either way it must leave the list
    removeRole(variables.tenantId, variables.id);
    setDeleteOutcome(result);
    idForm.reset({ roleId: "" });
  };

  const deleteMutation = useMutation({
    mutationFn: ({ id, tenantId: targetTenantId }) =>
      roleService.deleteRole(
        buildDeleteRolePayload({ id, tenantId: targetTenantId })
      ),

    onSuccess: (data, variables) => {
      finishDelete(variables, normalizeDeleteResponse(data));
    },

    onError: (error, variables) => {
      const message = getApiErrorMessage(
        error,
        "Unable to delete the role. Please try again."
      );

      // Some servers answer "not found" with an error status
      if (/not\s*found/i.test(message)) {
        finishDelete(variables, { outcome: "not_found", message });
        return;
      }

      setDeleteError(message);
    },
  });

  const openDelete = (target) => {
    setDeleteTarget(target);
    setDeleteOutcome(null);
    setDeleteError("");
  };

  const requestDelete = (role) => {
    openDelete({
      id: role.id,
      name: role.name,
      tenantId,
      tenantName: tenant?.name ?? "",
    });
  };

  const onDeleteById = idForm.handleSubmit(({ roleId }) => {
    if (!tenantId) return;

    const id = Number(roleId);
    const known = roles.find((item) => item.id === id);

    openDelete({
      id,
      name: known?.name ?? "",
      tenantId,
      tenantName: tenant?.name ?? "",
    });
  });

  const closeDelete = () => {
    setDeleteTarget(null);
    setDeleteOutcome(null);
    setDeleteError("");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setDeleteError("");
    deleteMutation.mutate({
      id: deleteTarget.id,
      tenantId: deleteTarget.tenantId,
    });
  };

  return {
    // tenant
    tenants,
    isLoadingTenants,
    isTenantsError,
    tenantsErrorMessage,
    retryTenants,
    tenantId,
    tenant,
    selectTenant,

    // roles
    roles,

    // messages
    notice,
    dismissNotice: () => setNotice(null),

    // add role
    addForm,
    onAdd,
    isCreating: createMutation.isPending,
    createError,

    // delete by ID
    idForm,
    onDeleteById,

    // delete popup
    deleteTarget,
    deleteOutcome,
    deleteError,
    isDeleting: deleteMutation.isPending,
    requestDelete,
    closeDelete,
    confirmDelete,
  };
}