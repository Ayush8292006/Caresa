import { useEffect, useRef, useState } from 'react'
import { img } from '../data/products'

/* Brand mark: bow + "caresa" wordmark (chosen from the moodboard, top-left variant) */
export function Bow({ size = 34, className = '', draw = false }) {
  return (
    <svg className={`bow ${draw ? 'bow-draw' : ''} ${className}`} width={size} height={size * 0.62} viewBox="0 0 64 40" fill="none" aria-hidden="true">
      <path d="M32 21C26 11 15 4 10.5 9.5 6.5 14.5 16 20.5 32 21Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" pathLength="1" />
      <path d="M32 21C38 11 49 4 53.5 9.5 57.5 14.5 48 20.5 32 21Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" pathLength="1" />
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
  if (broken) return <div className={`img-fallback ${className}`} role="img" aria-label={alt}><Bow size={40} /></div>
  return <img src={img(id, w)} alt={alt} loading="lazy" className={className} onError={() => setBroken(true)} {...rest} />
}

/* Scroll reveal */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setShown(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect() } }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  )
}

export function Stars({ value = 5 }) {
  return (
    <span className="stars" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= Math.round(value) ? 'on' : ''}>★</span>)}
    </span>
  )
}

/* Minimal line icons */
const paths = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />,
  bag: <><path d="M5 8h14l-1 13H6L5 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></>,
  menu: <path d="M3 7h18M3 12h18M3 17h18" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  truck: <><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  refresh: <><path d="M20 11a8 8 0 0 0-14-5L4 8" /><path d="M4 3v5h5M4 13a8 8 0 0 0 14 5l2-2" /><path d="M20 21v-5h-5" /></>,
  gift: <><path d="M4 11h16v10H4zM3 7h18v4H3zM12 7v14" /><path d="M12 7c-2-4-6-4-6-1s6 1 6 1Zm0 0c2-4 6-4 6-1s-6 1-6 1Z" /></>,
  gem: <><path d="M6 3h12l3 6-9 12L3 9l3-6Z" /><path d="M3 9h18M9 3l3 18 3-18" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
  box: <><path d="M3 7l9-4 9 4v10l-9 4-9-4V7Z" /><path d="M3 7l9 4 9-4M12 11v10" /></>,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2 20c1-3.5 3.8-5 7-5s6 1.5 7 5" /><circle cx="17" cy="9" r="2.6" /><path d="M17 14c2.4 0 4.2 1.4 5 4" /></>,
  tag: <><path d="M3 12V3h9l9 9-9 9-9-9Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" /></>,
  logout: <><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4M6 12h10" /></>,
  pin: <><path d="M12 21s7-6 7-12a7 7 0 0 0-14 0c0 6 7 12 7 12Z" /><circle cx="12" cy="9" r="2.5" /></>,
  edit: <path d="M4 20h4L20 8l-4-4L4 16v4Z" />,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
}
export function Icon({ name, size = 20, stroke = 1.5, className = '' }) {
  return (
    <svg className={`ic ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={i}>{i > 0 && <span className="sep">/</span>}{it}</span>
      ))}
    </nav>
  )
}
