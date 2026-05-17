export function imageSrc(url) {
  if (!url || typeof url !== "string") return "";

  try {
    const parsed = new URL(url);
    if (parsed.hostname.endsWith(".public.blob.vercel-storage.com")) {
      return `/api/imagen?url=${encodeURIComponent(url)}`;
    }
  } catch {
    return url;
  }

  return url;
}
