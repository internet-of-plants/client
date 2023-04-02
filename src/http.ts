import config from "@/constants";
import router from "@/router";

export async function get<T>(
  route: string,
  body?: unknown
): Promise<T> {
  const token = localStorage.getItem("token") ?? undefined;
  if (token === undefined) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('storage'))
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }

  const headers: Record<string, string> = { Authorization: `Basic ${token}` };

  let query = "";
  if (body !== undefined) {
    query = Object.entries(body as Record<string, string | number | boolean>)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
  }

  const response = await fetch(`${config.API_HOST}${route}?${query}`, {
    method: "GET",
    headers,
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('storage'))
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }
  return await response.json();
}

type Body = FormData | unknown;

export async function post<T>(route: string, body?: Body): Promise<T> {
  const token = localStorage.getItem("token") ?? undefined;
  if (token === undefined) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('storage'))
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }

  const headers: Record<string, string> = { Authorization: `Basic ${token}` };
  let newBody;
  if (body !== undefined && !(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    newBody = JSON.stringify(body);
  } else {
    newBody = body;
  }
  const response = await fetch(`${config.API_HOST}${route}`, {
    method: "POST",
    body: newBody,
    headers,
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event('storage'))
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }

  return await response.json();
}
