"use client";

import { useState } from "react";
import { taskApi } from "@/lib/api";

export default function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setLoading(true);
    setError("");

    try {
      await taskApi.createTask(title);
      setTitle("");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={createTask} className="flex gap-2 mt-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border p-2 rounded"
        placeholder="Enter task title..."
        disabled={loading}
      />

      <button
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}
