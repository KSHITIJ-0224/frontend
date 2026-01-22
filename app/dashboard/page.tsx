"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import { Task } from "@/lib/types";
import { taskApi } from "@/lib/api";
import { getAccessToken } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "pending" | "done">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  const [total, setTotal] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskApi.getTasks(page, limit, search, status);
      setTasks(data?.tasks || []);
      setTotal(data?.total || 0);
    } catch (error: any) {
      console.error("Error fetching tasks:", error);
      setError(error.message || "Failed to fetch tasks");
      setTasks([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  // for search: refresh data when search changes with slight delay
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchTasks();
    }, 500);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <Navbar />

      <div className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mt-4">Dashboard</h2>

        <TaskForm onCreated={fetchTasks} />

        {/* Search + Filter */}
        <div className="flex gap-2 mt-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border p-2 rounded"
            placeholder="Search tasks..."
          />

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as any);
            }}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>

        {error && <p className="mt-4 text-red-500">{error}</p>}

        {/* Task List */}
        {loading ? (
          <p className="mt-6 text-gray-500">Loading tasks...</p>
        ) : (
          <TaskList tasks={tasks} onChange={fetchTasks} />
        )}

        {/* Pagination */}
        {total > 0 && (
          <div className="flex justify-between items-center mt-6">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <p>
              Page {page} / {totalPages || 1}
            </p>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="border px-3 py-1 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
