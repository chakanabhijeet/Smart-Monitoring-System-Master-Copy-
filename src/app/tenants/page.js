"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
// import { SuperAdminGuard } from "@/components/common/role-guard";
import TenantsView from "@/features/tenants/views/tenants-view";

export default function TenantsPage() {
  return (
    <DashboardLayout>
      {/*
        Open to any logged-in user for now. To restrict it to Super Admins:
        un-comment the import above and wrap the view:
        <SuperAdminGuard><TenantsView /></SuperAdminGuard>
      */}
      <TenantsView />
    </DashboardLayout>
  );
}