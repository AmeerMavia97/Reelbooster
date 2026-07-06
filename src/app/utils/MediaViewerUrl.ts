// utils/MediaPreviewStore.ts

let currentMediaUrl: string | null = null;

export function setMediaUrl(url: string) {
  currentMediaUrl = url;
}

export function getMediaUrl(): string | null {
  return currentMediaUrl;
}

export function clearMediaUrl() {
  currentMediaUrl = null;
}
