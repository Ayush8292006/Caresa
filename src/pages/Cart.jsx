import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Bow, Breadcrumb, Icon } from '../components/Common'
import { Qty } from '../components/Layout'
import { formatINR, PRODUCTS } from '../data/products'

export function Summary({ children }) {
  const { subtotal, discount, shipping, total, coupon, applyCoupon, setCoupon } = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')

  const handleApply = (e) => {
    e?.preventDefault()
    if (!code.trim()) return
    const ok = applyCoupon(code)
    if (!ok) setErr('Code is invalid. Try FIRSTLOVE (15%) or CARESA10 (10%).')
    else {
      setErr('')
      setCode('')
    }
  }

  return (
    <aside className="summary" aria-label="Order summary">
      <h3>Order Summary</h3>

      <div className="coupon">
        {coupon ? (
          <div className="coupon-on">
            <span>
              <b>{coupon}</b> applied (−{formatINR(discount)})
            </span>
            <button className="link-btn" onClick={() => setCoupon(null)}>
              Remove
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply}>
            <div className="pin-row">
              <input
                id="coupon-input"
                className="input"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setErr('')
                }}
                placeholder="Coupon code (e.g. FIRSTLOVE)"
              />
              <button type="submit" className="btn btn-line">
                Apply
              </button>
            </div>
            {err && <small className="err">{err}</small>}
          </form>
        )}
      </div>

      <div className="sum-rows">
        <div className="row-between">
          <span>Subtotal</span>
          <span>{formatINR(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="row-between ok">
            <span>Promotional Discount</span>
            <span>−{formatINR(discount)}</span>
          </div>
        )}
        <div className="row-between">
          <span>Insured Express Shipping</span>
          <span>{shipping ? formatINR(shipping) : 'FREE'}</span>
        </div>
        <div className="row-between total">
          <span>Total Payable</span>
          <span>{formatINR(total)}</span>
        </div>
        <small className="muted small">All Indian GST & taxes included</small>
      </div>

      {children}

      <div className="summary-trust-strip">
        <span><Icon name="shield" size={15} /> 100% BIS Hallmarked</span>
        <span><Icon name="refresh" size={15} /> 30-Day Easy Returns</span>
        <span><Icon name="truck" size={15} /> Insured Transit</span>
      </div>
    </aside>
  )
}

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, toggleWish, subtotal } = useStore()
  const navigate = useNavigate()
  const [giftWrap, setGiftWrap] = useState(false)
  const [giftNote, setGiftNote] = useState('')

  const freeLeft = Math.max(0, 999 - subtotal)
  const recommendations = PRODUCTS.slice(0, 3)

  return (
    <div className="wrap page-pad">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Shopping Bag']} />
      <h1 className="page-title">
        Your Shopping Bag <span className="muted font-normal">({cartItems.length})</span>
      </h1>

      {cartItems.length === 0 ? (
        <div className="empty big">
          <Bow size={64} />
          <h2>Your bag is currently empty</h2>
          <p className="muted">Discover our hand-finished heirlooms and fine everyday pieces.</p>
          <Link to="/shop" className="btn btn-dark">
            Explore All Jewellery
          </Link>
        </div>
      ) : (
        <>
          {/* Free Shipping Meter */}
          <div className="cart-ship-banner">
            <div className="row-between">
              <span className="cart-ship-msg">
                <Icon name="truck" size={18} />
                {freeLeft > 0 ? (
                  <>
                    Add <b>{formatINR(freeLeft)}</b> more for <b>Complimentary Insured Shipping</b>
                  </>
                ) : (
                  <>
                    ✦ You have unlocked <b>Complimentary Pan-India Insured Shipping</b>!
                  </>
                )}
              </span>
              <span className="small muted">Free on orders above ₹999</span>
            </div>
            <div className="meter">
              <span style={{ width: `${Math.min(100, (subtotal / 999) * 100)}%` }} />
            </div>
          </div>

          <div className="two-col cart-page-grid">
            <div className="cart-main-col">
              <div className="cart-table">
                {cartItems.map((i) => (
                  <div className="cart-row" key={i.key}>
                    <Link to={`/product/${i.product.id}`} className="cart-row-img-link">
                      <Img id={i.product.images[0]} w={300} alt={i.product.name} />
                    </Link>

                    <div className="cr-info">
                      <Link to={`/product/${i.product.id}`} className="cl-name">
                        {i.product.name}
                      </Link>
                      <small className="cr-spec">
                        {i.product.metal}
                        {i.size ? ` · Size ${i.size}` : ''} · SKU: {i.product.sku}
                      </small>
                      <small className="cr-purity">{i.product.purity}</small>

                      <div className="cr-actions">
                        <button
                          className="link-btn"
                          onClick={() => {
                            toggleWish(i.product.id)
                            removeFromCart(i.key)
                          }}
                        >
                          Move to Wishlist
                        </button>
                        <button className="link-btn" onClick={() => removeFromCart(i.key)}>
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="cr-qty">
                      <Qty value={i.qty} onChange={(q) => updateQty(i.key, q)} />
                    </div>

                    <div className="cr-price">
                      <span className="price">{formatINR(i.product.price * i.qty)}</span>
                      {i.qty > 1 && (
                        <small className="muted">{formatINR(i.product.price)} each</small>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Signature Gifting Option */}
              <div className="cart-gift-box">
                <label className="check">
                  <input
                    type="checkbox"
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  <span>
                    <b>Add Complimentary Signature Keepsake Box & Handwritten Note</b>
                  </span>
                </label>
                {giftWrap && (
                  <div className="cart-gift-fields">
                    <textarea
                      className="input"
                      rows={3}
                      placeholder="Enter your message for the calligraphy note (e.g. Happy Anniversary, with all my love)..."
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                    />
                    <small className="muted">
                      ✦ We will conceal all pricing on the physical invoice included in the parcel.
                    </small>
                  </div>
                )}
              </div>
            </div>

            <Summary>
              <button
                className="btn btn-dark btn-block"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              <Link to="/shop" className="btn btn-line btn-block">
                Continue Shopping
              </Link>
            </Summary>
          </div>
        </>
      )}

      {/* Suggested Additions */}
      <section className="section-tight cart-recommendations">
        <h3>Pairs beautifully with</h3>
        <div className="pgrid">
          {recommendations.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
