import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { Reveal, Icon, Breadcrumb } from '../components/Common'
import { CATEGORIES, METALS, PRODUCTS } from '../data/products'

const PRICES = [
  { id: 'u5', label: 'Under ₹5,000', test: (p) => p.price < 5000 },
  { id: '5-15', label: '₹5,000 – ₹15,000', test: (p) => p.price >= 5000 && p.price <= 15000 },
  { id: '15-40', label: '₹15,000 – ₹40,000', test: (p) => p.price > 15000 && p.price <= 40000 },
  { id: 'o40', label: 'Above ₹40,000', test: (p) => p.price > 40000 },
]

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat')
  const q = params.get('q')
  const collection = params.get('collection')
  const [metals, setMetals] = useState([])
  const [price, setPrice] = useState(null)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sort, setSort] = useState(params.get('sort') || 'featured')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [gridCols, setGridCols] = useState(3) // 3 or 4 columns

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) =>
      (!cat || p.category === cat) &&
      (!collection || p.collection === collection) &&
      (!q ||
        (p.name + ' ' + p.category + ' ' + p.metal + ' ' + p.collection + ' ' + (p.description || ''))
          .toLowerCase()
          .includes(q.toLowerCase())) &&
      (metals.length === 0 || metals.includes(p.metal)) &&
      (!price || PRICES.find((x) => x.id === price)?.test(p)) &&
      (!inStockOnly || p.stock > 0)
    )

    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'popular') l = [...l].sort((a, b) => b.reviews - a.reviews)
    if (sort === 'new') l = [...l].sort((a, b) => (b.badge === 'New' ? 1 : 0) - (a.badge === 'New' ? 1 : 0))
    if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating)

    return l
  }, [cat, collection, q, metals, price, sort, inStockOnly])

  const title = q
    ? `Results for “${q}”`
    : collection
      ? `${collection} Collection`
      : cat
        ? CATEGORIES.find((c) => c.slug === cat)?.name || 'Jewellery'
        : 'All Fine Jewellery'

  const setCat = (slug) => {
    const p = new URLSearchParams(params)
    if (slug) p.set('cat', slug)
    else p.delete('cat')
    p.delete('q')
    setParams(p)
  }

  const setCol = (colName) => {
    const p = new URLSearchParams(params)
    if (colName) p.set('collection', colName)
    else p.delete('collection')
    setParams(p)
  }

  const clearAll = () => {
    setMetals([])
    setPrice(null)
    setInStockOnly(false)
    setParams({})
  }

  const toggleMetal = (m) =>
    setMetals((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]))

  const activeFiltersCount =
    (cat ? 1 : 0) +
    (collection ? 1 : 0) +
    metals.length +
    (price ? 1 : 0) +
    (inStockOnly ? 1 : 0)

  return (
    <div className="shop">
      {/* Page Header with Breadcrumbs */}
      <section className="page-head shop-page-head">
        <div className="wrap">
          <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Shop', title]} />
          <h1 className="shop-title">{title}</h1>
          <p className="shop-subtitle">
            {list.length} {list.length === 1 ? 'piece' : 'pieces'} · 100% Solid Gold & Silver · BIS Hallmarked
          </p>
        </div>
      </section>

      <div className="wrap shop-content-wrap">
        {/* Category Pills Strip */}
        <div className="cat-pills-row" role="tablist" aria-label="Filter by category">
          <button
            className={`cat-pill-btn ${!cat && !collection ? 'on' : ''}`}
            onClick={() => setCat(null)}
          >
            All Pieces ({PRODUCTS.length})
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              className={`cat-pill-btn ${cat === c.slug ? 'on' : ''}`}
              onClick={() => setCat(c.slug)}
            >
              {c.name}
            </button>
          ))}
          <button
            className={`cat-pill-btn ${collection === 'Bridal' ? 'on' : ''}`}
            onClick={() => setCol(collection === 'Bridal' ? null : 'Bridal')}
          >
            ✦ Bridal Edit
          </button>
        </div>

        {/* Shop Control Bar */}
        <div className="shop-bar">
          <div className="shop-bar-left">
            <button
              className="btn btn-line btn-sm filter-toggle-btn"
              onClick={() => setFiltersOpen(true)}
              aria-label="Open filter sidebar"
            >
              <Icon name="sliders" size={15} />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <span className="muted only-desktop">
              Showing <b>{list.length}</b> of {PRODUCTS.length} heirloom pieces
            </span>
          </div>

          <div className="shop-bar-right">
            {/* Desktop Grid Layout Switcher */}
            <div className="grid-switcher only-desktop">
              <button
                className={`switch-grid-btn ${gridCols === 3 ? 'active' : ''}`}
                onClick={() => setGridCols(3)}
                aria-label="3 columns grid"
                title="3 columns"
              >
                <Icon name="grid" size={16} />
              </button>
              <button
                className={`switch-grid-btn ${gridCols === 4 ? 'active' : ''}`}
                onClick={() => setGridCols(4)}
                aria-label="4 columns grid"
                title="4 columns"
              >
                <Icon name="box" size={16} />
              </button>
            </div>

            {/* Sorting Dropdown */}
            <label className="sort">
              <span className="sort-label">Sort:</span>
              <select
                id="sort-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products by"
              >
                <option value="featured">Featured Curations</option>
                <option value="popular">Most Popular</option>
                <option value="new">Newest Additions</option>
                <option value="rating">Highest Rated</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>

        {/* Active Filters Chip Tags */}
        {activeFiltersCount > 0 && (
          <div className="active-filters-chips">
            <span className="active-filters-title">Active filters:</span>
            {cat && (
              <span className="filter-chip">
                Category: {CATEGORIES.find((c) => c.slug === cat)?.name || cat}
                <button onClick={() => setCat(null)} aria-label="Remove category filter">
                  <Icon name="close" size={12} />
                </button>
              </span>
            )}
            {collection && (
              <span className="filter-chip">
                Collection: {collection}
                <button onClick={() => setCol(null)} aria-label="Remove collection filter">
                  <Icon name="close" size={12} />
                </button>
              </span>
            )}
            {metals.map((m) => (
              <span className="filter-chip" key={m}>
                {m}
                <button onClick={() => toggleMetal(m)} aria-label={`Remove ${m} filter`}>
                  <Icon name="close" size={12} />
                </button>
              </span>
            ))}
            {price && (
              <span className="filter-chip">
                {PRICES.find((p) => p.id === price)?.label}
                <button onClick={() => setPrice(null)} aria-label="Remove price filter">
                  <Icon name="close" size={12} />
                </button>
              </span>
            )}
            {inStockOnly && (
              <span className="filter-chip">
                In Stock Only
                <button onClick={() => setInStockOnly(false)} aria-label="Remove in stock filter">
                  <Icon name="close" size={12} />
                </button>
              </span>
            )}
            <button className="link-btn clear-all-link" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        )}

        <div className="shop-layout">
          {/* Filter Backdrop on Mobile */}
          <div
            className={`drawer-bg ${filtersOpen ? 'show' : ''}`}
            onClick={() => setFiltersOpen(false)}
          />

          {/* Filter Sidebar */}
          <aside className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Product filters">
            <div className="side-head only-mobile">
              <h3>Filters</h3>
              <button
                className="icon-btn"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="f-group">
              <h4>Precious Metal</h4>
              {METALS.map((m) => (
                <label key={m} className="check">
                  <input
                    type="checkbox"
                    checked={metals.includes(m)}
                    onChange={() => toggleMetal(m)}
                  />
                  <span>{m}</span>
                </label>
              ))}
            </div>

            <div className="f-group">
              <h4>Price Range</h4>
              {PRICES.map((p) => (
                <label key={p.id} className="check">
                  <input
                    type="radio"
                    name="price"
                    checked={price === p.id}
                    onChange={() => setPrice(price === p.id ? null : p.id)}
                    onClick={() => {
                      if (price === p.id) setPrice(null)
                    }}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>

            <div className="f-group">
              <h4>Collection</h4>
              {['Everyday', 'Bridal'].map((c) => (
                <label key={c} className="check">
                  <input
                    type="radio"
                    name="collection"
                    checked={collection === c}
                    onChange={() => setCol(collection === c ? null : c)}
                    onClick={() => {
                      if (collection === c) setCol(null)
                    }}
                  />
                  <span>{c} Heirlooms</span>
                </label>
              ))}
            </div>

            <div className="f-group">
              <h4>Availability</h4>
              <label className="check">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock & Ready to Ship</span>
              </label>
            </div>

            <div className="filter-buttons-row">
              <button className="btn btn-line btn-block" onClick={clearAll}>
                Reset All Filters
              </button>
              <button
                className="btn btn-dark btn-block only-mobile"
                onClick={() => setFiltersOpen(false)}
              >
                Show {list.length} Pieces
              </button>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="shop-grid-area">
            {list.length === 0 ? (
              <div className="empty big shop-empty-state">
                <Icon name="gem" size={48} stroke={1} />
                <h2>No pieces match your filters</h2>
                <p className="muted">
                  Try broadening your price range, metal choice, or clearing current search queries.
                </p>
                <button className="btn btn-dark" onClick={clearAll}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`pgrid ${gridCols === 4 ? 'pgrid-4' : 'pgrid-3'}`}>
                {list.map((p, i) => (
                  <Reveal key={p.id} delay={(i % 3) * 70} effect="fade-up">
                    <ProductCard p={p} />
                  </Reveal>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
