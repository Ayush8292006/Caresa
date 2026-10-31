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
  const [sort, setSort] = useState(params.get('sort') || 'featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const list = useMemo(() => {
    let l = PRODUCTS.filter((p) =>
      (!cat || p.category === cat) &&
      (!collection || p.collection === collection) &&
      (!q || (p.name + p.category + p.metal + p.collection).toLowerCase().includes(q.toLowerCase())) &&
      (metals.length === 0 || metals.includes(p.metal)) &&
      (!price || PRICES.find((x) => x.id === price).test(p))
    )
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'popular') l = [...l].sort((a, b) => b.reviews - a.reviews)
    if (sort === 'new') l = [...l].sort((a, b) => (b.badge === 'New') - (a.badge === 'New'))
    return l
  }, [cat, collection, q, metals, price, sort])

  const title = q ? `Results for “${q}”` : collection ? `${collection} Collection` : cat ? CATEGORIES.find((c) => c.slug === cat)?.name : 'All Jewellery'
  const setCat = (slug) => { const p = new URLSearchParams(params); slug ? p.set('cat', slug) : p.delete('cat'); p.delete('q'); setParams(p) }
  const clearAll = () => { setMetals([]); setPrice(null); setParams({}) }
  const toggleMetal = (m) => setMetals((ms) => (ms.includes(m) ? ms.filter((x) => x !== m) : [...ms, m]))

  return (
    <div className="shop">
      <section className="page-head">
        <div className="wrap">
          <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Shop', title]} />
          <h1>{title}</h1>
          <p className="muted">{list.length} pieces · Hallmarked & certified</p>
        </div>
      </section>

      <div className="wrap">
        <div className="cat-pills">
          <button className={!cat ? 'on' : ''} onClick={() => setCat(null)}>All</button>
          {CATEGORIES.map((c) => <button key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => setCat(c.slug)}>{c.name}</button>)}
        </div>

        <div className="shop-bar">
          <button className="btn btn-line btn-sm only-mobile" onClick={() => setFiltersOpen(true)}>Filters {(metals.length + (price ? 1 : 0)) > 0 && `(${metals.length + (price ? 1 : 0)})`}</button>
          <span className="muted only-desktop">Showing {list.length} of {PRODUCTS.length}</span>
          <label className="sort">
            <span>Sort</span>
            <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="featured">Featured</option>
              <option value="popular">Most popular</option>
              <option value="new">Newest</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
            </select>
          </label>
        </div>

        <div className="shop-layout">
          <aside className={`filters ${filtersOpen ? 'open' : ''}`}>
            <div className="side-head only-mobile"><h3>Filters</h3><button className="icon-btn" onClick={() => setFiltersOpen(false)} aria-label="Close filters"><Icon name="close" /></button></div>
            <div className="f-group">
              <h4>Metal</h4>
              {METALS.map((m) => (
                <label key={m} className="check"><input type="checkbox" checked={metals.includes(m)} onChange={() => toggleMetal(m)} /><span>{m}</span></label>
              ))}
            </div>
            <div className="f-group">
              <h4>Price</h4>
              {PRICES.map((p) => (
                <label key={p.id} className="check"><input type="radio" name="price" checked={price === p.id} onChange={() => setPrice(p.id)} /><span>{p.label}</span></label>
              ))}
            </div>
            <div className="f-group">
              <h4>Collection</h4>
              {['Everyday', 'Bridal'].map((c) => (
                <label key={c} className="check"><input type="radio" name="col" checked={collection === c}
                  onChange={() => { const p = new URLSearchParams(params); p.set('collection', c); setParams(p) }} /><span>{c}</span></label>
              ))}
            </div>
            <button className="btn btn-line btn-block" onClick={clearAll}>Clear all</button>
            <button className="btn btn-dark btn-block only-mobile" onClick={() => setFiltersOpen(false)}>Show {list.length} pieces</button>
          </aside>

          <div>
            {list.length === 0 ? (
              <div className="empty big"><p>No pieces match these filters.</p><button className="btn btn-dark" onClick={clearAll}>Reset filters</button></div>
            ) : (
              <div className="pgrid pgrid-3">
                {list.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 80}><ProductCard p={p} /></Reveal>)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
