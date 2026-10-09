"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthorSubmitRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/submit");
  }, [router]);

  return (
    <div className="p-8 text-center text-xs text-slate-500">
      Redirecting to Manuscript Submission Wizard...
    </div>
  );
}
