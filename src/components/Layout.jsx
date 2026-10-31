import { useEffect, useState, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Logo, Icon, Img, Bow, ScrollProgress, Stars } from './Common'
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
  const [announceVisible, setAnnounceVisible] = useState(true)
  const { pathname } = useLocation()
  const overHero = pathname === '/' && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenu(false)
    setSearch(false)
  }, [pathname])

  return (
    <>
      <ScrollProgress />

      {announceVisible && (
        <div className="announce" role="region" aria-label="Store announcement">
          <div className="announce-track">
            {Array.from({ length: 2 }).map((_, k) => (
              <span key={k}>
                <b>Complimentary insured shipping</b> on orders above ₹999 <i>✦</i> 100% BIS Hallmarked Solid Gold{' '}
                <i>✦</i> 30-day easy returns & lifetime exchange <i>✦</i> Use code <b>FIRSTLOVE</b> for 15% off your first heirloom{' '}
                <i>✦</i> Hand-finished in Jaipur <i>✦</i>
              </span>
            ))}
          </div>
          <button
            className="announce-close"
            onClick={() => setAnnounceVisible(false)}
            aria-label="Dismiss announcement"
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      <header
        className={`header ${overHero ? 'header-hero' : 'header-solid'} ${scrolled ? 'header-scrolled' : ''}`}
      >
        <div className="wrap header-inner">
          <button
            className="icon-btn only-mobile"
            onClick={() => setMenu(true)}
            aria-label="Open mobile navigation"
          >
            <Icon name="menu" size={22} />
          </button>

          <nav className="nav only-desktop" aria-label="Main navigation left">
            {NAV.slice(0, 3).map((n) => (
              <NavLink key={n.label} to={n.to} className="nav-link">
                {n.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/" className="header-logo" aria-label="Caresa Fine Jewellery Home">
            <Logo light={overHero} />
          </Link>

          <div className="header-right">
            <nav className="nav only-desktop" aria-label="Main navigation right">
              {NAV.slice(3).map((n) => (
                <NavLink key={n.label} to={n.to} className="nav-link">
                  {n.label}
                </NavLink>
              ))}
            </nav>

            <button
              className="icon-btn"
              onClick={() => setSearch(true)}
              aria-label="Open search"
              title="Search jewellery"
            >
              <Icon name="search" size={20} />
            </button>

            <Link
              className="icon-btn only-desktop"
              to={user ? '/account' : '/login'}
              aria-label="My Account"
              title={user ? `Signed in as ${user.name}` : 'Sign In'}
            >
              <Icon name="user" size={20} />
              {user && <span className="auth-indicator" />}
            </Link>

            <Link
              className="icon-btn"
              to="/wishlist"
              aria-label={`Wishlist with ${wishlist.length} saved pieces`}
              title="Saved Pieces"
            >
              <Icon name="heart" size={20} />
              {wishlist.length > 0 && <span className="dot">{wishlist.length}</span>}
            </Link>

            <button
              className="icon-btn cart-btn-icon"
              onClick={() => setCartOpen(true)}
              aria-label={`Shopping bag with ${cartCount} items`}
              title="View Bag"
            >
              <Icon name="bag" size={20} />
              {cartCount > 0 && <span className="dot dot-pulse">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <div className={`drawer-bg ${menu ? 'show' : ''}`} onClick={() => setMenu(false)} />
      <aside className={`side-menu ${menu ? 'open' : ''}`} aria-hidden={!menu} aria-label="Mobile menu">
        <div className="side-head">
          <Logo size="sm" />
          <button className="icon-btn" onClick={() => setMenu(false)} aria-label="Close menu">
            <Icon name="close" size={20} />
          </button>
        </div>

        <nav className="side-nav">
          <p className="side-label">Collections</p>
          {NAV.map((n) => (
            <Link key={n.label} to={n.to}>
              {n.label}
            </Link>
          ))}

          <div className="side-divider" />
          <p className="side-label">Concierge & Account</p>
          <Link to="/track">
            <Icon name="truck" size={18} /> Track Order
          </Link>
          <Link to={user ? '/account' : '/login'}>
            <Icon name="user" size={18} /> {user ? `My Account (${user.name})` : 'Sign In / Register'}
          </Link>
          <Link to="/wishlist">
            <Icon name="heart" size={18} /> Saved Pieces ({wishlist.length})
          </Link>
          <Link to="/about">Our Atelier Story</Link>
          <Link to="/contact">Contact Atelier</Link>
          <Link to="/policies">Shipping & Care Guide</Link>
          <Link to="/admin" className="side-admin-link">
            Store Admin Panel →
          </Link>
        </nav>

        <div className="side-foot">
          <p className="small muted">✦ Hand-finished in Jaipur, India</p>
          <span className="small muted">BIS 916 Hallmarked · 100% Certified</span>
        </div>
      </aside>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  )
}

function SearchOverlay({ open, onClose }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results =
    q.trim().length > 1
      ? PRODUCTS.filter((p) =>
          (p.name + ' ' + p.category + ' ' + p.metal + ' ' + p.collection + ' ' + (p.description || ''))
            .toLowerCase()
            .includes(q.toLowerCase())
        ).slice(0, 6)
      : []

  useEffect(() => {
    if (!open) setQ('')
    else setTimeout(() => inputRef.current?.focus(), 80)
  }, [open])

  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const submitSearch = (query) => {
    if (!query.trim()) return
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
    onClose()
  }

  return (
    <div className={`search ${open ? 'open' : ''}`} aria-hidden={!open} role="dialog" aria-label="Search store">
      <div className="wrap">
        <div className="search-bar">
          <Icon name="search" size={24} />
          <input
            ref={inputRef}
            id="search-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gold rings, bridal chokers, solitaires, rose gold…"
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitSearch(q)
            }}
          />
          {q && (
            <button className="search-clear-btn" onClick={() => setQ('')} aria-label="Clear input">
              Clear
            </button>
          )}
          <button className="icon-btn" onClick={onClose} aria-label="Close search">
            <Icon name="close" size={22} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="search-results-section">
            <div className="row-between">
              <p className="eyebrow">Matching Pieces ({results.length})</p>
              <button className="link-arrow" onClick={() => submitSearch(q)}>
                View all in shop <Icon name="arrow" size={14} />
              </button>
            </div>
            <div className="search-results">
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  onClick={onClose}
                  className="search-item"
                >
                  <Img id={p.images[0]} w={180} alt={p.name} />
                  <div>
                    <p className="search-name">{p.name}</p>
                    <small className="search-metal">{p.metal}</small>
                    <div className="search-price">
                      <b>{formatINR(p.price)}</b>
                      <s>{formatINR(p.mrp)}</s>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : q.trim().length > 1 ? (
          <div className="search-empty">
            <p>No jewellery found for “{q}”.</p>
            <p className="small muted">Try searching by metal (e.g. 18K Yellow Gold) or category (e.g. Earrings, Solitaire).</p>
          </div>
        ) : (
          <div className="search-suggest">
            <p className="eyebrow">Popular & Curated Searches</p>
            <div className="chips">
              {['Solitaire Ring', '18K Yellow Gold', 'Meher Collection', 'Bridal Collar', 'Soleil Hoops', 'Tennis Bracelet', 'Rose Gold', '925 Silver'].map((s) => (
                <button
                  key={s}
                  className="chip"
                  onClick={() => {
                    setQ(s)
                    submitSearch(s)
                  }}
                >
                  ✦ {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, updateQty, removeFromCart, subtotal, discount, shipping, total, coupon, applyCoupon, setCoupon } = useStore()
  const [couponCode, setCouponCode] = useState('')
  const [couponErr, setCouponErr] = useState('')
  const navigate = useNavigate()
  const freeLeft = Math.max(0, 999 - subtotal)

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (!couponCode.trim()) return
    const ok = applyCoupon(couponCode)
    if (!ok) setCouponErr('Invalid code. Try FIRSTLOVE (15% off) or CARESA10 (10% off)')
    else {
      setCouponErr('')
      setCouponCode('')
    }
  }

  return (
    <>
      <div className={`drawer-bg ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)} />
      <aside
        className={`cart-drawer ${cartOpen ? 'open' : ''}`}
        aria-hidden={!cartOpen}
        aria-label="Shopping bag drawer"
      >
        <div className="side-head">
          <h3>
            Shopping Bag <span className="muted">({cartItems.length} {cartItems.length === 1 ? 'piece' : 'pieces'})</span>
          </h3>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close bag">
            <Icon name="close" size={20} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty">
            <Bow size={64} />
            <p className="empty-title">Your bag is empty.</p>
            <p className="small muted">Discover our hand-finished heirlooms and fine everyday pieces.</p>
            <button
              className="btn btn-dark"
              onClick={() => {
                setCartOpen(false)
                navigate('/shop')
              }}
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <>
            <div className="ship-meter">
              <div className="ship-meter-head">
                <Icon name="truck" size={16} />
                <p>
                  {freeLeft > 0 ? (
                    <>
                      Add <b>{formatINR(freeLeft)}</b> more for <b>Complimentary Express Shipping</b>
                    </>
                  ) : (
                    <>
                      ✦ Congratulations! You have unlocked <b>Complimentary Insured Shipping</b>
                    </>
                  )}
                </p>
              </div>
              <div className="meter">
                <span style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }} />
              </div>
            </div>

            <div className="cart-lines">
              {cartItems.map((i) => (
                <div className="cart-line" key={i.key}>
                  <Img id={i.product.images[0]} w={220} alt={i.product.name} />
                  <div className="cl-info">
                    <Link
                      to={`/product/${i.product.id}`}
                      onClick={() => setCartOpen(false)}
                      className="cl-name"
                    >
                      {i.product.name}
                    </Link>
                    <small className="cl-spec">
                      {i.product.metal}
                      {i.size ? ` · Size ${i.size}` : ''}
                    </small>

                    <div className="cl-row">
                      <Qty value={i.qty} onChange={(q) => updateQty(i.key, q)} />
                      <span className="price">{formatINR(i.product.price * i.qty)}</span>
                    </div>

                    <button
                      className="link-btn cl-remove"
                      onClick={() => removeFromCart(i.key)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="drawer-coupon-box">
              {coupon ? (
                <div className="coupon-applied-pill">
                  <span>
                    <b>{coupon}</b> applied (−{formatINR(discount)})
                  </span>
                  <button onClick={() => setCoupon(null)} className="link-btn">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="drawer-coupon-form">
                  <input
                    placeholder="Coupon code (FIRSTLOVE, CARESA10)"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value)
                      setCouponErr('')
                    }}
                  />
                  <button type="submit" className="btn btn-sm btn-line">
                    Apply
                  </button>
                </form>
              )}
              {couponErr && <small className="err">{couponErr}</small>}
            </div>

            <div className="drawer-foot">
              <div className="drawer-calc">
                <div className="row-between">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="row-between ok">
                    <span>Discount</span>
                    <span>−{formatINR(discount)}</span>
                  </div>
                )}
                <div className="row-between">
                  <span>Insured Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                </div>
                <div className="row-between drawer-total">
                  <span>Estimated Total</span>
                  <b>{formatINR(total)}</b>
                </div>
              </div>

              <small className="muted small center">
                ✦ All taxes included · 30-day easy returns · BIS Hallmarked
              </small>

              <button
                className="btn btn-dark btn-block"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/checkout')
                }}
              >
                Proceed to Checkout
              </button>

              <button
                className="btn btn-line btn-block"
                onClick={() => {
                  setCartOpen(false)
                  navigate('/cart')
                }}
              >
                View Bag & Details
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export function Qty({ value, onChange, min = 1 }) {
  return (
    <div className="qty" role="group" aria-label="Quantity selector">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= min - 1}
        aria-label="Decrease quantity"
      >
        <Icon name="minus" size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button onClick={() => onChange(value + 1)} aria-label="Increase quantity">
        <Icon name="plus" size={14} />
      </button>
    </div>
  )
}

export function Footer() {
  const { notify } = useStore()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    notify('Welcome to our private circle. Enjoy 15% off with code FIRSTLOVE.', 'success')
  }

  return (
    <footer className="footer">
      <div className="wrap footer-news">
        <div>
          <p className="script light">stay close</p>
          <h3>Letters from the Jaipur Atelier</h3>
          <p className="muted-light">
            Private collection previews, bespoke styling notes, and invitations to our Johari Bazaar showcases. No clutter, only beauty.
          </p>
        </div>

        {subscribed ? (
          <div className="footer-subscribed">
            <Icon name="award" size={24} />
            <div>
              <b>You are on our private guest list.</b>
              <p className="small muted-light">Use code <b>FIRSTLOVE</b> for 15% off your next fine jewellery piece.</p>
            </div>
          </div>
        ) : (
          <form className="news-form" onSubmit={handleSubscribe}>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address for private invitations"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn-gold" type="submit">
              Join Circle
            </button>
          </form>
        )}
      </div>

      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo light />
          <p className="muted-light">
            Fine jewellery cast in solid 18K and 14K gold and 925 sterling silver, thoughtfully crafted in our Jaipur atelier. Every piece is BIS hallmarked, certified, and finished by forty master hands.
          </p>
          <div className="footer-hallmark-badges">
            <span title="BIS Hallmarked Gold"><Icon name="shield" size={16} /> BIS 916</span>
            <span title="Certified Diamonds"><Icon name="gem" size={16} /> IGI Certified</span>
            <span title="Conflict-Free Sourcing"><Icon name="award" size={16} /> Ethical Sourcing</span>
          </div>
          <div className="socials">
            {['Instagram', 'Pinterest', 'Editorial Journal', 'Jaipur Concierge'].map((s) => (
              <a key={s} href="#" onClick={(e) => e.preventDefault()}>
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4>Collections</h4>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/shop?cat=${c.slug}`}>
              {c.name}
            </Link>
          ))}
          <Link to="/shop?collection=Bridal">The Bridal Edit</Link>
        </div>

        <div>
          <h4>Client Concierge</h4>
          <Link to="/track">Track Your Order</Link>
          <Link to="/contact">Book Atelier Visit</Link>
          <Link to="/policies#shipping">Insured Shipping</Link>
          <Link to="/policies#returns">30-Day Returns & Lifetime Exchange</Link>
          <Link to="/policies#care">Jewellery Care & Free Polish</Link>
        </div>

        <div>
          <h4>Caresa House</h4>
          <Link to="/about">Our Story & Artisans</Link>
          <Link to="/gifting">The Art of Gifting</Link>
          <Link to="/account">Collector Account</Link>
          <Link to="/admin">Atelier Admin Panel</Link>
        </div>
      </div>

      <div className="wrap footer-bottom">
        <span>© 2026 Caresa Jewels Pvt. Ltd. · All rights reserved. Handcrafted in Jaipur.</span>
        <span className="footer-payments">
          UPI · Visa · Mastercard · RuPay · NetBanking · Insured Pan-India Express
        </span>
      </div>
    </footer>
  )
}

export function Toast() {
  const { toast } = useStore()
  if (!toast) return null

  const isObj = typeof toast === 'object'
  const message = isObj ? toast.message : toast
  const type = isObj ? toast.type || 'info' : 'info'

  return (
    <div className={`toast toast-${type} show`} role="status" aria-live="polite">
      <Icon name={type === 'success' ? 'check' : type === 'wish' ? 'heart' : 'sparkle'} size={16} />
      <span>{message}</span>
    </div>
  )
}
