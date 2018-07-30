const CACHE_KEY = "__SVG_USE_DOCUMENT_CACHE__";

const cacheNamespace = typeof document === "object" ? document : {};

export default function getCache() {
  if (!cacheNamespace[CACHE_KEY]) {
    cacheNamespace[CACHE_KEY] = new Map();
  }
  return cacheNamespace[CACHE_KEY];
}
