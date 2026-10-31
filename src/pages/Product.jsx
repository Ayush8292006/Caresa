import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Icon, Stars, Reveal, Breadcrumb } from '../components/Common'
import { Qty } from '../components/Layout'
import ProductCard from '../components/ProductCard'
import { getProduct, PRODUCTS, formatINR } from '../data/products'
import { NotFound } from './Static'

export default function Product() {
  const { id } = useParams()
  const p = getProduct(id)
  const navigate = useNavigate()
  const { addToCart, toggleWish, wishlist, notify } = useStore()
  const [active, setActive] = useState(0)
  const [size, setSize] = useState(null)
  const [qty, setQty] = useState(1)
  const [open, setOpen] = useState('details')
  const [pin, setPin] = useState('')
  const [pinMsg, setPinMsg] = useState(null)
  const [engrave, setEngrave] = useState('')
  const [zoom, setZoom] = useState(null)

  if (!p) return <NotFound />
  const off = Math.round((1 - p.price / p.mrp) * 100)
  const needsSize = !!p.sizes
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).concat(PRODUCTS.filter((x) => x.category !== p.category)).slice(0, 4)

  const add = (buy) => {
    if (needsSize && !size) { notify('Please select a size'); return }
    addToCart(p.id, qty, size)
    if (buy) navigate('/checkout')
  }
  const checkPin = () => {
    if (!/^\d{6}$/.test(pin)) { setPinMsg({ ok: false, t: 'Enter a valid 6-digit pincode' }); return }
    const d = new Date(); d.setDate(d.getDate() + (pin.startsWith('1') || pin.startsWith('4') ? 3 : 5))
    setPinMsg({ ok: true, t: `Delivery by ${d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · COD available` })
  }
  const gallery = [...p.images, p.images[0]]

  return (
    <div className="pdp">
      <div className="wrap">
        <Breadcrumb items={[<Link to="/" key="h">Home</Link>, <Link to={`/shop?cat=${p.category}`} key="c" className="cap">{p.category}</Link>, p.name]} />
        <div className="pdp-grid">
          <div className="pdp-gallery">
            <div className="thumbs">
              {gallery.map((g, i) => (
                <button key={i} className={i === active ? 'on' : ''} onClick={() => setActive(i)} aria-label={`View image ${i + 1}`}>
                  <Img id={g} w={160} alt="" className={i === 2 ? 'flip' : ''} />
                </button>
              ))}
            </div>
            <div className="main-img"
              onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }) }}
              onMouseLeave={() => setZoom(null)}>
              <Img id={gallery[active]} w={1400} alt={p.name} className={active === 2 ? 'flip' : ''}
                style={zoom ? { transform: `scale(1.8)${active === 2 ? ' scaleX(-1)' : ''}`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined} />
              {p.badge && <span className="badge">{p.badge}</span>}
            </div>
          </div>

          <div className="pdp-info">
            <p className="eyebrow">{p.collection} Collection</p>
            <h1>{p.name}</h1>
            <div className="pdp-rating"><Stars value={p.rating} /><span>{p.rating} · {p.reviews} reviews</span></div>
            <div className="pdp-price">
              <span>{formatINR(p.price)}</span><s>{formatINR(p.mrp)}</s><em>Save {off}%</em>
            </div>
            <small className="muted">MRP inclusive of all taxes · or 3 interest-free payments of {formatINR(Math.round(p.price / 3))}</small>

            <div className="opt">
              <p className="opt-label">Metal <b>{p.metal}</b></p>
              <div className="swatches">
                {[['18K Yellow Gold', '#d4ad6a'], ['14K Rose Gold', '#d9a28d'], ['925 Sterling Silver', '#c9c9c4']].map(([m, c]) => (
                  <span key={m} className={`sw ${m === p.metal ? 'on' : ''}`} style={{ background: c }} title={m} />
                ))}
              </div>
            </div>

            {needsSize && (
              <div className="opt">
                <p className="opt-label">{p.category === 'rings' ? 'Ring size' : 'Bangle size'} {size && <b>{size}</b>} <a href="#size" className="link-sm" onClick={(e) => { e.preventDefault(); setOpen('size') }}>Size guide</a></p>
                <div className="sizes">
                  {p.sizes.map((s) => <button key={s} className={size === s ? 'on' : ''} onClick={() => setSize(s)}>{s}</button>)}
                </div>
              </div>
            )}

            {(p.category === 'rings' || p.category === 'pendants') && (
              <div className="opt">
                <p className="opt-label">Engraving <span className="muted">(free, optional)</span></p>
                <input id="engrave-input" className="input" maxLength={12} value={engrave} onChange={(e) => setEngrave(e.target.value)} placeholder="Up to 12 characters" />
              </div>
            )}

            <div className="pdp-actions">
              <Qty value={qty} onChange={(v) => setQty(Math.max(1, v))} />
              <button className="btn btn-dark grow" onClick={() => add(false)}>Add to Bag</button>
              <button className={`icon-btn boxed ${wishlist.includes(p.id) ? 'wished' : ''}`} onClick={() => toggleWish(p.id)} aria-label="Wishlist"><Icon name="heart" /></button>
            </div>
            <button className="btn btn-gold btn-block" onClick={() => add(true)}>Buy it now</button>
            {p.stock <= 4 && <p className="low-stock">Only {p.stock} left — made in small batches</p>}

            <div className="pin-check">
              <p className="opt-label"><Icon name="pin" size={16} /> Check delivery</p>
              <div className="pin-row">
                <input id="pincode-input" className="input" inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Enter pincode" />
                <button className="btn btn-line" onClick={checkPin}>Check</button>
              </div>
              {pinMsg && <small className={pinMsg.ok ? 'ok' : 'err'}>{pinMsg.t}</small>}
            </div>

            <div className="pdp-perks">
              <span><Icon name="shield" size={18} /> BIS Hallmarked</span>
              <span><Icon name="refresh" size={18} /> 30-day returns</span>
              <span><Icon name="gift" size={18} /> Gift-ready box</span>
            </div>

            <div className="accordion">
              {[
                ['details', 'Product details', (
                  <dl className="specs">
                    <dt>SKU</dt><dd>{p.sku}</dd><dt>Metal</dt><dd>{p.metal}</dd><dt>Gross weight</dt><dd>{p.weight}</dd>
                    <dt>Stones</dt><dd>{p.metal.includes('Silver') ? 'Cubic zirconia' : 'Natural diamonds, VS-GH'}</dd><dt>Certification</dt><dd>BIS 916 / IGI</dd>
                  </dl>
                )],
                ['desc', 'Description', <p>{p.description}</p>],
                ['size', 'Size guide', <p>Measure the inside diameter of a ring that fits you well. 16.5 mm = size 7, 17.3 mm = size 8, 18.1 mm = size 9. Free resizing within 30 days.</p>],
                ['ship', 'Shipping & returns', <p>Free insured shipping above ₹999. Dispatch within 48 hours (made-to-order bridal: 12–15 days). Easy 30-day returns, lifetime exchange on gold at current rate.</p>],
                ['care', 'Care', <p>Store in the pouch provided, away from perfume and water. Wipe gently with a soft cloth. Book a free polish with us once a year.</p>],
              ].map(([k, t, body]) => (
                <div key={k} className={`acc ${open === k ? 'open' : ''}`}>
                  <button onClick={() => setOpen(open === k ? null : k)}><span>{t}</span><Icon name={open === k ? 'minus' : 'plus'} size={16} /></button>
                  <div className="acc-body"><div>{body}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="reviews">
          <Reveal className="sec-head row-between wrap-gap">
            <div><p className="eyebrow">Reviews</p><h2>{p.rating} <small className="muted">/ 5 from {p.reviews} customers</small></h2></div>
            <button className="btn btn-line" onClick={() => notify('Review form — connect to backend')}>Write a review</button>
          </Reveal>
          <div className="review-list">
            {[['Ananya R.', 'Exactly as pictured. The finish is beautiful and it feels substantial.'], ['Pooja S.', 'Arrived in two days with a lovely box. Bought it as a gift and my sister adored it.'], ['Neha K.', 'Sizing guide was spot on. Wearing it daily, still shines like new.']].map(([n, t]) => (
              <div className="review" key={n}><Stars value={5} /><p>{t}</p><small>{n} · Verified buyer</small></div>
            ))}
          </div>
        </section>

        <section className="section-tight">
          <Reveal className="sec-head"><p className="eyebrow">Pairs well with</p><h2>You may also love</h2></Reveal>
          <div className="pgrid">{related.map((r, i) => <Reveal key={r.id} delay={i * 80}><ProductCard p={r} /></Reveal>)}</div>
        </section>
      </div>

      <div className="sticky-buy only-mobile">
        <div><b>{formatINR(p.price)}</b><small>{p.name}</small></div>
        <button className="btn btn-dark" onClick={() => add(false)}>Add to Bag</button>
      </div>
    </div>
  )
}
