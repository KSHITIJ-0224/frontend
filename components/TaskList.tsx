"use client";

import TaskItem from "./TaskItem";
import { Task } from "@/lib/types";

export default function TaskList({
  tasks,
  onChange,
}: {
  tasks?: Task[];
  onChange: () => void;
}) {
  const taskList = tasks || [];
  
  if (taskList.length === 0) {
    return <p className="mt-6 text-gray-500">No tasks found.</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {taskList.map((task) => (
        <TaskItem key={task.id} task={task} onChange={onChange} />
      ))}
    </div>
  );
}
