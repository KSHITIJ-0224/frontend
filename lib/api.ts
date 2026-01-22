import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = typeof window !== "undefined" ? getAccessToken() : null;

/**
 * HTTP headers for API requests with Content-Type set to JSON.
 * Merges default Content-Type header with any additional headers provided in options.
 * @type {Record<string, string>}
 */
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Merge with provided headers if they exist and are record-like
  if (options.headers && typeof options.headers === "object") {
    const providedHeaders = options.headers as Record<string, string>;
    Object.assign(headers, providedHeaders);
  }

  if (token) headers["Authorization"] = `Bearer ${token}`;

  let res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  // ✅ If access token expired -> refresh and retry once
  if (res.status === 401) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Please log in to continue");
    }

    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refreshRes.ok) {
        clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Your session has expired. Please log in again.");
      }

      const data = await refreshRes.json();
      const newAccessToken = data.accessToken;

      // Save new access token
      setTokens(newAccessToken, refreshToken);

      // Retry original request with new token
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: retryHeaders,
      });
    } catch (error) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw error;
    }
  }

  return res;
};

// ============ TASK API FUNCTIONS ============

export const taskApi = {
  // Get all tasks with pagination and filtering
  getTasks: async (page: number = 1, limit: number = 5, search: string = "", status: string = "all") => {
    let query = `?page=${page}&limit=${limit}`;
    if (search.trim()) query += `&search=${encodeURIComponent(search.trim())}`;
    if (status !== "all") query += `&status=${status}`;

    const res = await apiFetch(`/tasks${query}`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  },

  // Create a new task
  createTask: async (title: string) => {
    const res = await apiFetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to create task");
    return res.json();
  },

  // Update task title
  updateTask: async (taskId: number, title: string) => {
    const res = await apiFetch(`/tasks/${taskId}`, {
      method: "PATCH",
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Failed to update task");
    return res.json();
  },

  // Toggle task status (pending/done)
  toggleTask: async (taskId: number) => {
    const res = await apiFetch(`/tasks/${taskId}/toggle`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to toggle task");
    return res.json();
  },

  // Delete a task
  deleteTask: async (taskId: number) => {
    const res = await apiFetch(`/tasks/${taskId}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete task");
    return res.json();
  },
};

