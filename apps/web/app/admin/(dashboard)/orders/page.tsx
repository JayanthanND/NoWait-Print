import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/server";
import { getShopByOwner } from "@/lib/supabase/queries";
import { OrdersClient } from "./orders-client";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  const shop = await getShopByOwner(user.id);
  if (!shop) {
    redirect("/admin/setup");
  }

  return (
    <AdminLayout>
      <OrdersClient shopId={shop.id} />
    </AdminLayout>
  );
}
