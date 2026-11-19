"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";
// import { SuperAdminGuard } from "@/components/common/role-guard";
import RolesView from "@/features/roles/views/roles-view";

export default function RolesPage() {
  return (
    <DashboardLayout>
      {/*
        Open to any logged-in user for now. To restrict it to Super Admins:
        un-comment the import above and wrap the view:
        <SuperAdminGuard><RolesView /></SuperAdminGuard>
      */}
      <RolesView />
    </DashboardLayout>
  );
}