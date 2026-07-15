"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Client-side convenience redirect only — the real protection is the
// `requireAdmin` middleware on the backend admin routes.
export function useAdminGuard() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    const user = saved ? JSON.parse(saved) : null;
    if (!user?.isAdmin) {
      router.push("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  return checked;
}
