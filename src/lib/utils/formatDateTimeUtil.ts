export function formatDateTime(iso: string): string {
  try {
    const dt = new Date(iso);

    const time = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);

    const date = new Intl.DateTimeFormat(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(dt);

    return `${time} – ${date}`;
  } catch {
    return iso;
  }
}
