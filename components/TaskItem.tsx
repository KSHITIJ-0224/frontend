"use client";

import { useState } from "react";
import { Task } from "@/lib/types";
import { taskApi } from "@/lib/api";

export default function TaskItem({
  task,
  onChange,
}: {
  task: Task;
  onChange: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [loading, setLoading] = useState(false);

  const toggleTask = async () => {
    setLoading(true);
    try {
      await taskApi.toggleTask(task.id);
      onChange();
    } catch (err) {
      alert("Failed to toggle task");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    const ok = confirm("Delete this task?");
    if (!ok) return;

    setLoading(true);
    try {
      await taskApi.deleteTask(task.id);
      onChange();
    } catch (err) {
      alert("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async () => {
    if (!title.trim()) return alert("Title cannot be empty");

    setLoading(true);
    try {
      await taskApi.updateTask(task.id, title);
      setEditing(false);
      onChange();
    } catch (err) {
      alert("Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center border rounded p-3">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.status === "done"}
          onChange={toggleTask}
          disabled={loading}
        />

        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-1 rounded"
          />
        ) : (
          <span className={task.status === "done" ? "line-through text-gray-500" : ""}>
            {task.title}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {editing ? (
          <button
            onClick={updateTask}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEditing(true)}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
          >
            Edit
          </button>
        )}

        <button
          onClick={deleteTask}
          disabled={loading}
          className="bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
