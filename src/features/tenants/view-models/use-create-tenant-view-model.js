"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { tenantService } from "../services/tenant.service";
import { tenantSchema } from "../models/tenant.schema";
import {
  buildCreateTenantPayload,
  normalizeTenant,
} from "../models/tenant.model";
import { TENANTS_QUERY_KEY } from "./use-tenants-view-model";
import { getApiErrorMessage } from "@/lib/api-error";

const EMPTY_FORM = {
  tenantName: "",
  tenantCode: "",
  address: "",
};

export function useCreateTenantViewModel() {
  const queryClient = useQueryClient();

  const [serverError, setServerError] = useState("");
  const [createdTenant, setCreatedTenant] = useState(null);

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
      queryClient.invalidateQueries({ queryKey: TENANTS_QUERY_KEY });
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

      setServerError(message);
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    setServerError("");
    createMutation.mutate(values);
  });

  return {
    form,
    onSubmit,
    isSaving: createMutation.isPending,
    serverError,
    createdTenant,
    addAnother: () => {
      setCreatedTenant(null);
      setServerError("");
    },
  };
}