// One tenant, in the shape the screens use
export function normalizeTenant(item) {
  return {
    id: item?.id ?? null,
    name: item?.tenant_name ?? "",
    code: item?.tenant_code ?? "",
    address: item?.address ?? "",
    isVerified: Boolean(item?.is_verified),
    isActive: Boolean(item?.is_active),
    createdAt: item?.created_at ?? null,
    updatedAt: item?.updated_at ?? null,
  };
}

// The list API answers { sucess, message, data: [...] }
// ("sucess" is spelled that way by the backend; "success" is accepted too)
export function normalizeTenantListResponse(response) {
  const list = Array.isArray(response?.data) ? response.data : [];

  return {
    message: response?.message ?? "",
    tenants: list.filter((item) => !item?.is_deleted).map(normalizeTenant),
  };
}

// The verify API answers plain text:
// "Tenant Verified" or "Tenant Already Verified"
export function normalizeVerifyResponse(data) {
  const text =
    typeof data === "string" ? data : data?.message || data?.msg || "";

  return {
    message: text || "Tenant Verified",
    alreadyVerified: /already/i.test(text),
  };
}

// Form values -> body for POST /tenant/createtenant
export function buildCreateTenantPayload(values) {
  return {
    tenant_name: values.tenantName.trim(),
    tenant_code: values.tenantCode.trim().toLowerCase(),
    address: values.address.trim(),
  };
}

// Timestamps from this API include +05:30, so they parse correctly as they are
export function formatTenantDate(value) {
  if (!value || typeof value !== "string") return "—";

  // Some browsers dislike 6 fractional digits, so keep 3
  const date = new Date(value.replace(/(\.\d{3})\d+/, "$1"));

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}