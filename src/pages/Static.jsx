import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Reveal, Icon, Bow, Breadcrumb } from '../components/Common'
import ProductCard from '../components/ProductCard'
import { IMAGES, PRODUCTS } from '../data/products'

export function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <Img id={IMAGES.craft} w={1920} alt="Jaipur jewellery atelier craft" className="about-bg" />
        <div className="gift-shade" />
        <div className="wrap about-hero-copy">
          <p className="script light">our heritage</p>
          <h1>Jewellery that feels like an heirloom from day one.</h1>
          <p className="about-hero-sub">
            Cast in solid gold, finished by forty master hands in Johari Bazaar, Jaipur.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap about-grid">
          <Reveal effect="fade-up">
            <p className="eyebrow">Founded in 2019 · Jaipur, India</p>
            <h2>Started at a kitchen table, sculpted by generational master artisans.</h2>
          </Reveal>
          <Reveal delay={120} effect="fade-up" className="prose">
            <p>
              Caresa began with one ring, handcrafted for a sister’s wedding celebration. Friends asked for one too, then their mothers and friends. Today our Johari Bazaar atelier in the heart of Jaipur employs over forty generational master artisans — wax sculptors, precision casters, stone setters, and hand polishers — carrying forward centuries of Royal Rajasthani jewellery traditions.
            </p>
            <p>
              We deliberately reject the disposable fast-fashion jewellery cycle. We work exclusively in solid 18K and 14K BIS-hallmarked gold and 925 sterling silver, incorporate certified recycled precious metals wherever possible, and hand-select 100% natural, conflict-free stones graded by IGI and SGL. No flash plating that chips away, no hollow weights, no artificial markups.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-beige">
        <div className="wrap values">
          {[
            [
              'gem',
              'Honest & Solid Materials',
              'Every gram of gold is assay-tested and stamped with a government BIS 916/585 hallmark and diamond grading certificate.',
            ],
            [
              'refresh',
              'Built for Generations',
              'We offer complimentary lifetime ultrasonic cleaning and buffing, free 30-day resizing, and guaranteed gold buyback at spot market rates.',
            ],
            [
              'gift',
              'Heirloom Presentation',
              'All pieces arrive in our signature velvet-lined keepsake box, tied with satin ribbon and accompanied by personalized calligraphy notes.',
            ],
          ].map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 90} effect="fade-up" className="value-card">
              <div className="value-icon">
                <Icon name={ic} size={28} stroke={1.3} />
              </div>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

export function Gifting() {
  const gifts = PRODUCTS.filter((p) => p.price < 25000)

  return (
    <div className="gifting-page">
      <section className="page-head page-head-dark">
        <div className="wrap">
          <p className="script light">thoughtful keepsakes</p>
          <h1>The Art of Fine Gifting</h1>
          <p>
            Heirlooms for anniversaries, birthdays, weddings, milestones, and self-celebration — presented in our signature box.
          </p>
          <div className="chips">
            {['Under ₹5,000', 'Under ₹15,000', 'Anniversary Gifts', 'Bridal Keepsakes', 'For Her', 'Personalised Monograms'].map((c) => (
              <Link key={c} to="/shop" className="chip chip-light">
                ✦ {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="wrap section-tight">
        <div className="gifting-perks-row">
          <div className="gifting-perk">
            <Icon name="gift" size={20} />
            <span>Complimentary Keepsake Box</span>
          </div>
          <div className="gifting-perk">
            <Icon name="edit" size={20} />
            <span>Handwritten Calligraphy Note</span>
          </div>
          <div className="gifting-perk">
            <Icon name="shield" size={20} />
            <span>Concealed Price Physical Invoice</span>
          </div>
        </div>

        <div className="pgrid">
          {gifts.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 60} effect="fade-up">
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Contact() {
  const { notify } = useStore()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', orderId: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    notify('Thank you. Our atelier concierge will contact you within 24 hours.', 'success')
  }

  return (
    <div className="wrap page-pad contact-page">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Concierge & Contact']} />
      <h1 className="page-title">We would love to welcome you</h1>

      <div className="contact-grid">
        <div className="contact-info">
          <div className="contact-info-card">
            <Icon name="pin" size={22} />
            <div>
              <b>Jaipur Atelier & Private Salon</b>
              <p>14 Johari Bazaar Heritage Lane, Jaipur, Rajasthan 302003</p>
              <small className="muted">Open Monday – Saturday, 10:30 AM – 7:30 PM</small>
            </div>
          </div>

          <div className="contact-info-card">
            <Icon name="user" size={22} />
            <div>
              <b>Client Concierge & Styling</b>
              <p>
                Phone & WhatsApp: <b>+91 98765 43210</b>
                <br />
                Direct Email: <b>concierge@caresa.in</b>
              </p>
            </div>
          </div>

          <div className="contact-info-card">
            <Icon name="gem" size={22} />
            <div>
              <b>Bespoke & Bridal Commissions</b>
              <p>
                Custom engagement solitaires & bridal collars: <b>bridal@caresa.in</b>
              </p>
            </div>
          </div>
        </div>

        {sent ? (
          <div className="co-card center contact-sent-card">
            <Bow size={64} />
            <h2>Message Received</h2>
            <p className="muted">
              Thank you for reaching out, <b>{form.name}</b>. An atelier concierge has received your request and will reply directly to <b>{form.email}</b> within one business day.
            </p>
            <button className="btn btn-line" onClick={() => setSent(false)}>
              Send another message
            </button>
          </div>
        ) : (
          <form className="co-card form-grid" onSubmit={handleSubmit}>
            <h2 className="contact-form-title">Send a Note to Our Atelier</h2>

            <label className="field half">
              <span>Your Name</span>
              <input
                id="ct-name"
                className="input"
                required
                placeholder="e.g. Radhika Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>

            <label className="field half">
              <span>Email Address</span>
              <input
                id="ct-email"
                className="input"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>

            <label className="field half">
              <span>Mobile Number</span>
              <input
                id="ct-phone"
                className="input"
                placeholder="e.g. +91 98765 43210"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </label>

            <label className="field half">
              <span>Order Reference (If Applicable)</span>
              <input
                id="ct-order"
                className="input"
                placeholder="e.g. CRS10248"
                value={form.orderId}
                onChange={(e) => setForm({ ...form, orderId: e.target.value })}
              />
            </label>

            <label className="field">
              <span>Your Inquiries or Bespoke Request</span>
              <textarea
                id="ct-msg"
                className="input"
                rows={5}
                required
                placeholder="Tell us about the piece you are considering, ring sizing questions, or custom requests..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </label>

            <button className="btn btn-dark" type="submit">
              Send Message to Concierge
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export function Policies() {
  const [tab, setTab] = useState('shipping')

  return (
    <div className="wrap page-pad prose-page">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Client Care & Policies']} />
      <h1 className="page-title">Assurance, Shipping & Care</h1>

      <div className="tabs policy-tabs">
        {[
          ['shipping', 'Insured Shipping'],
          ['returns', 'Returns & Lifetime Exchange'],
          ['care', 'Jewellery Care Guide'],
          ['hallmark', 'Hallmarking & Purity'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={tab === key ? 'on' : ''}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="policy-content-panel">
        {tab === 'shipping' && (
          <section id="shipping">
            <h2>Complimentary Insured Express Shipping</h2>
            <p>
              Every single Caresa jewellery shipment is 100% insured from the moment it leaves our Jaipur atelier until it is delivered into your hands. Shipments are transported via BlueDart Express Air or Delhivery in tamper-evident, unmarked discreet packaging.
            </p>
            <ul>
              <li><b>Orders above ₹999:</b> Complimentary door-to-door express delivery across all serviceable Indian pincodes.</li>
              <li><b>Orders below ₹999:</b> Flat nominal fee of ₹99.</li>
              <li><b>In-Stock Pieces:</b> Dispatched within 24–48 hours; delivery in 3–5 business days.</li>
              <li><b>Made-to-Order & Bridal:</b> Meticulously cast and set in 12–15 business days.</li>
            </ul>
          </section>
        )}

        {tab === 'returns' && (
          <section id="returns">
            <h2>30-Day Hassle-Free Returns & Lifetime Exchange</h2>
            <p>
              We want you to hold your piece and cherish it with absolute confidence. If for any reason it does not feel right, you may initiate a return within 30 days of delivery.
            </p>
            <ul>
              <li><b>30-Day Full Refund:</b> Unworn pieces in original condition with security tag and certificate are eligible for a 100% refund.</li>
              <li><b>Custom Engraved Pieces:</b> May be exchanged for another size or design, but cannot be refunded.</li>
              <li><b>Lifetime Gold Exchange:</b> Return any Caresa solid gold piece anytime in the future to receive 100% of the gold weight value at prevailing spot bullion rates against a new purchase.</li>
            </ul>
          </section>
        )}

        {tab === 'care' && (
          <section id="care">
            <h2>Jewellery Longevity & Annual Atelier Polish</h2>
            <p>
              Precious gold and silver are living metals that reflect the life of the wearer. To keep your heirlooms radiant:
            </p>
            <ul>
              <li><b>Application Rule:</b> Always put your jewellery on last — after lotions, perfumes, and hairspray have dried.</li>
              <li><b>Storage:</b> Store individual pieces in their provided microfiber pouch to prevent surfaces from scratching one another.</li>
              <li><b>Gentle Home Cleaning:</b> Soak for five minutes in lukewarm water with mild liquid soap. Gently brush with an ultra-soft baby toothbrush and pat dry with a lint-free cloth.</li>
              <li><b>Complimentary Annual Buffing:</b> Ship or bring your piece to our atelier for free ultrasonic cleaning and hand-polishing once a year.</li>
            </ul>
          </section>
        )}

        {tab === 'hallmark' && (
          <section id="hallmark">
            <h2>BIS 916 Hallmarking & Diamond Certification</h2>
            <p>
              In strict accordance with Bureau of Indian Standards (BIS) regulations, every single piece of gold jewellery crafted by Caresa is stamped with:
            </p>
            <ul>
              <li><b>The BIS Hallmark Triangle mark</b></li>
              <li><b>Purity Grade Stamp:</b> 750 for 18K Gold, 585 for 14K Gold, 925 for Sterling Silver</li>
              <li><b>6-digit alphanumeric HUID (Hallmark Unique Identification) code</b></li>
              <li><b>Caresa Atelier Sponsor Mark</b></li>
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="wrap page-pad empty big not-found-page">
      <Bow size={72} />
      <h1 className="page-title">This piece has wandered off</h1>
      <p className="muted">
        The page or collection you are seeking may have moved or is no longer available.
      </p>
      <Link to="/" className="btn btn-dark">
        Return to Atelier Home
      </Link>
    </div>
  )
}
