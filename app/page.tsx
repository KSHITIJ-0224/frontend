"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = getAccessToken();
    if (token) router.push("/dashboard");
    else router.push("/login");
  }, [router]);

  return <div className="p-6">Loading...</div>;
}
