const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    credentials: "include", // HttpOnly 쿠키 전송용
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData: any = {};
    const contentType = response.headers.get("content-type");

    try {
      if (contentType && contentType.includes("application/json")) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData = { message: text || `HTTP ${response.status}` };
      }
    } catch {
      errorData = { message: `API 요청 실패: ${response.status}` };
    }

    throw new ApiError(
      errorData.code || "UNKNOWN_ERROR",
      errorData.message || `API 요청 실패: ${response.status}`,
      response.status
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export function apiGet<T>(endpoint: string, options?: RequestInit) {
  return apiFetch<T>(endpoint, { ...options, method: "GET" });
}

export function apiPost<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
) {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiPut<T>(
  endpoint: string,
  data?: unknown,
  options?: RequestInit
) {
  return apiFetch<T>(endpoint, {
    ...options,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
}

export function apiDelete<T>(endpoint: string, options?: RequestInit) {
  return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
}
