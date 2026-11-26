
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "../services/tenant.service";
import { tenantSchema } from "../models/tenant.schema";
import {
  buildCreateTenantPayload,
  normalizeTenant,
} from "../models/tenant.model";
import { tenantKeys } from "../queries/tenant.queries";
import { useTenantsStore } from "../store/tenants.store";
import { getApiErrorMessage } from "@/lib/api-error";

const EMPTY_FORM = {
  tenantName: "",
  tenantCode: "",
  address: "",
};

export function useCreateTenantViewModel() {
  const queryClient = useQueryClient();

  // Popup state lives in the Zustand store
  const serverError = useTenantsStore((state) => state.createError);
  const createdTenant = useTenantsStore((state) => state.createdTenant);
  const setCreateError = useTenantsStore((state) => state.setCreateError);
  const setCreatedTenant = useTenantsStore((state) => state.setCreatedTenant);
  const addAnother = useTenantsStore((state) => state.addAnother);

  // The form fields stay with react-hook-form
  const form = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: EMPTY_FORM,
    mode: "onTouched",
  });

  const createMutation = useMutation({
    mutationFn: (values) =>
      tenantService.createTenant(buildCreateTenantPayload(values)),

    onSuccess: (data) => {
      // Shows the tenant exactly as the server saved it
      setCreatedTenant(normalizeTenant(data));
      form.reset(EMPTY_FORM);

      // Makes the list reload so the new tenant appears
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
    },

    onError: (error) => {
      const message = getApiErrorMessage(
        error,
        "Unable to create the tenant. Please try again."
      );

      // "tenant Code already exists" belongs under the Tenant code field
      if (/code/i.test(message) && /exist/i.test(message)) {
        form.setError("tenantCode", { type: "server", message });
        return;
      }

      setCreateError(message);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setCreateError("");
    createMutation.mutate(values);
  });

  return {
    form,
    onSubmit,
    isSaving: createMutation.isPending,
    serverError,
    createdTenant,
    addAnother,
  };
}