import { AdminLayout } from "@/components/admin/admin-layout";
import { getPrinters, getShopData } from "@/lib/supabase/queries";
import { PrintersClient } from "./printers-client";
import { notFound } from "next/navigation";

export default async function PrintersPage() {
  const shop = await getShopData();
  if (!shop) return notFound();
  
  const printers = await getPrinters(shop.id);

  return (
    <AdminLayout>
      <PrintersClient initialPrinters={printers} shopId={shop.id} />
    </AdminLayout>
  );
}
