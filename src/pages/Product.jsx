import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Icon, Stars, Reveal, Breadcrumb, SizeGuideModal, ImageLightbox } from '../components/Common'
import { Qty } from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { getProduct, PRODUCTS, formatINR } from '../data/products'
import { NotFound } from './Static'

export default function Product() {
  const { id } = useParams()
  const p = getProduct(id)
  const navigate = useNavigate()
  const { addToCart, toggleWish, wishlist, notify, addRecentlyViewed, customReviews, addReview } = useStore()

  const [active, setActive] = useState(0)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [openAccordion, setOpenAccordion] = useState('details')
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState(null)
  const [engrave, setEngrave] = useState('')
  const [zoom, setZoom] = useState(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Review Form Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({ name: '', city: '', rating: 5, text: '' })

  // Track product in recently viewed
  useEffect(() => {
    if (p?.id) {
      addRecentlyViewed(p.id)
      setActive(0)
      setQty(1)
      if (p.sizes) setSize(p.sizes[1] || p.sizes[0])
      else setSize(null)
    }
  }, [p?.id, addRecentlyViewed])

  if (!p) return <NotFound />

  const off = Math.round((1 - p.price / p.mrp) * 100)
  const isWished = wishlist.includes(p.id)
  const needsSize = !!p.sizes
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id)
    .concat(PRODUCTS.filter((x) => x.category !== p.category))
    .slice(0, 4)

  const handleAdd = (buyNow = false) => {
    if (needsSize && !size) {
      notify('Please select your size first', 'info')
      return
    }
    addToCart(p.id, qty, size)
    if (buyNow) navigate('/checkout')
  }

  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) {
      setPinMsg({ ok: false, t: 'Please enter a valid 6-digit Indian pincode' })
      return
    }
    const d = new Date()
    d.setDate(d.getDate() + (pin.startsWith('1') || pin.startsWith('4') || pin.startsWith('3') ? 3 : 5))
    setPinMsg({
      ok: true,
      t: `Estimated delivery by ${d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      })} · Insured BlueDart Express · COD Available`,
    })
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) {
      notify('Please enter your name and thoughts', 'info')
      return
    }
    addReview(p.id, reviewForm)
    setReviewModalOpen(false)
    setReviewForm({ name: '', city: '', rating: 5, text: '' })
  }

  // Combined standard reviews + user custom reviews
  const defaultReviews = [
    {
      id: 'rev_1',
      name: 'Ananya R.',
      city: 'Mumbai',
      rating: 5,
      date: '24 Oct 2026',
      text: 'Exceeded all my expectations. The weight of the gold feels so substantial and the hand polish catches the light subtly.',
    },
    {
      id: 'rev_2',
      name: 'Pooja S.',
      city: 'Bengaluru',
      rating: 5,
      date: '18 Oct 2026',
      text: 'Arrived in two days with a stunning keepsake box. Bought it for my anniversary and my husband was so impressed with the hallmarking certificate.',
    },
    {
      id: 'rev_3',
      name: 'Neha K.',
      city: 'New Delhi',
      rating: 4.8,
      date: '10 Oct 2026',
      text: 'Sizing guide was completely spot-on. I wear it daily, shower with it, and it still shines like the day it was unboxed.',
    },
  ]
  const productReviews = [...(customReviews[p.id] || []), ...defaultReviews]

  const gallery = p.images.length > 1 ? [...p.images, p.images[0]] : [p.images[0], p.images[0]]

  return (
    <div className="pdp">
      <div className="wrap">
        <Breadcrumb
          items={[
            <Link to="/" key="h">Home</Link>,
            <Link to="/shop" key="s">Shop</Link>,
            <Link to={`/shop?cat=${p.category}`} key="c" className="cap">
              {p.category}
            </Link>,
            p.name,
          ]}
        />

        <div className="pdp-grid">
          {/* Gallery Column */}
          <div className="pdp-gallery">
            <div className="thumbs">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  className={`thumb-btn ${i === active ? 'on' : ''}`}
                  onClick={() => setActive(i)}
                  aria-label={`View photo ${i + 1}`}
                >
                  <Img id={g} w={180} alt="" className={i === 2 ? 'flip' : ''} />
                </button>
              ))}
            </div>

            <div
              className="main-img"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                setZoom({
                  x: ((e.clientX - r.left) / r.width) * 100,
                  y: ((e.clientY - r.top) / r.height) * 100,
                })
              }}
              onMouseLeave={() => setZoom(null)}
              onClick={() => setLightboxOpen(true)}
              title="Click to view fullscreen high-resolution photo"
            >
              <Img
                id={gallery[active]}
                w={1600}
                alt={p.name}
                className={active === 2 ? 'flip' : ''}
                style={
                  zoom
                    ? {
                        transform: `scale(1.9)${active === 2 ? ' scaleX(-1)' : ''}`,
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      }
                    : undefined
                }
              />
              {p.badge && <span className="badge">{p.badge}</span>}

              <button
                className="main-img-zoom-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  setLightboxOpen(true)
                }}
                aria-label="Enlarge image"
                title="Fullscreen view"
              >
                <Icon name="zoom" size={18} />
              </button>

              <span className="zoom-hint">Roll over to zoom · Click to enlarge</span>
            </div>
          </div>

          {/* Details & Purchase Column */}
          <div className="pdp-info">
            <div className="pdp-top-tags">
              <span className="eyebrow">{p.collection} Collection</span>
              <span className="pdp-hallmark-badge">
                <Icon name="shield" size={13} /> {p.certification}
              </span>
            </div>

            <h1 className="pdp-title">{p.name}</h1>

            <div className="pdp-rating">
              <Stars value={p.rating} size="sm" />
              <span>
                {p.rating} · <b>{p.reviews} collector reviews</b>
              </span>
            </div>

            <div className="pdp-price">
              <span className="pdp-price-current">{formatINR(p.price)}</span>
              <s className="pdp-price-mrp">{formatINR(p.mrp)}</s>
              <span className="pdp-price-off">Save {off}%</span>
            </div>

            <p className="pdp-taxes-note">
              Inclusive of all taxes · Complimentary insured pan-India delivery
            </p>

            {/* Metal Swatches */}
            <div className="opt">
              <div className="row-between">
                <span className="opt-label">
                  Metal Choice: <b>{p.metal}</b>
                </span>
                <span className="small muted">{p.purity}</span>
              </div>
              <div className="swatches">
                {[
                  ['18K Yellow Gold', '#d4ad6a'],
                  ['14K Rose Gold', '#d9a28d'],
                  ['925 Sterling Silver', '#c9c9c4'],
                ].map(([m, c]) => (
                  <button
                    key={m}
                    className={`sw ${m === p.metal ? 'on' : ''}`}
                    style={{ background: c }}
                    title={m}
                    aria-label={`Select ${m}`}
                    onClick={() => {
                      if (m !== p.metal) {
                        notify(`Showing ${p.name} in ${m}`, 'info')
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            {needsSize && (
              <div className="opt">
                <div className="row-between">
                  <span className="opt-label">
                    {p.category === 'rings' ? 'Select Ring Size' : 'Select Bangle Size'}:{' '}
                    {size && <b>Size {size}</b>}
                  </span>
                  <button
                    type="button"
                    className="link-sm size-guide-btn"
                    onClick={() => setSizeGuideOpen(true)}
                  >
                    <Icon name="ruler" size={14} /> Size Guide
                  </button>
                </div>
                <div className="sizes">
                  {p.sizes.map((s) => (
                    <button
                      key={s}
                      className={size === s ? 'on' : ''}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Free Custom Engraving */}
            {(p.category === 'rings' || p.category === 'pendants') && (
              <div className="opt engrave-opt">
                <div className="row-between">
                  <span className="opt-label">
                    Complimentary Engraving <span className="muted">(Optional)</span>
                  </span>
                  <span className="small muted">{12 - engrave.length} chars remaining</span>
                </div>
                <input
                  id="engrave-input"
                  className="input engrave-input"
                  maxLength={12}
                  value={engrave}
                  onChange={(e) => setEngrave(e.target.value)}
                  placeholder="e.g. A & K · 2026"
                />
                {engrave && (
                  <div className="engrave-live-preview">
                    <small>Live Engraving Preview on Inner Band:</small>
                    <div className="engrave-plate">
                      <span>{engrave}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions: Quantity + Add to Bag + Wishlist */}
            <div className="pdp-actions">
              <Qty value={qty} onChange={(v) => setQty(Math.max(1, v))} />
              <button className="btn btn-dark grow" onClick={() => handleAdd(false)}>
                Add to Bag · {formatINR(p.price * qty)}
              </button>
              <button
                className={`icon-btn boxed ${isWished ? 'wished' : ''}`}
                onClick={() => toggleWish(p.id)}
                aria-label={isWished ? 'Remove from saved' : 'Save to wishlist'}
                title={isWished ? 'Saved' : 'Save'}
              >
                <Icon name="heart" size={20} />
              </button>
            </div>

            <button className="btn btn-gold btn-block" onClick={() => handleAdd(true)}>
              Buy It Now (Fast Checkout)
            </button>

            {p.stock <= 4 && (
              <p className="low-stock">
                <Icon name="sparkle" size={14} /> Only {p.stock} pieces remaining in this batch — cast by hand
              </p>
            )}

            {/* Pincode Delivery Check */}
            <div className="pin-check">
              <span className="opt-label">
                <Icon name="pin" size={15} /> Check Delivery & COD Availability
              </span>
              <div className="pin-row">
                <input
                  id="pincode-input"
                  className="input"
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                />
                <button className="btn btn-line" onClick={checkPin}>
                  Check
                </button>
              </div>
              {pinMsg && <small className={pinMsg.ok ? 'ok' : 'err'}>{pinMsg.t}</small>}
            </div>

            {/* Trust Badges */}
            <div className="pdp-perks">
              <span>
                <Icon name="shield" size={18} /> BIS 916 Hallmarked
              </span>
              <span>
                <Icon name="gem" size={18} /> Conflict-Free Stones
              </span>
              <span>
                <Icon name="refresh" size={18} /> 30-Day Easy Returns
              </span>
              <span>
                <Icon name="gift" size={18} /> Keepsake Gift Box
              </span>
            </div>

            {/* Accordions */}
            <div className="accordion">
              {[
                [
                  'details',
                  'Product Details & Specifications',
                  <dl className="specs">
                    <dt>SKU</dt>
                    <dd>{p.sku}</dd>
                    <dt>Precious Metal</dt>
                    <dd>{p.metal} ({p.purity})</dd>
                    <dt>Gross Weight</dt>
                    <dd>{p.weight}</dd>
                    <dt>Stones & Quality</dt>
                    <dd>{p.stones}</dd>
                    <dt>Dimensions</dt>
                    <dd>{p.dimensions}</dd>
                    <dt>Certification</dt>
                    <dd>{p.certification}</dd>
                    <dt>Atelier Origin</dt>
                    <dd>{p.origin}</dd>
                  </dl>,
                ],
                [
                  'desc',
                  'Atelier Story & Description',
                  <p>{p.description}</p>,
                ],
                [
                  'ship',
                  'Insured Shipping & Lifetime Exchange',
                  <p>
                    All Caresa jewellery ships fully insured via BlueDart Express in tamper-proof, discreet packaging. Standard dispatch within 48 hours. Enjoy a full 30-day return window and lifetime exchange on gold at prevailing market bullion rates.
                  </p>,
                ],
                [
                  'care',
                  'Jewellery Care & Free Annual Polish',
                  <p>
                    Store in the provided microfiber pouch away from direct perfume, pool chlorine, and moisture. Clean gently with warm soapy water and a soft cloth. Bring your piece to our atelier for complimentary annual ultrasonic cleaning and hand-buffing.
                  </p>,
                ],
              ].map(([k, title, body]) => (
                <div key={k} className={`acc ${openAccordion === k ? 'open' : ''}`}>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === k ? null : k)}
                    aria-expanded={openAccordion === k}
                  >
                    <span>{title}</span>
                    <Icon name={openAccordion === k ? 'minus' : 'plus'} size={16} />
                  </button>
                  <div className="acc-body">
                    <div>{body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section className="reviews-section">
          <Reveal className="sec-head row-between wrap-gap" effect="fade-up">
            <div>
              <p className="eyebrow">Collector Testimonials</p>
              <h2>
                {p.rating} / 5.0{' '}
                <small className="muted font-normal">
                  (based on {productReviews.length} verified reviews)
                </small>
              </h2>
            </div>
            <button className="btn btn-line" onClick={() => setReviewModalOpen(true)}>
              Write a Review
            </button>
          </Reveal>

          <div className="review-list">
            {productReviews.map((rev) => (
              <div className="review-card" key={rev.id}>
                <div className="review-head">
                  <Stars value={rev.rating} size="xs" />
                  <span className="review-date">{rev.date}</span>
                </div>
                <p className="review-body">“{rev.text}”</p>
                <div className="review-author">
                  <b>{rev.name}</b>
                  <small>{rev.city} · Verified Purchase</small>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Products / Curated Pairings */}
        <section className="section-tight related-section">
          <Reveal className="sec-head" effect="fade-up">
            <p className="eyebrow">Curated Pairings</p>
            <h2>You may also love</h2>
          </Reveal>
          <div className="pgrid">
            {related.map((r, i) => (
              <Reveal key={r.id} delay={i * 80} effect="fade-up">
                <ProductCard p={r} />
              </Reveal>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky Mobile Buy Bar */}
      <div className="sticky-buy only-mobile" aria-label="Quick purchase bar">
        <div className="sticky-buy-info">
          <b>{formatINR(p.price)}</b>
          <small>{p.name}</small>
        </div>
        <button className="btn btn-dark" onClick={() => handleAdd(false)}>
          Add to Bag
        </button>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={p.category}
      />

      {/* Lightbox Modal */}
      <ImageLightbox
        open={lightboxOpen}
        initialIndex={active}
        images={gallery}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Write a Review Modal */}
      {reviewModalOpen && (
        <div className="modal-bg" onClick={() => setReviewModalOpen(false)} role="dialog" aria-modal="true">
          <div className="modal review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="side-head">
              <h3>Review {p.name}</h3>
              <button className="icon-btn" onClick={() => setReviewModalOpen(false)}>
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="review-form">
              <label className="field">
                <span>Your Rating</span>
                <div className="review-star-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className={`star-pick ${star <= reviewForm.rating ? 'active' : ''}`}
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    >
                      ★
                    </button>
                  ))}
                  <span className="small muted">({reviewForm.rating} of 5 stars)</span>
                </div>
              </label>

              <div className="form-grid">
                <label className="field half">
                  <span>Your Name</span>
                  <input
                    className="input"
                    required
                    placeholder="e.g. Radhika M."
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                </label>
                <label className="field half">
                  <span>Your City</span>
                  <input
                    className="input"
                    placeholder="e.g. Jaipur"
                    value={reviewForm.city}
                    onChange={(e) => setReviewForm({ ...reviewForm, city: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Your Review</span>
                  <textarea
                    className="input"
                    rows={4}
                    required
                    placeholder="Describe the craftsmanship, fit, feel and finish of the jewellery..."
                    value={reviewForm.text}
                    onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                  />
                </label>
              </div>

              <div className="btn-row end">
                <button
                  type="button"
                  className="btn btn-line"
                  onClick={() => setReviewModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-dark">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
