"use client";

import { useRouter } from "next/navigation";
import { clearTokens } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    clearTokens();
    router.push("/login");
  };

  return (
    <div className="w-full flex justify-between items-center border-b p-4">
      <h1 className="text-xl font-bold">Task Manager ✅</h1>

      <button
        onClick={logout}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
