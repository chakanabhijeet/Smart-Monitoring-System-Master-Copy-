
// One role, in the shape the screens use.
// POST /user-role/createrolesuper answers:
// { id, tenant_id, user_role, created_by, updated_by, created_at, updated_at }
export function normalizeRole(item, fallbackTenantId = null) {
  return {
    id: item?.id ?? null,
    tenantId: item?.tenant_id ?? fallbackTenantId,
    name: item?.user_role ?? "",
    createdAt: item?.created_at ?? null,
  };
}

// Form values -> body for POST /user-role/createrolesuper
export function buildCreateRolePayload({ roleName, tenantId }) {
  return {
    // trims and collapses repeated spaces: "plant   admin " -> "plant admin"
    user_role: roleName.trim().replace(/\s+/g, " "),
    tenant_id: Number(tenantId),
  };
}

// Body for POST /user-role/delete
export function buildDeleteRolePayload({ id, tenantId }) {
  return {
    id: Number(id),
    tenant_id: Number(tenantId),
  };
}

// The delete API answers with text such as
// "user deleted successfully" or "user not found".
// Result: { outcome: "deleted" | "not_found" | "failed", message }
// "failed" means the server answered with something that does NOT say the
// role was deleted, so the role must stay in the list.
export function normalizeDeleteResponse(data) {
  const text =
    typeof data === "string"
      ? data
      : data?.message || data?.msg || data?.detail || "";

  if (/not\s*found/i.test(text)) {
    return { outcome: "not_found", message: text };
  }

  // An empty answer with a success status counts as deleted
  if (!text.trim()) {
    return { outcome: "deleted", message: "Role deleted successfully." };
  }

  const saysDeleted = /delet|remov|success/i.test(text);
  const saysFailed =
    /\b(not|cannot|can't|unable|fail|failed|error|denied|forbidden)\b/i.test(
      text
    );

  if (saysDeleted && !saysFailed) {
    return { outcome: "deleted", message: text };
  }

  return { outcome: "failed", message: text };
}

// Timestamps from this API include +05:30, so they are shown as they are
export function formatRoleDateTime(value) {
  if (!value || typeof value !== "string") return "—";

  // Some browsers dislike 6 fractional digits, so keep 3
  const date = new Date(value.replace(/(\.\d{3})\d+/, "$1"));

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}