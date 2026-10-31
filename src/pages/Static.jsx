import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Reveal, Icon, Bow, Breadcrumb } from '../components/Common'
import ProductCard from '../components/ProductCard'
import { IMAGES, PRODUCTS } from '../data/products'

export function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <Img id={IMAGES.craft} w={1800} alt="" className="about-bg" />
        <div className="gift-shade" />
        <div className="wrap about-hero-copy">
          <p className="script light">our story</p>
          <h1>Jewellery that feels like a keepsake from day one.</h1>
        </div>
      </section>
      <section className="section">
        <div className="wrap about-grid">
          <Reveal>
            <p className="eyebrow">Since 2019 · Jaipur</p>
            <h2>Started at a kitchen table, finished by forty pairs of hands.</h2>
          </Reveal>
          <Reveal delay={120} className="prose">
            <p>Caresa began with one ring, made for a sister's wedding. Friends asked for one too, then their friends. Today our atelier in Jaipur employs over forty artisans — wax carvers, setters, polishers — many trained in the city's centuries-old jewellery lanes.</p>
            <p>We work only in solid, hallmarked gold and 925 silver, use recycled metal wherever we can, and source certified, conflict-free stones. No plating that fades, no hidden weights. Every invoice lists exactly what you are paying for.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-beige">
        <div className="wrap values">
          {[['gem', 'Honest materials', 'Solid gold and silver, BIS hallmarked, with stone certificates.'], ['refresh', 'Made to last', 'Lifetime polishing, free resizing and gold exchange at today’s rate.'], ['gift', 'Thoughtful details', 'Keepsake boxes, handwritten notes and engraving at no cost.']].map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 100} className="value"><Icon name={ic} size={30} stroke={1.2} /><h3>{t}</h3><p>{d}</p></Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

export function Gifting() {
  const gifts = PRODUCTS.filter((p) => p.price < 20000)
  return (
    <div>
      <section className="page-head page-head-dark">
        <div className="wrap">
          <p className="script light">thoughtful gifts</p>
          <h1>Gifts for every moment</h1>
          <p>Birthdays, anniversaries, festivals and corporate gifting — wrapped in our signature box.</p>
          <div className="chips">{['Under ₹5,000', 'Under ₹10,000', 'For Her', 'For Him', 'Anniversary', 'Corporate'].map((c) => <Link key={c} to="/shop" className="chip chip-light">{c}</Link>)}</div>
        </div>
      </section>
      <div className="wrap section-tight">
        <div className="pgrid">{gifts.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 70}><ProductCard p={p} /></Reveal>)}</div>
      </div>
    </div>
  )
}

export function Contact() {
  const { notify } = useStore()
  const [sent, setSent] = useState(false)
  return (
    <div className="wrap page-pad">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Contact']} />
      <h1 className="page-title">We'd love to hear from you</h1>
      <div className="contact-grid">
        <div className="contact-info">
          <div><Icon name="pin" /><div><b>Atelier & Store</b><p>14 Johari Bazaar Road, Jaipur, Rajasthan 302003</p></div></div>
          <div><Icon name="user" /><div><b>Customer care</b><p>+91 98765 43210 (Mon–Sat, 10am–7pm)<br />care@caresa.in</p></div></div>
          <div><Icon name="gift" /><div><b>Corporate & bulk gifting</b><p>gifting@caresa.in</p></div></div>
        </div>
        {sent ? (
          <div className="co-card center"><Bow size={56} /><h3>Message sent</h3><p className="muted">Our team will reply within one working day.</p></div>
        ) : (
          <form className="co-card form-grid" onSubmit={(e) => { e.preventDefault(); setSent(true); notify('Message sent') }}>
            <label className="field half"><span>Name</span><input id="ct-name" className="input" required /></label>
            <label className="field half"><span>Email</span><input id="ct-email" className="input" type="email" required /></label>
            <label className="field"><span>Order ID (optional)</span><input id="ct-order" className="input" /></label>
            <label className="field"><span>Message</span><textarea id="ct-msg" className="input" rows={5} required /></label>
            <button className="btn btn-dark">Send message</button>
          </form>
        )}
      </div>
    </div>
  )
}

export function Policies() {
  return (
    <div className="wrap page-pad prose-page">
      <h1 className="page-title">Shipping, Returns & Care</h1>
      <section id="shipping"><h2>Shipping</h2><p>All orders ship fully insured via BlueDart or Delhivery. Free shipping on orders above ₹999; otherwise ₹99. In-stock pieces dispatch within 48 hours; made-to-order bridal pieces take 12–15 days.</p></section>
      <section id="returns"><h2>Returns & exchange</h2><p>Return any unworn piece within 30 days for a full refund. Engraved and personalised items can be exchanged but not refunded. Gold pieces can be exchanged for life at the prevailing gold rate.</p></section>
      <section id="care"><h2>Jewellery care</h2><p>Keep each piece in its pouch, away from perfume, lotions and chlorinated water. Clean gently with a soft cloth. Visit or mail us for a complimentary yearly polish.</p></section>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="wrap page-pad empty big">
      <Bow size={64} />
      <h1 className="page-title">This page has wandered off</h1>
      <Link to="/" className="btn btn-dark">Back to home</Link>
    </div>
  )
}
