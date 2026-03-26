"use client";

import dynamic from "next/dynamic";

const UserApp = dynamic(() => import("@/components/user/UserApp"), {
  ssr: false,
});

interface ShopClientProps {
  shopId: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopSettings: any;
  upiId: string;
  initialPricingRules: any[];
  initialBindingOptions: any[];
}

export function ShopClient(props: ShopClientProps) {
  return <UserApp {...props} />;
}
