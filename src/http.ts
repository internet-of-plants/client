import config from "@/constants";
import router from "@/router";

type Body = FormData | unknown;

export async function get<T>(route: string, body?: Body): Promise<T> {
  const token = localStorage.getItem("token") ?? undefined;
  if (token === undefined) {
    localStorage.removeItem("token");
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
    method: "GET",
    body: newBody,
    headers,
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }
  return await response.json();
}

export async function post<T>(route: string, body?: Body): Promise<T> {
  const token = localStorage.getItem("token") ?? undefined;
  if (token === undefined) {
    localStorage.removeItem("token");
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
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }

  return await response.json();
}

export async function post<T>(route: string, body?: Body): Promise<T> {
  const token = localStorage.getItem("token") ?? undefined;
  if (token === undefined) {
    localStorage.removeItem("token");
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
    router.push({ path: "/login" });
    throw new Error("not authenticated");
  }

  return await response.json();
}
