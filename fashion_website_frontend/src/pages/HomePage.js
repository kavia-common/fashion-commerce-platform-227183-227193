import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Local mock catalog for homepage UI.
 * This keeps the page fully functional without requiring backend integration.
 */
const MOCK_PRODUCTS = {
  topDeals: [
    { id: 'td-1', title: 'Smart Watch', price: 49.99, oldPrice: 69.99, discount: 28, rating: 4.6, category: 'Gadgets' },
    { id: 'td-2', title: 'Bluetooth Speaker', price: 29.99, oldPrice: 39.99, discount: 25, rating: 4.4, category: 'Audio' },
    { id: 'td-3', title: 'Summer Sneakers', price: 59.0, oldPrice: 79.0, discount: 25, rating: 4.7, category: 'Shoes' },
    { id: 'td-4', title: 'Fashion Sunglasses', price: 19.0, oldPrice: 29.0, discount: 34, rating: 4.2, category: 'Accessories' },
    { id: 'td-5', title: 'Denim Jacket', price: 79.0, oldPrice: 99.0, discount: 20, rating: 4.8, category: 'Outerwear' },
    { id: 'td-6', title: 'Leather Belt', price: 24.0, oldPrice: 32.0, discount: 25, rating: 4.3, category: 'Accessories' },
    { id: 'td-7', title: 'Cotton T-Shirt', price: 18.0, oldPrice: 24.0, discount: 25, rating: 4.5, category: 'Tops' },
    { id: 'td-8', title: 'Travel Backpack', price: 54.0, oldPrice: 72.0, discount: 25, rating: 4.6, category: 'Bags' },
    { id: 'td-9', title: 'Slim Fit Chinos', price: 39.0, oldPrice: 55.0, discount: 29, rating: 4.4, category: 'Bottoms' },
    { id: 'td-10', title: 'Wireless Earbuds', price: 34.99, oldPrice: 49.99, discount: 30, rating: 4.1, category: 'Audio' }
  ],
  trending: [
    { id: 'tr-1', title: 'Canvas Sneakers', price: 44.0, rating: 4.5, category: 'Shoes' },
    { id: 'tr-2', title: 'Amber Knit Sweater', price: 59.0, rating: 4.6, category: 'Tops' },
    { id: 'tr-3', title: 'Classic Cap', price: 19.0, rating: 4.2, category: 'Accessories' },
    { id: 'tr-4', title: 'Minimal Tote Bag', price: 39.0, rating: 4.4, category: 'Bags' },
    { id: 'tr-5', title: 'Sporty Slides', price: 22.0, rating: 4.1, category: 'Shoes' }
  ],
  recommended: [
    { id: 're-1', title: 'Noise-Cancel Headphones', price: 89.0, rating: 4.6, category: 'Audio' },
    { id: 're-2', title: 'Everyday Sneakers', price: 69.0, rating: 4.7, category: 'Shoes' },
    { id: 're-3', title: 'Structured Handbag', price: 74.0, rating: 4.4, category: 'Bags' },
    { id: 're-4', title: 'Navy Summer Dress', price: 69.0, rating: 4.5, category: 'Dresses' },
    { id: 're-5', title: 'Lightweight Jacket', price: 79.0, rating: 4.3, category: 'Outerwear' }
  ]
};

function formatPrice(price) {
  if (typeof price !== 'number' || !Number.isFinite(price)) return '—';
  return `$${price.toFixed(2)}`;
}

function initialsFromTitle(title) {
  const words = String(title || '')
    .trim()
    .split(/\s+/)
    .slice(0, 2);
  return words.map((w) => w[0]?.toUpperCase()).join('');
}

function starsFromRating(rating) {
  const val = Math.max(0, Math.min(5, Number(rating || 0)));
  const full = Math.floor(val);
  const half = val - full >= 0.5 ? 1 : 0;
  return { full, half, empty: Math.max(0, 5 - full - half) };
}

function ProductCardCompact({ product, size = 'compact' }) {
  const { full, half, empty } = starsFromRating(product.rating);

  return (
    <article className={`hp-card hp-card--${size}`} aria-label={product.title}>
      {typeof product.discount === 'number' ? (
        <div className="hp-badge" aria-label={`${product.discount}% off`}>
          -{product.discount}%
        </div>
      ) : null}

      <div className="hp-thumb" aria-hidden="true">
        <div className="hp-thumb-inner">
          <span className="hp-thumb-text">{initialsFromTitle(product.title)}</span>
        </div>
      </div>

      <div className="hp-card-body">
        <div className="hp-card-title" title={product.title}>
          {product.title}
        </div>
        <div className="hp-card-meta">{product.category || 'Fashion'}</div>

        <div className="hp-price-row">
          <div className="hp-price">{formatPrice(product.price)}</div>
          {typeof product.oldPrice === 'number' ? (
            <div className="hp-old-price">{formatPrice(product.oldPrice)}</div>
          ) : null}
        </div>

        {product.rating ? (
          <div className="hp-rating" aria-label={`Rated ${product.rating} out of 5`}>
            <span className="hp-stars" aria-hidden="true">
              {Array.from({ length: full }).map((_, i) => (
                <span key={`f-${i}`}>★</span>
              ))}
              {half ? <span>⯪</span> : null}
              {Array.from({ length: empty }).map((_, i) => (
                <span key={`e-${i}`} className="hp-star-empty">
                  ★
                </span>
              ))}
            </span>
            <span className="hp-rating-text">{Number(product.rating).toFixed(1)}</span>
          </div>
        ) : null}
      </div>
    </article>
  );
}

function SectionHeader({ title, viewAllHref = '/search?q=' }) {
  return (
    <div className="hp-section-header">
      <h2 className="hp-section-title">{title}</h2>
      <Link className="hp-view-all" to={viewAllHref}>
        View All
      </Link>
    </div>
  );
}

function PromoTile({ tone, title, subtitle, ctaLabel, onClick }) {
  return (
    <section className={`hp-promo hp-promo--${tone}`}>
      <div className="hp-promo-overlay" />
      <div className="hp-promo-content">
        <div className="hp-promo-title">{title}</div>
        <div className="hp-promo-subtitle">{subtitle}</div>
        <button className={`hp-btn hp-btn--${tone}`} type="button" onClick={onClick}>
          {ctaLabel}
        </button>
      </div>
      <div className="hp-promo-art" aria-hidden="true">
        <div className="hp-promo-art-block" />
        <div className="hp-promo-art-block hp-promo-art-block--small" />
      </div>
    </section>
  );
}

// PUBLIC_INTERFACE
export default function HomePage() {
  /** Homepage layout following screenshot notes: secondary category nav, hero banner, multi-section product grids, promo tiles, footer. */
  const navigate = useNavigate();

  const categoryLinks = useMemo(
    () => [
      { label: 'Deals', q: 'deals' },
      { label: 'New Arrivals', q: 'new arrivals' },
      { label: 'Fashion', q: 'fashion' },
      { label: 'Shoes', q: 'shoes' },
      { label: 'Accessories', q: 'accessories' },
      { label: 'Bags', q: 'bags' }
    ],
    []
  );

  return (
    <main className="hp">
      <div className="hp-surface">
        <div className="container">
          <nav className="hp-subnav" aria-label="Primary categories">
            <button
              className="hp-categories"
              type="button"
              onClick={() => navigate('/search?q=categories')}
              aria-label="Browse all categories"
            >
              All Categories
              <span className="hp-caret" aria-hidden="true">
                ▾
              </span>
            </button>

            <div className="hp-links" role="navigation" aria-label="Quick links">
              {categoryLinks.map((l) => (
                <Link key={l.label} to={`/search?q=${encodeURIComponent(l.q)}`} className="hp-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="container hp-content">
        <section className="hp-hero" aria-label="Promotion">
          <div className="hp-hero-left">
            <div className="hp-hero-badge">Mega</div>
            <h1 className="hp-hero-title">
              Summer Sale!
              <span className="hp-hero-title-accent"> Up to 60% Off</span>
            </h1>
            <p className="hp-hero-subtitle">
              Refresh your wardrobe with Ocean Professional deals—search above or explore today’s picks below.
            </p>
            <button
              className="hp-btn hp-btn--primary"
              type="button"
              onClick={() => navigate('/search?q=summer sale')}
            >
              Shop Now
            </button>
          </div>

          <div className="hp-hero-right" aria-hidden="true">
            <div className="hp-hero-visual">
              <div className="hp-orb hp-orb--1" />
              <div className="hp-orb hp-orb--2" />
              <div className="hp-orb hp-orb--3" />
              <div className="hp-hero-visual-card">
                <div className="hp-hero-visual-title">Featured Bundle</div>
                <div className="hp-hero-visual-text">Accessories + sneakers + summer essentials</div>
              </div>
            </div>
          </div>
        </section>

        <section className="hp-section" aria-label="Top deals of the day">
          <SectionHeader title="Top Deals of the Day" viewAllHref="/search?q=top deals" />
          <div className="hp-grid hp-grid--deals" role="list" aria-label="Top deals products">
            {MOCK_PRODUCTS.topDeals.map((p) => (
              <div role="listitem" key={p.id}>
                <ProductCardCompact product={p} size="compact" />
              </div>
            ))}
          </div>
        </section>

        <section className="hp-section" aria-label="Trending now">
          <SectionHeader title="Trending Now" viewAllHref="/search?q=trending" />
          <div className="hp-grid hp-grid--trending" role="list" aria-label="Trending products">
            {MOCK_PRODUCTS.trending.map((p) => (
              <div role="listitem" key={p.id}>
                <ProductCardCompact product={p} size="compact" />
              </div>
            ))}
          </div>
        </section>

        <section className="hp-section" aria-label="Recommended for you">
          <div className="hp-section-header">
            <h2 className="hp-section-title">Recommended for You</h2>
          </div>
          <div className="hp-row" role="list" aria-label="Recommended products">
            {MOCK_PRODUCTS.recommended.map((p) => (
              <div role="listitem" key={p.id} className="hp-row-item">
                <ProductCardCompact product={p} size="wide" />
              </div>
            ))}
          </div>
        </section>

        <section className="hp-promos" aria-label="Promotions">
          <PromoTile
            tone="orange"
            title="New Arrivals"
            subtitle="Latest collection—just dropped"
            ctaLabel="Shop New"
            onClick={() => navigate('/search?q=new arrivals')}
          />
          <PromoTile
            tone="blue"
            title="Best Offers"
            subtitle="Limited-time bundles & savings"
            ctaLabel="Browse Offers"
            onClick={() => navigate('/search?q=best offers')}
          />
        </section>

        <footer className="hp-footer" aria-label="Footer">
          <div className="hp-footer-grid">
            <div>
              <div className="hp-footer-brand">Ocean Commerce</div>
              <div className="hp-footer-text">
                Modern, responsive storefront demo. Use search in the header to explore results.
              </div>
            </div>

            <div>
              <div className="hp-footer-title">Shop</div>
              <Link className="hp-footer-link" to="/search?q=jackets">
                Jackets
              </Link>
              <Link className="hp-footer-link" to="/search?q=dresses">
                Dresses
              </Link>
              <Link className="hp-footer-link" to="/search?q=sneakers">
                Sneakers
              </Link>
            </div>

            <div>
              <div className="hp-footer-title">Help</div>
              <a className="hp-footer-link" href="#support" onClick={(e) => e.preventDefault()}>
                Support
              </a>
              <a className="hp-footer-link" href="#shipping" onClick={(e) => e.preventDefault()}>
                Shipping
              </a>
              <a className="hp-footer-link" href="#returns" onClick={(e) => e.preventDefault()}>
                Returns
              </a>
            </div>
          </div>

          <div className="hp-footer-bottom">
            <span>© {new Date().getFullYear()} Ocean Commerce</span>
            <span className="hp-footer-dot" aria-hidden="true">
              •
            </span>
            <span>Ocean Professional theme</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
