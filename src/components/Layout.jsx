import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Logo, Icon, Img, Bow } from './Common'
import { CATEGORIES, PRODUCTS, formatINR } from '../data/products'

const NAV = [
  { to: '/shop', label: 'Shop All' },
  { to: '/shop?cat=rings', label: 'Rings' },
  { to: '/shop?cat=necklaces', label: 'Necklaces' },
  { to: '/shop?cat=earrings', label: 'Earrings' },
  { to: '/shop?collection=Bridal', label: 'Bridal' },
  { to: '/gifting', label: 'Gifting' },
]

export function Header() {
  const { cartCount, wishlist, setCartOpen, user } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)
  const { pathname } = useLocation()
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { setMenu(false); setSearch(false) }, [pathname])

  return (
    <>
      <div className="announce">
        <div className="announce-track">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k}>
              <b>Complimentary shipping</b> on orders above ₹999 <i>✦</i> BIS Hallmarked gold <i>✦</i> 30-day easy returns <i>✦</i> Use <b>FIRSTLOVE</b> for 15% off your first order <i>✦</i> Lifetime polishing & care <i>✦</i>
            </span>
          ))}
        </div>
      </div>
      <header className={`header ${overHero ? 'header-hero' : 'header-solid'}`}>
        <div className="wrap header-inner">
          <button className="icon-btn only-mobile" onClick={() => setMenu(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <nav className="nav only-desktop">
            {NAV.slice(0, 3).map((n) => <NavLink key={n.label} to={n.to} className="nav-link">{n.label}</NavLink>)}
          </nav>
          <Link to="/" className="header-logo" aria-label="Caresa home"><Logo /></Link>
          <div className="header-right">
            <nav className="nav only-desktop">
              {NAV.slice(3).map((n) => <NavLink key={n.label} to={n.to} className="nav-link">{n.label}</NavLink>)}
            </nav>
            <button className="icon-btn" onClick={() => setSearch(true)} aria-label="Search"><Icon name="search" /></button>
            <Link className="icon-btn only-desktop" to={user ? '/account' : '/login'} aria-label="Account"><Icon name="user" /></Link>
            <Link className="icon-btn" to="/wishlist" aria-label="Wishlist"><Icon name="heart" />{wishlist.length > 0 && <span className="dot">{wishlist.length}</span>}</Link>
            <button className="icon-btn" onClick={() => setCartOpen(true)} aria-label="Cart"><Icon name="bag" />{cartCount > 0 && <span className="dot">{cartCount}</span>}</button>
          </div>
        </div>
      </header>

      <div className={`drawer-bg ${menu ? 'show' : ''}`} onClick={() => setMenu(false)} />
      <aside className={`side-menu ${menu ? 'open' : ''}`} aria-hidden={!menu}>
        <div className="side-head"><Logo size="sm" /><button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu"><Icon name="close" /></button></div>
        <nav className="side-nav">
          {NAV.map((n) => <Link key={n.label} to={n.to}>{n.label}</Link>)}
          <Link to="/track">Track Order</Link>
          <Link to={user ? '/account' : '/login'}>{user ? 'My Account' : 'Sign In'}</Link>
          <Link to="/about">Our Story</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin" className="muted">Admin Panel</Link>
        </nav>
      </aside>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}

function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const results = q.trim().length > 1
    ? PRODUCTS.filter((p) => (p.name + p.category + p.metal).toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : []
  useEffect(() => { if (!open) setQ('') }, [open])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onClose])
  return (
    <div className={`search ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="wrap">
        <div className="search-bar">
          <Icon name="search" size={22} />
          <input id="search-input" autoFocus={open} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search rings, hoops, rose gold…"
            onKeyDown={(e) => { if (e.key === 'Enter' && q) { navigate(`/shop?q=${encodeURIComponent(q)}`); onClose() } }} />
          <button className="icon-btn" onClick={onClose} aria-label="Close search"><Icon name="close" /></button>
        </div>
        {results.length > 0 ? (
          <div className="search-results">
            {results.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} onClick={onClose} className="search-item">
                <Img id={p.images[0]} w={160} alt={p.name} />
                <div><p>{p.name}</p><small>{p.metal} · {formatINR(p.price)}</small></div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="search-suggest">
            <p className="eyebrow">Popular searches</p>
            <div className="chips">
              {['Solitaire', 'Hoops', 'Rose Gold', 'Pendant', 'Bridal', 'Silver'].map((s) => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, updateQty, removeFromCart, subtotal } = useStore()
  const navigate = useNavigate()
  const freeLeft = Math.max(0, 999 - subtotal)
  return (
    <>
      <div className={`drawer-bg ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)} />
      <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen} aria-label="Shopping bag">
        <div className="side-head">
          <h3>Your Bag <span className="muted">({cartItems.length})</span></h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close bag"><Icon name="close" /></button>
        </div>
        {cartItems.length === 0 ? (
          <div className="empty">
            <Bow size={56} />
            <p>Your bag is waiting for something beautiful.</p>
            <button className="btn btn-dark" onClick={() => { setCartOpen(false); navigate('/shop') }}>Explore Jewellery</button>
          </div>
        ) : (
          <>
            <div className="ship-meter">
              <p>{freeLeft > 0 ? <>Add <b>{formatINR(freeLeft)}</b> for complimentary shipping</> : <>You've unlocked <b>complimentary shipping</b></>}</p>
              <div className="meter"><span style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }} /></div>
            </div>
            <div className="cart-lines">
              {cartItems.map((i) => (
                <div className="cart-line" key={i.key}>
                  <Img id={i.product.images[0]} w={200} alt={i.product.name} />
                  <div className="cl-info">
                    <Link to={`/product/${i.product.id}`} onClick={() => setCartOpen(false)} className="cl-name">{i.product.name}</Link>
                    <small>{i.product.metal}{i.size ? ` · Size ${i.size}` : ''}</small>
                    <div className="cl-row">
                      <Qty value={i.qty} onChange={(q) => updateQty(i.key, q)} />
                      <span className="price">{formatINR(i.product.price * i.qty)}</span>
                    </div>
                    <button className="link-btn" onClick={() => removeFromCart(i.key)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="row-between"><span>Subtotal</span><b>{formatINR(subtotal)}</b></div>
              <small className="muted">Taxes included. Shipping & coupons at checkout.</small>
              <button className="btn btn-dark btn-block" onClick={() => { setCartOpen(false); navigate('/checkout') }}>Checkout</button>
              <button className="btn btn-line btn-block" onClick={() => { setCartOpen(false); navigate('/cart') }}>View Bag</button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export function Qty({ value, onChange, min = 1 }) {
  return (
    <div className="qty">
      <button onClick={() => onChange(value - 1)} disabled={value <= min - 1} aria-label="Decrease"><Icon name="minus" size={14} /></button>
      <span>{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Increase"><Icon name="plus" size={14} /></button>
    </div>
  )
}

export function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  return (
    <footer className="footer">
      <div className="wrap footer-news">
        <div>
          <p className="script">stay close</p>
          <h3>Letters from the atelier</h3>
          <p className="muted-light">New collections, styling notes and private previews. No clutter.</p>
        </div>
        <form className="news-form" onSubmit={(e) => { e.preventDefault(); if (email) { notify('Thank you for subscribing'); setEmail('') } }}>
          <input id="newsletter-email" type="email" required placeholder="Your email address" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn btn-gold">Subscribe</button>
        </form>
      </div>
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p className="muted-light">Fine jewellery, thoughtfully made in Jaipur. Every piece is hallmarked, certified and finished by hand.</p>
          <div className="socials">
            {['Instagram', 'Pinterest', 'Facebook', 'YouTube'].map((s) => <a key={s} href="#" onClick={(e) => e.preventDefault()}>{s}</a>)}
          </div>
        </div>
        <div>
          <h4>Shop</h4>
          {CATEGORIES.slice(0, 5).map((c) => <Link key={c.slug} to={`/shop?cat=${c.slug}`}>{c.name}</Link>)}
        </div>
        <div>
          <h4>Help</h4>
          <Link to="/track">Track Order</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/policies#shipping">Shipping</Link>
          <Link to="/policies#returns">Returns & Exchange</Link>
          <Link to="/policies#care">Jewellery Care</Link>
        </div>
        <div>
          <h4>Caresa</h4>
          <Link to="/about">Our Story</Link>
          <Link to="/gifting">Gifting</Link>
          <Link to="/account">My Account</Link>
          <Link to="/admin">Admin Panel</Link>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© 2026 Caresa Jewels Pvt. Ltd.</span>
        <span>UPI · Visa · Mastercard · RuPay · COD</span>
      </div>
    </footer>
  )
}

export function Toast() {
  const { toast } = useStore()
  return <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
}
