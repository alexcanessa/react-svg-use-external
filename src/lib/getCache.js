const CACHE_KEY = "__SVG_USE_DOCUMENT_CACHE__";

const cacheNamespace =
  typeof document === "object" ? document : /* istanbul ignore next */ {};

export default function getCache() {
  if (!cacheNamespace[CACHE_KEY]) {
    cacheNamespace[CACHE_KEY] = new Map();
  }
  return cacheNamespace[CACHE_KEY];
}

export function resetCache() {
  delete cacheNamespace[CACHE_KEY];
}
