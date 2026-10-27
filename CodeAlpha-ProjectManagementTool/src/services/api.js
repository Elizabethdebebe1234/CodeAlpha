
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export function registerUser(user) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function loginUser(credentials) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getProjects() {
  return apiRequest("/projects");
}

export function createProject(project) {
  return apiRequest("/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function getTasks(projectId) {
  return apiRequest(`/projects/${projectId}/tasks`);
}

export function createTask(projectId, task) {
  return apiRequest(`/projects/${projectId}/tasks`, {
    method: "POST",
    body: JSON.stringify(task),
  });
}
