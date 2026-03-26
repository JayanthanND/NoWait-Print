import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ShopClient } from "./ShopClient";

export default async function ShopPage({ 
  params 
}: { 
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const supabase = await createClient();
  
  // 1. Fetch shop by slug
  const { data: shop, error: shopError } = await supabase
    .from('shops')
    .select('id, name, address, phone, settings, upi_id')
    .eq('slug', slug)
    .single();
    
  if (shopError || !shop) {
    // Fallback search by ID if slug not found (for old links)
    const { data: shopById } = await supabase
      .from('shops')
      .select('id, name, address, phone, settings, upi_id')
      .eq('id', slug)
      .single();
      
    if (!shopById) return notFound();
    return <ShopPageContent shop={shopById} supabase={supabase} />;
  }

  return <ShopPageContent shop={shop} supabase={supabase} />;
}

async function ShopPageContent({ shop, supabase }: { shop: any, supabase: any }) {
  // 2. Fetch pricing rules and binding options for the shop
  const [pricingRules, bindingOptions] = await Promise.all([
    supabase.from('pricing_rules').select('*').eq('shop_id', shop.id),
    supabase.from('binding_options').select('*')
  ]);

  return (
    <main className="min-h-screen bg-gray-50">
      <ShopClient 
        shopId={shop.id} 
        shopName={shop.name} 
        shopAddress={shop.address} 
        shopPhone={shop.phone}
        shopSettings={shop.settings}
        upiId={shop.upi_id}
        initialPricingRules={pricingRules.data || []}
        initialBindingOptions={bindingOptions.data || []}
      />
    </main>
  );
}
