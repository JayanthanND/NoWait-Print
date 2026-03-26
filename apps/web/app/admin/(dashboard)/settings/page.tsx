import { AdminLayout } from "@/components/admin/admin-layout";
import { getShopData } from "@/lib/supabase/queries";
import { SettingsClient } from "./settings-client";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function SettingsPage() {
  const shopData = await getShopData();

  if (!shopData) {
    redirect("/admin/setup");
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your shop profile and preferences
          </p>
        </div>

        <SettingsClient shopData={shopData} />
      </div>
    </AdminLayout>
  );
}
