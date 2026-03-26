import { AdminLayout } from "@/components/admin/admin-layout";
import { createClient } from "@/lib/supabase/server";
import { getShopByOwner, getPricingRules } from "@/lib/supabase/queries";
import { PricingClient } from "./pricing-client";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/admin/login");
  }

  const shop = await getShopByOwner(user.id);
  if (!shop) {
    redirect("/admin/setup");
  }

  const pricing = await getPricingRules(shop.id);

  return (
    <AdminLayout>
      <PricingClient 
        initialPricing={pricing} 
        initialSettings={shop.settings} 
        shopId={shop.id} 
      />
    </AdminLayout>
  );
}
