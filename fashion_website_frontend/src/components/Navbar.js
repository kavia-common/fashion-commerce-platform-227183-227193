import React, { useEffect, useId, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

// PUBLIC_INTERFACE
export default function Navbar({ theme, onToggleTheme }) {
  /** Top navigation with logo and search. Reflects query in URL and supports Enter/search button submission. */
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const qFromUrl = searchParams.get('q') || '';

  const inputId = useId();
  const [query, setQuery] = useState(qFromUrl);
  const debouncedQuery = useDebouncedValue(query, 250);

  // Keep local input state in sync with URL when navigating/back/forward.
  useEffect(() => {
    setQuery(qFromUrl);
  }, [qFromUrl]);

  const submit = (q) => {
    const trimmed = (q || '').trim();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/" className="brand" aria-label="Go to home">
            <span className="brand-mark" aria-hidden="true">OC</span>
            <span className="brand-text">Ocean Commerce</span>
          </Link>
        </div>

        <form
          className="navbar-search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
        >
          <label className="sr-only" htmlFor={inputId}>Search products</label>
          <input
            id={inputId}
            className="search-input"
            type="search"
            inputMode="search"
            placeholder="Search fashion products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-describedby="search-hint"
          />
          <button
            className="search-button"
            type="submit"
            aria-label="Search"
          >
            Search
          </button>
          <span id="search-hint" className="sr-only">
            Type to search. Press Enter or use the Search button.
          </span>
        </form>

        <div className="navbar-right">
          <button
            className="theme-toggle theme-toggle--nav"
            onClick={onToggleTheme}
            type="button"
            aria-pressed={theme === 'dark'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <span aria-hidden="true" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
              <span style={{ fontSize: 14 }}>{theme === 'dark' ? '☀︎' : '☾'}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Small UX enhancement: show that typing is recognized without firing requests constantly */}
      <div className="navbar-subtle">
        {(debouncedQuery || '').trim()
          ? <span className="navbar-subtle-text">Searching for “{debouncedQuery.trim()}”</span>
          : <span className="navbar-subtle-text">Try searching for “jacket”, “dress”, “sneakers”…</span>}
      </div>
    </div>
  );
}
