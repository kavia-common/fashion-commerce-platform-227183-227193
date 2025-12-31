import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import SearchResultsPage from './pages/SearchResultsPage';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    /** Toggles between light and dark theme. */
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Routes>
        <Route
          path="/"
          element={
            <main className="page">
              <div className="container">
                <div className="hero">
                  <div className="hero-left">
                    <h1 className="hero-title">Find your next favorite look</h1>
                    <p className="hero-text">
                      Use the search bar above to explore products. Results are shareable via the URL.
                    </p>
                  </div>
                  <div className="hero-right">
                    <div className="hero-badge">Ocean Professional</div>
                  </div>
                </div>

                <section className="section">
                  <h2 className="section-title">Featured</h2>
                  <div className="grid" role="list" aria-label="Featured products">
                    {[
                      { id: 'f1', name: 'Ocean Blue Tee', category: 'Tops', price: 29 },
                      { id: 'f2', name: 'Amber Accent Cap', category: 'Accessories', price: 19 },
                      { id: 'f3', name: 'Minimalist Sneakers', category: 'Shoes', price: 89 }
                    ].map((p) => (
                      <div className="card" role="listitem" key={p.id}>
                        <div className="card-body">
                          <div className="card-title">{p.name}</div>
                          <div className="card-subtitle">{p.category}</div>
                          <div className="card-price">${p.price}</div>
                        </div>
                        <div className="card-footer">
                          <button className="btn-primary" type="button" aria-label={`View ${p.name}`}>
                            View
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </main>
          }
        />
        <Route path="/search" element={<SearchResultsPage />} />

        {/* Backwards-compatible / redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
