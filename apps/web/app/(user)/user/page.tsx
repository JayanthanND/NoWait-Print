"use client";

import dynamic from "next/dynamic";

const UserApp = dynamic(() => import("@/components/user/UserApp"), {
  ssr: false,
});

export default function OrderPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <UserApp />
    </main>
  );
}
