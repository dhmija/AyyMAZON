export interface ApiErrorPayload {
  code?: string;
  message: string;
}

export interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  error?: ApiErrorPayload;
}

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

const getBaseUrl = () => process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const apiUrl = getBaseUrl();

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
}

async function getResponseError(
  res: Response,
  fallbackMessage: string
): Promise<ApiErrorPayload> {
  try {
    const json = (await res.clone().json()) as ApiEnvelope<unknown>;
    if (json?.error?.message) return json.error;
  } catch {
    // ignore JSON parse failure and fall back to text/default message
  }

  try {
    const text = await res.text();
    if (text.trim()) return { message: text.trim() };
  } catch {
    // ignore text parse failure and use fallback message
  }

  return { message: fallbackMessage };
}

export async function requestJson<T>(
  path: string,
  init?: RequestInit,
  fallbackMessage = "Request failed."
): Promise<T> {
  let res: Response;

  try {
    res = await fetch(`${apiUrl}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Unable to connect to the server. Please try again.", 0);
  }

  if (!res.ok) {
    const error = await getResponseError(res, fallbackMessage);
    throw new ApiError(error.message, res.status, error.code);
  }

  const json = (await res.json()) as ApiEnvelope<T> | T;

  if (
    typeof json === "object" &&
    json !== null &&
    "success" in json &&
    (json as ApiEnvelope<T>).success === false
  ) {
    const error = (json as ApiEnvelope<T>).error;
    throw new ApiError(error?.message ?? fallbackMessage, res.status, error?.code);
  }

  if (
    typeof json === "object" &&
    json !== null &&
    "data" in json &&
    "success" in json
  ) {
    return (json as ApiEnvelope<T>).data as T;
  }

  return json as T;
}

export async function fetcher<T>(path: string, init?: RequestInit): Promise<T> {
  return requestJson<T>(path, init);
}
