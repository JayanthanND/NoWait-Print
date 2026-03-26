import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/server";
import { getShopData, getStaffProfiles } from "@/lib/supabase/queries";
import { StaffClient } from "./staff-client";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function StaffPage() {
  const shop = await getShopData();
  if (!shop) return notFound();

  const staff = await getStaffProfiles(shop.id);

  return (
    <AdminLayout>
      <StaffClient initialStaff={staff} shopId={shop.id} />
    </AdminLayout>
  );
}
