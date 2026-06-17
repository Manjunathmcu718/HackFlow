export interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    let data: unknown = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    const error = new Error(`Request failed with status ${response.status}`) as ApiError;
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return response.json() as Promise<T>;
}

export const api = {
  hackathons: {
    list: async () => request("/api/hackathons"),
    get: async (id: string | number) => request(`/api/hackathons/${id}`),
  },
  teams: {
    list: async () => request("/api/teams"),
  },
  submissions: {
    list: async () => request("/api/submissions"),
    create: async (data: unknown) => request("/api/submissions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    update: async (id: string | number, data: unknown) => request(`/api/submissions/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  },
  registrations: {
    list: async () => request("/api/registrations"),
    create: async (data: unknown) => request("/api/registrations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },
  announcements: {
    list: async () => request("/api/announcements"),
    create: async (data: unknown) => request("/api/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  },
};
