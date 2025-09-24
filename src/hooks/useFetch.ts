import * as React from "react";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public bodyText?: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function useFetch<T>(url: string, init?: RequestInit) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");

  const fetchData = React.useCallback(
    async <R = T>(
      options?: RequestInit,
      signal?: AbortSignal
    ): Promise<R | null> => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch(url, {
          ...(init || {}),
          ...(options || {}),
          signal,
          headers: {
            Accept: "application/json",
            ...(init?.headers || {}),
            ...(options?.headers || {}),
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => "");
          const message = text?.trim()
            ? `${res.status} ${res.statusText} – ${text}`
            : `${res.status} ${res.statusText}`;
          setError(message);
          setData(null);
          throw new HttpError(res.status, message, text);
        }

        if (res.status === 204) {
          setData(null);
          return null;
        }

        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const json = (await res.json()) as R;
          setData(json as unknown as T);
          return json;
        } else {
          const text = (await res.text()) as unknown as R;
          setData(text as unknown as T);
          return text;
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return null;
        }

        const msg =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err) || "Unknown error";

        setError(msg);
        setData(null);
        throw err instanceof Error ? err : new Error(msg);
      } finally {
        if (!signal || !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [url, init]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    if (!init?.method || init.method.toUpperCase() === "GET") {
      fetchData(init, controller.signal).catch(() => {});
    } else {
      setLoading(false);
    }
    return () => controller.abort();
  }, [fetchData, init]);

  const refetch = React.useCallback(() => {
    const controller = new AbortController();
    fetchData(init, controller.signal).catch(() => {});
    return () => controller.abort();
  }, [fetchData, init]);

  const post = React.useCallback(
    async <R = T>(body: unknown) => {
      const controller = new AbortController();
      const postInit: RequestInit = {
        ...(init || {}),
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(init?.headers || {}),
        },
        body: JSON.stringify(body),
      };
      return await fetchData<R>(postInit, controller.signal);
    },
    [fetchData, init]
  );

  return { data, loading, error, refetch, post };
}
