import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Img, Reveal, Icon, Stars } from '../components/Common'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, IMAGES, TESTIMONIALS, formatINR } from '../data/products'
import { useStore } from '../context/StoreContext'

const SLIDES = [
  {
    img: IMAGES.heroRing,
    kicker: 'The Bridal Atelier · 2026',
    title: (
      <>
        Cast in gold,<br />
        made for <em>forever</em>.
      </>
    ),
    subtitle: 'Hand-finished solitaires and heirloom sets, cast in certified 18K solid gold.',
    cta: 'Explore Bridal Edit',
    to: '/shop?collection=Bridal',
    tag: 'BIS 916 Hallmarked Gold',
  },
  {
    img: IMAGES.heroNecklace,
    kicker: 'New In Atelier · Meher Collection',
    title: (
      <>
        Layers of gold,<br />
        <em>softly</em> worn.
      </>
    ),
    subtitle: 'Feather-light collars and graduated chains crafted for graceful everyday luxury.',
    cta: 'Discover Necklaces',
    to: '/shop?cat=necklaces',
    tag: 'Natural VS-GH Diamonds',
  },
  {
    img: IMAGES.heroModel,
    kicker: 'Signature Everyday Fine',
    title: (
      <>
        Little luxuries<br />
        for <em>every day</em>.
      </>
    ),
    subtitle: 'Solid gold hoops, tennis bracelets and stacking bands made never to be taken off.',
    cta: 'Shop Bestsellers',
    to: '/shop?sort=popular',
    tag: 'Lifetime Free Polish',
  },
]

const CRAFT_STAGES = [
  {
    step: '01',
    title: 'Wax Carving & CAD',
    desc: 'Each design begins with hand-carved wax or precision 3D CAD modeling to balance proportions, stone seatings and comfortable ergonomics.',
    tag: 'Precision Fit',
  },
  {
    step: '02',
    title: 'Lost-Wax Precious Casting',
    desc: 'Molten 18K or 14K hallmarked gold is vacuum-cast into tree flasks, creating a solid, porous-free metal foundation built for generations.',
    tag: 'Solid Metal',
  },
  {
    step: '03',
    title: 'Microscope Gem Setting',
    desc: 'Master setters examine each natural diamond under 20x magnification, seating stones with secure prongs and pavé bezels.',
    tag: 'IGI Graded',
  },
  {
    step: '04',
    title: 'Hand Mirror Polish',
    desc: 'Using natural cotton wheels and rogue compounds, our polishers give each facet a deep, luminous warm mirror glow before hallmarking.',
    tag: 'BIS 916 Stamped',
  },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [curatedTab, setCuratedTab] = useState('bestsellers')
  const [activeCraft, setActiveCraft] = useState(0)
  const { openQuickView, recentlyViewed } = useStore()
  const heroRef = useRef(null)

  // Auto-advance hero slides
  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [playing])

  const curatedProducts = {
    bestsellers: PRODUCTS.filter((p) => p.badge === 'Bestseller' || p.rating >= 4.9).slice(0, 4),
    new: PRODUCTS.filter((p) => p.badge === 'New' || p.badge === 'Limited').slice(0, 4),
    bridal: PRODUCTS.filter((p) => p.collection === 'Bridal').slice(0, 4),
    everyday: PRODUCTS.filter((p) => p.collection === 'Everyday' && p.price < 20000).slice(0, 4),
  }

  const recentProducts = recentlyViewed
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4)

  const scrollToContent = () => {
    const el = document.getElementById('trust-pillars')
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home-page">
      {/* ===================== HERO SECTION ===================== */}
      <section className="hero" ref={heroRef} aria-label="Featured Campaigns">
        {SLIDES.map((s, i) => (
          <div key={i} className={`hero-slide ${i === slide ? 'active' : ''}`} aria-hidden={i !== slide}>
            <Img id={s.img} w={1920} alt="" className="hero-img" />
          </div>
        ))}

        <div className="hero-shade" />

        <div className="wrap hero-content-wrap">
          <div className="hero-content" key={slide}>
            <div className="hero-badge-pill hero-anim" style={{ animationDelay: '0.1s' }}>
              <Icon name="sparkle" size={13} />
              <span>{SLIDES[slide].kicker}</span>
            </div>

            <h1 className="hero-title hero-anim" style={{ animationDelay: '0.22s' }}>
              {SLIDES[slide].title}
            </h1>

            <p className="hero-subtitle hero-anim" style={{ animationDelay: '0.36s' }}>
              {SLIDES[slide].subtitle}
            </p>

            <div className="hero-actions hero-anim" style={{ animationDelay: '0.48s' }}>
              <Link to={SLIDES[slide].to} className="btn btn-light hero-cta-btn">
                {SLIDES[slide].cta} <Icon name="arrow" size={14} />
              </Link>
              <Link to="/shop" className="btn btn-ghost-light">
                Explore All Pieces
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Interactive Timeline & Controls */}
        <div className="hero-bottom-bar wrap">
          <div className="hero-slide-controls">
            <button
              className="hero-nav-arrow"
              onClick={() => setSlide((s) => (s - 1 + SLIDES.length) % SLIDES.length)}
              aria-label="Previous slide"
            >
              <Icon name="chevronLeft" size={18} />
            </button>

            <div className="hero-dots" role="tablist" aria-label="Slides">
              {SLIDES.map((s, i) => (
                <button
                  key={i}
                  className={`hero-dot-btn ${i === slide ? 'on' : ''}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}: ${s.kicker}`}
                  role="tab"
                  aria-selected={i === slide}
                >
                  <span className="dot-num">{String(i + 1).padStart(2, '0')}</span>
                  <div className="dot-progress-track">
                    <span className={`dot-progress-fill ${i === slide && playing ? 'animating' : ''}`} />
                  </div>
                </button>
              ))}
            </div>

            <button
              className="hero-nav-arrow"
              onClick={() => setSlide((s) => (s + 1) % SLIDES.length)}
              aria-label="Next slide"
            >
              <Icon name="chevronRight" size={18} />
            </button>

            <button
              className="hero-play-btn"
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}
              title={playing ? 'Pause' : 'Play'}
            >
              <Icon name={playing ? 'pause' : 'play'} size={14} />
            </button>
          </div>

          <button className="hero-scroll-cue" onClick={scrollToContent} aria-label="Scroll down">
            <span>Scroll to explore</span>
            <div className="scroll-cue-mouse">
              <span className="scroll-cue-wheel" />
            </div>
          </button>
        </div>
      </section>

      {/* ===================== TRUST PILLARS STRIP ===================== */}
      <section className="trust" id="trust-pillars" aria-label="Caresa Promises">
        <div className="wrap trust-grid">
          {[
            ['shield', 'BIS 916 Hallmarked', 'Every gold piece is certified for exact purity by government-approved assay.'],
            ['gem', 'IGI Certified Solitaires', 'Natural conflict-free diamonds, graded for cut, color, clarity and carat.'],
            ['truck', 'Insured Pan-India Express', 'Complimentary insured door-to-door transit on orders above ₹999.'],
            ['refresh', '30-Day Returns & Exchange', 'Full refund within 30 days, plus guaranteed lifetime exchange on gold.'],
          ].map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 70} effect="fade-up" className="trust-item">
              <div className="trust-icon-box">
                <Icon name={ic} size={24} stroke={1.4} />
              </div>
              <div className="trust-text">
                <b>{t}</b>
                <span>{d}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===================== SHOP BY CATEGORY ===================== */}
      <section className="section sec-categories">
        <div className="wrap">
          <Reveal className="sec-head center" effect="fade-up">
            <p className="eyebrow">Curated Collections</p>
            <h2>
              Discover your <em>forever</em> piece
            </h2>
            <p className="sec-subtext">
              Thoughtfully sculpted in 18K solid gold, 14K rose gold and 925 sterling silver.
            </p>
          </Reveal>

          <div className="cat-grid">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 60} effect="fade-up">
                <Link to={`/shop?cat=${c.slug}`} className="cat-card">
                  <div className="cat-img-frame">
                    <Img id={c.image} w={640} alt={c.name} className="cat-photo" />
                    <span className="cat-badge-count">{c.count} pieces</span>
                  </div>
                  <div className="cat-meta">
                    <span className="cat-name">{c.name}</span>
                    <small className="cat-subtitle">{c.subtitle}</small>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CURATED SHOWCASE (INTERACTIVE TABS) ===================== */}
      <section className="section section-beige sec-showcase">
        <div className="wrap">
          <Reveal className="sec-head row-between wrap-gap" effect="fade-up">
            <div>
              <p className="eyebrow">The Atelier Edit</p>
              <h2>Handpicked Heirlooms</h2>
            </div>

            {/* Showcase Category Tabs */}
            <div className="showcase-tabs" role="tablist" aria-label="Curated piece categories">
              {[
                ['bestsellers', 'Most Loved'],
                ['new', 'Just In Atelier'],
                ['bridal', 'Bridal Edit'],
                ['everyday', 'Everyday Luxe'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={`showcase-tab ${curatedTab === key ? 'active' : ''}`}
                  onClick={() => setCuratedTab(key)}
                  role="tab"
                  aria-selected={curatedTab === key}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="pgrid">
            {curatedProducts[curatedTab].map((p, i) => (
              <Reveal key={p.id} delay={i * 80} effect="fade-up">
                <ProductCard p={p} />
              </Reveal>
            ))}
          </div>

          <div className="center mt-large">
            <Link to="/shop" className="btn btn-dark">
              View All {PRODUCTS.length} Atelier Pieces <Icon name="arrow" size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL BRIDAL ATELIER SPLIT ===================== */}
      <section className="editorial" aria-label="Bridal Jewellery Spotlight">
        <div className="ed-media">
          <Img id={IMAGES.bridal} w={1400} alt="Bridal gold collar and earrings" className="ed-img" />
          <div className="ed-floating-pill">
            <Icon name="sparkle" size={14} />
            <span>Cast in 18K Solid Gold · Certified IGI</span>
          </div>
        </div>

        <div className="ed-copy">
          <Reveal effect="fade-left">
            <p className="script light">the bridal atelier</p>
            <h2>
              Heirlooms,<br />
              designed for today.
            </h2>
            <p>
              From solitaire engagement rings that capture the morning light to intricate collars for your wedding day, our bridal pieces are crafted in solid 18K gold and set by hand — made to be cherished, lived in, and passed on.
            </p>

            <ul className="ed-points">
              <li>
                <Icon name="check" size={18} />
                <span>Complimentary custom inside-band engraving</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Private one-on-one virtual or Jaipur atelier consultations</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Made to order in small batches within 12–15 business days</span>
              </li>
              <li>
                <Icon name="check" size={18} />
                <span>Guaranteed lifetime gold exchange at prevailing market rates</span>
              </li>
            </ul>

            <div className="btn-row">
              <Link to="/shop?collection=Bridal" className="btn btn-gold">
                Explore Bridal Collection
              </Link>
              <Link to="/contact" className="btn btn-ghost-light">
                Book Consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===================== CRAFTSMANSHIP JOURNEY ===================== */}
      <section className="section craft-section">
        <div className="wrap">
          <Reveal className="sec-head center" effect="fade-up">
            <p className="eyebrow">Jaipur Atelier Heritage</p>
            <h2>Forty Hands, One Keepsake</h2>
            <p className="sec-subtext">
              Every Caresa piece passes through four distinct artisan guilds in our Johari Bazaar workshop before it arrives in your hands.
            </p>
          </Reveal>

          <div className="craft-grid">
            <div className="craft-steps-column">
              {CRAFT_STAGES.map((s, idx) => (
                <div
                  key={s.step}
                  className={`craft-step-card ${idx === activeCraft ? 'active' : ''}`}
                  onClick={() => setActiveCraft(idx)}
                >
                  <div className="step-num">{s.step}</div>
                  <div className="step-content">
                    <div className="row-between">
                      <h3>{s.title}</h3>
                      <span className="step-tag">{s.tag}</span>
                    </div>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}

              <div className="craft-stats-row">
                <div className="craft-stat">
                  <b>18K & 14K</b>
                  <span>Solid Precious Gold</span>
                </div>
                <div className="craft-stat">
                  <b>40+</b>
                  <span>Master Artisans</span>
                </div>
                <div className="craft-stat">
                  <b>100%</b>
                  <span>Recycled Precious Metals</span>
                </div>
              </div>
            </div>

            <div className="craft-visuals-column">
              <Reveal delay={100} effect="fade-right">
                <div className="craft-card-main">
                  <Img id={IMAGES.craft} w={900} alt="Artisan stone setting in workshop" className="craft-visual-img" />
                  <div className="craft-overlay-tag">
                    <Icon name="award" size={16} />
                    <span>Johari Bazaar Atelier · Jaipur, Rajasthan</span>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200} effect="fade-up">
                <div className="craft-secondary-box">
                  <Img id={IMAGES.studio} w={600} alt="Finished ring in studio" />
                  <div className="craft-quote">
                    <p className="script">art of touch</p>
                    <p className="small">“No machine can replicate the gentle warmth of human hands on polished gold.”</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== GIFTING SIGNATURE BANNER ===================== */}
      <section className="gift-banner" aria-label="Gifting Service">
        <Img id={IMAGES.gifting} w={1920} alt="" className="gift-bg" />
        <div className="gift-shade" />

        <Reveal className="wrap gift-copy" effect="fade-up">
          <p className="script light">the art of gifting</p>
          <h2>
            Every Caresa piece arrives<br />
            in our signature keepsake box.
          </h2>
          <p>
            Wrapped in ivory satin ribbon with an embossed certificate of authenticity, custom handwritten calligraphy note, and a concealed-price invoice upon request.
          </p>
          <div className="btn-row">
            <Link to="/gifting" className="btn btn-light">
              Explore Gift Guide
            </Link>
            <Link to="/shop" className="btn btn-ghost-light">
              Shop Under ₹10,000
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ===================== TESTIMONIALS (VERIFIED REVIEWS) ===================== */}
      <section className="section section-charcoal sec-testimonials" aria-label="Collector Testimonials">
        <div className="wrap">
          <Reveal className="sec-head center" effect="fade-up">
            <p className="eyebrow light">Collector Stories</p>
            <h2>From the people who wear us</h2>
            <p className="muted-light">
              Over 25,000 pieces delivered across 400+ cities in India and worldwide.
            </p>
          </Reveal>

          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 90} effect="fade-up" className="testi-card">
                <div className="testi-stars">
                  <Stars value={t.rating} size="sm" />
                </div>
                <p className="testi-quote">“{t.text}”</p>
                <div className="testi-author">
                  <b>{t.name}</b>
                  <small>{t.city} · Verified Collector</small>
                  {t.piece && <span className="testi-piece">Purchased {t.piece}</span>}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RECENTLY VIEWED (IF APPLICABLE) ===================== */}
      {recentProducts.length > 0 && (
        <section className="section section-tight sec-recently-viewed">
          <div className="wrap">
            <Reveal className="sec-head row-between wrap-gap" effect="fade-up">
              <div>
                <p className="eyebrow">Your Journey</p>
                <h2>Recently Viewed Pieces</h2>
              </div>
              <Link to="/shop" className="link-arrow">
                Explore More <Icon name="arrow" size={14} />
              </Link>
            </Reveal>

            <div className="pgrid">
              {recentProducts.map((p, i) => (
                <Reveal key={p.id} delay={i * 70} effect="fade-up">
                  <ProductCard p={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== INSTAGRAM COMMUNITY GRID ===================== */}
      <section className="section insta-section" aria-label="Social Community Showcase">
        <div className="wrap">
          <Reveal className="sec-head center" effect="fade-up">
            <p className="eyebrow">@caresa.jewels</p>
            <h2>Worn & Cherished by You</h2>
            <p className="sec-subtext">
              Tag #CaresaFineJewellery on Instagram for a chance to be featured in our seasonal journal.
            </p>
          </Reveal>
        </div>

        <div className="insta-row">
          {PRODUCTS.slice(2, 8).map((p, i) => (
            <div key={p.id} className="insta-tile">
              <Img id={p.images[0]} w={560} alt={p.name} className="insta-img" />
              <div className="insta-hover-overlay">
                <p className="insta-prod-name">{p.name}</p>
                <small className="insta-prod-price">{formatINR(p.price)}</small>
                <button
                  className="insta-quick-btn"
                  onClick={() => openQuickView(p.id)}
                  aria-label={`Quick view ${p.name}`}
                >
                  Quick View
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
