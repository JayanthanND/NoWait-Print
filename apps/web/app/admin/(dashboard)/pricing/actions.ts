"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type PricingRuleInput = {
  pageSize: string;
  colorType: string;
  isDoubleSided: boolean;
  price: number;
};

/**
 * Updates multiple pricing rules in a single batch operation.
 * This is more efficient than individual calls and prevents race conditions.
 */
export async function updatePricingRulesBatchAction(
  shopId: string, 
  rules: PricingRuleInput[]
) {
  const supabase = await createClient();
  
  const upsertData = rules.map(rule => ({
    shop_id: shopId,
    page_size: rule.pageSize,
    color_type: rule.colorType.toUpperCase(),
    print_side: rule.isDoubleSided ? 'DOUBLE' : 'SINGLE',
    base_price: rule.price,
    updated_at: new Date().toISOString()
  }));

  const { data, error } = await supabase
    .from('pricing_rules')
    .upsert(upsertData, {
      onConflict: 'shop_id,page_size,color_type,print_side'
    })
    .select();
    
  if (error) {
    console.error("Supabase Error in updatePricingRulesBatchAction:", error);
    // Return a serializable error object instead of throwing the complex Supabase error
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/pricing');
  return { success: true, data };
}

export async function updateShopSettingsAction(shopId: string, settings: any) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('shops')
    .update({ 
      settings,
      updated_at: new Date().toISOString()
    })
    .eq('id', shopId);
    
  if (error) {
    console.error("Supabase Error in updateShopSettingsAction:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath('/admin/pricing');
  return { success: true, data };
}
