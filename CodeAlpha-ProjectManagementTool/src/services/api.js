
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("taskflow_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
}

export async function registerUser(user) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(user),
  });

  if (data.token) {
    localStorage.setItem("taskflow_token", data.token);
  }

  return data;
}

export async function loginUser(credentials) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    localStorage.setItem("taskflow_token", data.token);
  }

  return data;
}

export function logoutUser() {
  localStorage.removeItem("taskflow_token");
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
