import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/server";
import { getShopByOwner, getCustomers } from "@/lib/supabase/queries";
import { CustomersClient } from "./customers-client";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  const shop = await getShopByOwner(user.id);
  if (!shop) {
    redirect("/admin/setup");
  }

  const customers = await getCustomers(shop.id);

  return (
    <AdminLayout>
      <CustomersClient initialCustomers={customers} />
    </AdminLayout>
  );
}
