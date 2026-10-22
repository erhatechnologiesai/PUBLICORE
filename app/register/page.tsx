"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?mode=register");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F9FB] flex items-center justify-center p-8 text-xs text-slate-500">
      Redirecting to Scholar Account Creation Portal...
    </div>
  );
}
