import * as React from "react";

export function useFetch<T>(url: string, init?: RequestInit) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>("");

  const fetchData = React.useCallback(
    async (options?: RequestInit, signal?: AbortSignal) => {
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
          throw new Error(message);
        }

        // Handle 204 No Content gracefully
        if (res.status === 204) {
          setData(null);
        } else {
          const json = (await res.json()) as T;
          setData(json);
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        const msg =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : JSON.stringify(err) || "Unknown error";

        setError(msg);
        setData(null);
      } finally {
        // Only update loading state if the request was NOT aborted.
        // When StrictMode unmounts/remounts a component the signal will be aborted —
        // in that case we don't want to flip loading to false (it will be retried on remount).
        if (!signal || !signal.aborted) {
          setLoading(false);
        }
      }
    },
    [url, init]
  );

  React.useEffect(() => {
    const controller = new AbortController();
    // Only fetch on mount if it's a GET request
    if (!init?.method || init.method.toUpperCase() === "GET") {
      fetchData(init, controller.signal);
    } else {
      setLoading(false);
    }
    return () => controller.abort();
  }, [fetchData, init]);

  // Manual refetch
  // Manual refetch
  const refetch = React.useCallback(() => {
    const controller = new AbortController();
    fetchData(init, controller.signal);
    return () => controller.abort();
  }, [fetchData, init]);

  // Manual POST request
  const post = React.useCallback(
    async (body: unknown) => {
      const controller = new AbortController();
      const postInit: RequestInit = {
        ...(init || {}),
        method: "POST",
        body: JSON.stringify(body),
      };
      fetchData(postInit, controller.signal);
      // Wait for the request to complete before returning, returning data 
      return await fetchData(postInit, controller.signal);
    },
    [fetchData, init]
  );

  return { data, loading, error, refetch, post };
}
