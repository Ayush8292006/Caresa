import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Img, Reveal, Icon, Stars } from '../components/Common'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, IMAGES, TESTIMONIALS } from '../data/products'

const SLIDES = [
  { img: IMAGES.heroRing, kicker: 'The Bridal Edit · 2026', title: <>Made for the<br /><em>promise</em> you keep.</>, cta: 'Shop Bridal', to: '/shop?collection=Bridal' },
  { img: IMAGES.heroNecklace, kicker: 'New · Meher Collection', title: <>Layers of gold,<br /><em>softly</em> worn.</>, cta: 'Discover Necklaces', to: '/shop?cat=necklaces' },
  { img: IMAGES.heroModel, kicker: 'Everyday Fine', title: <>Little luxuries<br />for <em>every day</em>.</>, cta: 'Shop Bestsellers', to: '/shop?sort=popular' },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 6500)
    return () => clearInterval(t)
  }, [])
  const best = PRODUCTS.filter((p) => p.badge === 'Bestseller' || p.rating >= 4.9).slice(0, 4)
  const fresh = PRODUCTS.filter((p) => p.badge === 'New' || p.badge === 'Limited').slice(0, 4)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        {SLIDES.map((s, i) => (
          <div key={i} className={`hero-slide ${i === slide ? 'active' : ''}`}>
            <Img id={s.img} w={1800} alt="" className="hero-img" />
          </div>
        ))}
        <div className="hero-shade" />
        <div className="wrap hero-content" key={slide}>
          <p className="eyebrow light hero-anim" style={{ animationDelay: '.1s' }}>{SLIDES[slide].kicker}</p>
          <h1 className="hero-title hero-anim" style={{ animationDelay: '.25s' }}>{SLIDES[slide].title}</h1>
          <div className="hero-actions hero-anim" style={{ animationDelay: '.45s' }}>
            <Link to={SLIDES[slide].to} className="btn btn-light">{SLIDES[slide].cta}</Link>
            <Link to="/shop" className="btn btn-ghost-light">View All</Link>
          </div>
        </div>
        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button key={i} className={i === slide ? 'on' : ''} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}>
              <span>{String(i + 1).padStart(2, '0')}</span>
            </button>
          ))}
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="trust">
        <div className="wrap trust-grid">
          {[
            ['shield', 'BIS Hallmarked', 'Certified purity on every gold piece'],
            ['gem', 'IGI Certified Stones', 'Natural & lab diamonds, graded'],
            ['truck', 'Insured Shipping', 'Free across India above ₹999'],
            ['refresh', '30-Day Returns', 'Lifetime exchange on gold'],
          ].map(([ic, t, d], i) => (
            <Reveal key={t} delay={i * 80} className="trust-item">
              <Icon name={ic} size={26} stroke={1.2} />
              <div><b>{t}</b><span>{d}</span></div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="wrap">
          <Reveal className="sec-head">
            <p className="eyebrow">Shop by Category</p>
            <h2>Find your <em>forever</em> piece</h2>
          </Reveal>
          <div className="cat-grid">
            {CATEGORIES.map((c, i) => (
              <Reveal key={c.slug} delay={i * 70}>
                <Link to={`/shop?cat=${c.slug}`} className="cat-tile">
                  <div className="cat-img"><Img id={c.image} w={600} alt={c.name} /></div>
                  <span>{c.name}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="section section-beige">
        <div className="wrap">
          <Reveal className="sec-head row-between wrap-gap">
            <div>
              <p className="eyebrow">Most Loved</p>
              <h2>Bestsellers</h2>
            </div>
            <Link to="/shop?sort=popular" className="link-arrow">View all <Icon name="arrow" size={16} /></Link>
          </Reveal>
          <div className="pgrid">
            {best.map((p, i) => <Reveal key={p.id} delay={i * 90}><ProductCard p={p} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="editorial">
        <Reveal className="ed-media">
          <Img id={IMAGES.bridal} w={1200} alt="Bridal gold jewellery" className="parallax" />
        </Reveal>
        <div className="ed-copy">
          <Reveal>
            <p className="script">the bridal edit</p>
            <h2>Heirlooms,<br />designed for today.</h2>
            <p>From engagement solitaires to statement collars, our bridal pieces are cast in 18K gold and set by hand — made to be passed on.</p>
            <ul className="ed-points">
              <li><Icon name="check" size={16} /> Complimentary engraving</li>
              <li><Icon name="check" size={16} /> Private video consultation</li>
              <li><Icon name="check" size={16} /> Made to order in 12–15 days</li>
            </ul>
            <Link to="/shop?collection=Bridal" className="btn btn-gold">Explore Bridal</Link>
          </Reveal>
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="section">
        <div className="wrap">
          <Reveal className="sec-head row-between wrap-gap">
            <div>
              <p className="eyebrow">Just In</p>
              <h2>New <em>arrivals</em></h2>
            </div>
            <Link to="/shop?sort=new" className="link-arrow">Shop new <Icon name="arrow" size={16} /></Link>
          </Reveal>
          <div className="pgrid">
            {fresh.map((p, i) => <Reveal key={p.id} delay={i * 90}><ProductCard p={p} /></Reveal>)}
          </div>
        </div>
      </section>

      {/* GIFTING BANNER */}
      <section className="gift-banner">
        <Img id={IMAGES.gifting} w={1800} alt="" className="gift-bg" />
        <div className="gift-shade" />
        <Reveal className="wrap gift-copy">
          <p className="script light">gift it beautifully</p>
          <h2>Every Caresa piece arrives<br />in our signature keepsake box.</h2>
          <p>Add a handwritten note, gift wrap and a hidden-price invoice at checkout.</p>
          <Link to="/gifting" className="btn btn-light">Shop Gifts</Link>
        </Reveal>
      </section>

      {/* CRAFT */}
      <section className="section craft">
        <div className="wrap craft-grid">
          <Reveal className="craft-copy">
            <p className="eyebrow">Our Craft</p>
            <h2>Forty hands, one piece.</h2>
            <p>Each design passes through wax carving, casting, setting and a final hand polish in our Jaipur atelier. We use recycled gold and conflict-free stones, and we tell you exactly what goes into every piece.</p>
            <div className="stats">
              <div><b>18K</b><span>& 14K solid gold</span></div>
              <div><b>40+</b><span>artisans</span></div>
              <div><b>25k</b><span>happy customers</span></div>
            </div>
            <Link to="/about" className="link-arrow">Read our story <Icon name="arrow" size={16} /></Link>
          </Reveal>
          <div className="craft-imgs">
            <Reveal delay={100}><Img id={IMAGES.craft} w={700} alt="Hand-finished earrings" /></Reveal>
            <Reveal delay={250}><Img id={IMAGES.studio} w={700} alt="Ring in the studio" /></Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-charcoal">
        <div className="wrap">
          <Reveal className="sec-head center">
            <p className="eyebrow light">Kind Words</p>
            <h2>From the people who wear us</h2>
          </Reveal>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 100} className="testi">
                <Stars value={5} />
                <p>“{t.text}”</p>
                <span>{t.name} · {t.city}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="section insta">
        <div className="wrap">
          <Reveal className="sec-head center">
            <p className="eyebrow">@caresa.jewels</p>
            <h2>Worn by you</h2>
          </Reveal>
        </div>
        <div className="insta-row">
          {PRODUCTS.slice(4, 10).map((p, i) => (
            <Reveal key={p.id} delay={i * 60} className="insta-tile">
              <Link to={`/product/${p.id}`}><Img id={p.images[0]} w={500} alt={p.name} /></Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
