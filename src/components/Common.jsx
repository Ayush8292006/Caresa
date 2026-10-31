import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { img, getProduct, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'

/* Brand mark: bow + "caresa" wordmark */
export function Bow({ size = 34, className = '', draw = false }) {
  return (
    <svg
      className={`bow ${draw ? 'bow-draw' : ''} ${className}`}
      width={size}
      height={size * 0.62}
      viewBox="0 0 64 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 21C26 11 15 4 10.5 9.5 6.5 14.5 16 20.5 32 21Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        pathLength="1"
      />
      <path
        d="M32 21C38 11 49 4 53.5 9.5 57.5 14.5 48 20.5 32 21Z"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
        pathLength="1"
      />
      <path d="M32 21 27 31M32 21l5 10" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" pathLength="1" />
      <path d="M8 35h48" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" pathLength="1" />
    </svg>
  )
}

export function Logo({ light = false, size = 'md' }) {
  return (
    <span className={`logo logo-${size} ${light ? 'logo-light' : ''}`}>
      <Bow size={size === 'lg' ? 64 : size === 'sm' ? 22 : 28} />
      <span className="logo-word">caresa</span>
    </span>
  )
}

/* Image with graceful fallback if a CDN photo fails to load */
export function Img({ id, w = 900, alt = '', className = '', ...rest }) {
  const [broken, setBroken] = useState(false)
  const [loaded, setLoaded] = useState(false)

  if (broken) {
    return (
      <div className={`img-fallback ${className}`} role="img" aria-label={alt}>
        <Bow size={40} />
      </div>
    )
  }

  return (
    <img
      src={img(id, w)}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`${className} ${loaded ? 'img-loaded' : 'img-loading'}`}
      onLoad={() => setLoaded(true)}
      onError={() => setBroken(true)}
      {...rest}
    />
  )
}

/* Scroll reveal with directional motion variants */
export function Reveal({ as: Tag = 'div', delay = 0, effect = 'fade-up', className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (!('IntersectionObserver' in window)) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${effect} ${shown ? 'in' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* Scroll Progress Bar at the top of the viewport */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total > 0) {
        setProgress(Math.min(100, Math.max(0, (window.scrollY / total) * 100)))
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="scroll-progress-bar" aria-hidden="true">
      <div className="scroll-progress-fill" style={{ width: `${progress}%` }} />
    </div>
  )
}

export function Stars({ value = 5, onRate = null, size = 'sm' }) {
  return (
    <span className={`stars stars-${size}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`${i <= Math.round(value) ? 'on' : ''} ${onRate ? 'clickable' : ''}`}
          onClick={() => onRate && onRate(i)}
          role={onRate ? 'button' : undefined}
          tabIndex={onRate ? 0 : undefined}
        >
          ★
        </span>
      ))}
    </span>
  )
}

/* Minimal luxury line icons */
const paths = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  bag: (
    <>
      <path d="M5 8h14l-1 13H6L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  truck: (
    <>
      <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14-5L4 8" />
      <path d="M4 3v5h5M4 13a8 8 0 0 0 14 5l2-2" />
      <path d="M20 21v-5h-5" />
    </>
  ),
  gift: (
    <>
      <path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14" />
      <path d="M12 7c-2-4-6-4-6-1s6 1 6 1Zm0 0c2-4 6-4 6-1s-6 1-6 1Z" />
    </>
  ),
  gem: (
    <>
      <path d="M6 3h12l3 6-9 12L3 9l3-6Z" />
      <path d="M3 9h18M9 3l3 18 3-18" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="m15.4 14 2.6 7-6-3-6 3 2.6-7" />
    </>
  ),
  ruler: (
    <>
      <path d="M2 19.5 19.5 2a2.12 2.12 0 0 1 3 3L5 22.5a2.12 2.12 0 0 1-3-3z" />
      <path d="m7 7 2-2M10 10l2-2M13 13l2-2M16 16l2-2" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
  box: (
    <>
      <path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z" />
      <path d="M3 7l9 4 9-4M12 11v10" />
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20c1-3.5 3.8-5 7-5s6 1.5 7 5" />
      <circle cx="17" cy="9" r="2.6" />
      <path d="M17 14c2.4 0 4.2 1.4 5 4" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V3h9l9 9-9 9-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </>
  ),
  logout: (
    <>
      <path d="M15 4h4v16h-4" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  edit: <path d="M4 20h4L20 8l-4-4L4 16v4Z" />,
  trash: (
    <>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  zoom: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  play: <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />,
  pause: (
    <>
      <rect x="6" y="4" width="4" height="16" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" fill="currentColor" />
    </>
  ),
}

export function Icon({ name, size = 20, stroke = 1.5, className = '' }) {
  return (
    <svg
      className={`ic ic-${name} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || paths.gem}
    </svg>
  )
}

export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>
          {i > 0 && <span className="sep">/</span>}
          {it}
        </span>
      ))}
    </nav>
  )
}

/* Quick View Modal Component */
export function QuickViewModal() {
  const { quickViewId, closeQuickView, addToCart, wishlist, toggleWish } = useStore()
  const [activeImg, setActiveImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [qty, setQty] = useState(1)

  const product = quickViewId ? getProduct(quickViewId) : null

  useEffect(() => {
    setActiveImg(0)
    setQty(1)
    if (product?.sizes) {
      setSelectedSize(product.sizes[1] || product.sizes[0])
    } else {
      setSelectedSize(null)
    }
  }, [quickViewId, product])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeQuickView()
    }
    if (quickViewId) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [quickViewId, closeQuickView])

  if (!product) return null

  const isWished = wishlist.includes(product.id)
  const off = Math.round((1 - product.price / product.mrp) * 100)

  return (
    <div className="modal-bg" onClick={closeQuickView} role="dialog" aria-modal="true" aria-label="Product quick view">
      <div className="modal qv-modal" onClick={(e) => e.stopPropagation()}>
        <button className="qv-close" onClick={closeQuickView} aria-label="Close preview">
          <Icon name="close" size={20} />
        </button>

        <div className="qv-grid">
          <div className="qv-media">
            <div className="qv-main-img">
              <Img id={product.images[activeImg] || product.images[0]} w={800} alt={product.name} />
              {product.badge && <span className="badge">{product.badge}</span>}
            </div>
            {product.images.length > 1 && (
              <div className="qv-thumbs">
                {product.images.map((imgId, idx) => (
                  <button
                    key={idx}
                    className={`qv-thumb ${idx === activeImg ? 'active' : ''}`}
                    onClick={() => setActiveImg(idx)}
                    aria-label={`Thumbnail ${idx + 1}`}
                  >
                    <Img id={imgId} w={120} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="qv-details">
            <p className="eyebrow">{product.collection} Collection</p>
            <h2 className="qv-title">{product.name}</h2>

            <div className="qv-rating">
              <Stars value={product.rating} />
              <span>
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="qv-price">
              <span className="price-curr">{formatINR(product.price)}</span>
              <s className="price-mrp">{formatINR(product.mrp)}</s>
              <span className="price-save">{off}% OFF</span>
            </div>

            <p className="qv-desc">{product.description}</p>

            <div className="qv-meta-specs">
              <span>
                <Icon name="award" size={14} /> {product.purity}
              </span>
              <span>
                <Icon name="gem" size={14} /> {product.stones}
              </span>
              <span>
                <Icon name="shield" size={14} /> BIS Hallmarked
              </span>
            </div>

            {product.sizes && (
              <div className="opt qv-opt">
                <div className="row-between">
                  <span className="opt-label">
                    {product.category === 'rings' ? 'Select Ring Size' : 'Select Bangle Size'}
                  </span>
                  {selectedSize && <b>Size {selectedSize}</b>}
                </div>
                <div className="sizes">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      className={selectedSize === s ? 'on' : ''}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="qv-actions">
              <div className="qty">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Icon name="minus" size={14} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  <Icon name="plus" size={14} />
                </button>
              </div>

              <button
                className="btn btn-dark grow"
                onClick={() => {
                  addToCart(product.id, qty, selectedSize)
                  closeQuickView()
                }}
              >
                Add to Bag · {formatINR(product.price * qty)}
              </button>

              <button
                className={`icon-btn boxed ${isWished ? 'wished' : ''}`}
                onClick={() => toggleWish(product.id)}
                aria-label={isWished ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Icon name="heart" size={18} />
              </button>
            </div>

            <div className="qv-footer-links">
              <Link to={`/product/${product.id}`} onClick={closeQuickView} className="link-arrow">
                View Full Details, Sizing & Reviews <Icon name="arrow" size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Interactive Size Guide Modal */
export function SizeGuideModal({ open, onClose, category = 'rings' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-bg" onClick={onClose} role="dialog" aria-modal="true" aria-label="Jewellery size guide">
      <div className="modal size-modal" onClick={(e) => e.stopPropagation()}>
        <div className="side-head">
          <h3>
            <Icon name="ruler" size={20} /> {category === 'bangles' ? 'Bangle Size Guide' : 'Ring Sizing Chart'}
          </h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close size guide">
            <Icon name="close" size={18} />
          </button>
        </div>

        <div className="size-guide-body">
          <p className="muted">
            All Caresa pieces are precision-crafted to Indian and International standard sizing. We offer complimentary resizing within 30 days of purchase.
          </p>

          {category === 'bangles' ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bangle Size</th>
                    <th>Inner Diameter (mm)</th>
                    <th>Inner Circumference (cm)</th>
                    <th>Fit Profile</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>2.4</b></td>
                    <td>57.2 mm</td>
                    <td>17.9 cm</td>
                    <td>Small / Petite wrist</td>
                  </tr>
                  <tr>
                    <td><b>2.6</b></td>
                    <td>60.3 mm</td>
                    <td>18.9 cm</td>
                    <td>Medium / Most common</td>
                  </tr>
                  <tr>
                    <td><b>2.8</b></td>
                    <td>63.5 mm</td>
                    <td>19.9 cm</td>
                    <td>Large wrist / Relaxed fit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Indian Size</th>
                    <th>US Size</th>
                    <th>Inner Diameter (mm)</th>
                    <th>Circumference (mm)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['6', '3.5', '14.5 mm', '45.5 mm'],
                    ['7', '4.0', '14.9 mm', '46.8 mm'],
                    ['8', '4.5', '15.3 mm', '48.0 mm'],
                    ['9', '5.0', '15.7 mm', '49.3 mm'],
                    ['10', '5.5', '16.1 mm', '50.6 mm'],
                    ['11', '6.0', '16.5 mm', '51.9 mm'],
                    ['12', '6.5', '16.9 mm', '53.1 mm'],
                  ].map(([ind, us, dia, circ]) => (
                    <tr key={ind}>
                      <td><b>{ind}</b></td>
                      <td>{us}</td>
                      <td>{dia}</td>
                      <td>{circ}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="size-tips">
            <h4>How to measure at home:</h4>
            <ol>
              <li>Wrap a narrow strip of paper or non-stretchy string snugly around the base of your finger.</li>
              <li>Mark the spot where the paper overlaps with a pen.</li>
              <li>Lay the paper flat against a ruler to measure the circumference in millimeters and match it with the chart above.</li>
            </ol>
            <p className="small muted">
              ✦ If you are between sizes, we recommend ordering the larger size. For bespoke sizes or half sizes, contact our atelier concierge.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* Lightbox Modal for HD Product Photography */
export function ImageLightbox({ images = [], initialIndex = 0, open = false, onClose }) {
  const [current, setCurrent] = useState(initialIndex)

  useEffect(() => {
    setCurrent(initialIndex)
  }, [initialIndex, open])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length)
      if (e.key === 'ArrowLeft') setCurrent((c) => (c - 1 + images.length) % images.length)
    }
    if (open) {
      window.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, images.length, onClose])

  if (!open || images.length === 0) return null

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Fullscreen image gallery">
      <button className="lightbox-close" onClick={onClose} aria-label="Close lightbox">
        <Icon name="close" size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation()
              setCurrent((c) => (c - 1 + images.length) % images.length)
            }}
            aria-label="Previous photo"
          >
            <Icon name="chevronLeft" size={28} />
          </button>
          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation()
              setCurrent((c) => (c + 1) % images.length)
            }}
            aria-label="Next photo"
          >
            <Icon name="chevronRight" size={28} />
          </button>
        </>
      )}

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={img(images[current], 1800)} alt="" className="lightbox-img" />
        <span className="lightbox-counter">
          {current + 1} / {images.length}
        </span>
      </div>
    </div>
  )
}
