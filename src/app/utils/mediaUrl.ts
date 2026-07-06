export function normalizeMediaUrl(url: string | null | undefined): string {
  if (!url) return "";

  try {
    const parsed = new URL(url);

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      parsed.pathname = parsed.pathname.replace(/\/{2,}/g, "/");
      return parsed.toString();
    }
  } catch {
    // Local asset paths and non-URL strings should pass through unchanged.
  }

  return url.replace(/(https?:\/\/[^/]+)\/{2,}/g, "$1/");
}

export function normalizeMediaUrlsDeep<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeMediaUrl(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeMediaUrlsDeep(item)) as T;
  }

  if (
    value &&
    typeof value === "object" &&
    Object.prototype.toString.call(value) === "[object Object]"
  ) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        normalizeMediaUrlsDeep(item),
      ])
    ) as T;
  }

  return value;
}
