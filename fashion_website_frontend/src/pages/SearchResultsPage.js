import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchProducts } from '../services/api';

// Simple seed list to enable client-side fallback when backend doesn't support search yet.
const FALLBACK_PRODUCTS = [
  { id: 'p1', name: 'Blue Denim Jacket', price: 79, category: 'Outerwear' },
  { id: 'p2', name: 'Amber Knit Sweater', price: 59, category: 'Tops' },
  { id: 'p3', name: 'Classic White Sneakers', price: 89, category: 'Shoes' },
  { id: 'p4', name: 'Navy Summer Dress', price: 69, category: 'Dresses' },
  { id: 'p5', name: 'Slim Fit Chinos', price: 55, category: 'Bottoms' }
];

function normalizeProducts(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && Array.isArray(raw.items)) return raw.items;
  if (raw && Array.isArray(raw.products)) return raw.products;
  return [];
}

function productLabel(p) {
  return p?.name || p?.title || p?.product_name || `Product ${p?.id ?? ''}`.trim();
}

function productPrice(p) {
  const val = p?.price ?? p?.amount ?? p?.cost;
  if (typeof val === 'number') return val;
  const parsed = Number(val);
  return Number.isFinite(parsed) ? parsed : null;
}

// PUBLIC_INTERFACE
export default function SearchResultsPage() {
  /** Search results view driven by `q` query param; attempts backend search and falls back to client-side filter. */
  const [searchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [mode, setMode] = useState('idle'); // idle | backend | fallback
  const [error, setError] = useState('');

  const abortRef = useRef(null);

  const fallbackFiltered = useMemo(() => {
    if (!q) return [];
    const needle = q.toLowerCase();
    return FALLBACK_PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.category}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [q]);

  useEffect(() => {
    // Reset state when query changes.
    setError('');
    setResults([]);

    if (!q) {
      setLoading(false);
      setMode('idle');
      return;
    }

    // Cancel any in-flight request.
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const data = await searchProducts({ query: q, signal: controller.signal });
        const normalized = normalizeProducts(data);

        if (!mounted) return;
        setResults(normalized);
        setMode('backend');
      } catch (err) {
        if (!mounted) return;
        if (err && err.name === 'AbortError') return;

        // Backend search did not work. Fall back to client-side filtering.
        // TODO: When backend search endpoint is confirmed, remove fallback and rely fully on API.
        setMode('fallback');
        setResults(fallbackFiltered);

        // Show a friendly message only if fallback yields nothing.
        if (fallbackFiltered.length === 0) {
          setError('We couldn’t reach the search service right now. Showing limited local results.');
        }
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [q, fallbackFiltered]);

  return (
    <main className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Search</h1>
          <p className="page-subtitle">
            {q ? (
              <>
                Results for <span className="pill">“{q}”</span>
              </>
            ) : (
              <>Enter a query in the search bar above.</>
            )}
          </p>
        </div>

        {error ? (
          <div className="alert" role="status">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="status" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true" />
            <span>Searching products…</span>
          </div>
        ) : null}

        {!loading && q && results.length === 0 ? (
          <div className="empty">
            <h2 className="empty-title">No results found</h2>
            <p className="empty-text">
              Try a different keyword, or browse back to the <Link to="/" className="link">home page</Link>.
            </p>
          </div>
        ) : null}

        {!loading && results.length > 0 ? (
          <>
            <div className="meta-row">
              <span className="meta">
                {results.length} result{results.length === 1 ? '' : 's'}
                {mode === 'fallback' ? ' (limited local results)' : ''}
              </span>
            </div>

            <div className="grid" role="list">
              {results.map((p, idx) => {
                const name = productLabel(p);
                const price = productPrice(p);
                const key = p.id ?? p._id ?? `${name}-${idx}`;

                return (
                  <div className="card" role="listitem" key={key}>
                    <div className="card-body">
                      <div className="card-title">{name}</div>
                      <div className="card-subtitle">{p.category || p.type || 'Fashion'}</div>
                      <div className="card-price">
                        {price != null ? `$${price}` : '—'}
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn-primary" type="button" aria-label={`View ${name}`}>
                        View
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
