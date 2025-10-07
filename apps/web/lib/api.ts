import "server-only";

const baseUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request(path: string, init: RequestInit = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`API error ${res.status}: ${await res.text()}`);
    throw new Error("API request failed");
  }
  return res.json();
}

export async function fetchDashboard() {
  return request("/projects/overview");
}

export async function fetchProjects() {
  return request("/projects");
}

export async function fetchProject(id: string) {
  return request(`/projects/${id}`);
}

export async function fetchAudits() {
  return request("/audits");
}
