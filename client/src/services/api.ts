const BASE_URL = import.meta.env.VITE_API_URL || "/api";

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  // throw so catch blocks in services handle it
  if (!res.ok) {
    throw { message: data.message, status: res.status, errors: data.errors };
  }

  return data;
};