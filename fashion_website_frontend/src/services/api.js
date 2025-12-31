/**
 * Small API client helper for the frontend.
 *
 * Prefers REACT_APP_API_BASE or REACT_APP_BACKEND_URL if present; otherwise uses relative "/api".
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the base URL for backend API calls. */
  const fromEnv = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL;
  if (fromEnv && typeof fromEnv === 'string') {
    return fromEnv.replace(/\/$/, '');
  }
  // Fall back to relative endpoints (assumes dev proxy or same-origin deployment).
  return '/api';
}

// PUBLIC_INTERFACE
export async function searchProducts({ query, signal }) {
  /**
   * Attempts to search products on the backend.
   *
   * Expected backend shapes vary, so the caller should tolerate:
   * - an array response
   * - { items: [] }
   * - { products: [] }
   *
   * Throws on non-2xx responses.
   */
  const base = getApiBaseUrl();

  // We don't have an authoritative backend spec (openapi download returned 404),
  // so we try common endpoints. If none work, we throw and the UI will fall back.
  const candidates = [
    `${base}/products?search=${encodeURIComponent(query)}`,
    `${base}/products?q=${encodeURIComponent(query)}`,
    `${base}/search?type=products&q=${encodeURIComponent(query)}`,
    `${base}/products/search?q=${encodeURIComponent(query)}`
  ];

  let lastError = null;

  for (const url of candidates) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal
      });

      if (!res.ok) {
        lastError = new Error(`Request failed (${res.status})`);
        continue;
      }

      const data = await res.json();
      if (Array.isArray(data)) return data;
      if (data && Array.isArray(data.items)) return data.items;
      if (data && Array.isArray(data.products)) return data.products;

      // If server returns an object but not the expected shape,
      // just return it as a single-item list if it looks like a product.
      if (data && typeof data === 'object') return [data];

      return [];
    } catch (err) {
      lastError = err;
      // Try the next candidate unless it was aborted.
      if (err && err.name === 'AbortError') throw err;
    }
  }

  // Nothing worked.
  throw lastError || new Error('Search request failed');
}
