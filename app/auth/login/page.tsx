"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      setTokens(data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: any) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 border p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button disabled={loading} className="w-full bg-black text-white p-2 rounded">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {msg && <p className="mt-4 text-sm">{msg}</p>}

      <p className="mt-4 text-sm">
        New user?{" "}
        <button onClick={() => router.push("/register")} className="underline">
          Register
        </button>
      </p>
    </div>
  );
}
