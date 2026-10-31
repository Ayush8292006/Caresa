import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Icon, Logo } from '../components/Common'
import { Summary } from './Cart'
import { formatINR } from '../data/products'

const STEPS = ['Contact & Address', 'Delivery & Gifting', 'Payment Selection']

export default function Checkout() {
  const { cartItems, user, placeOrder, total } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [addr, setAddr] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
  })
  const [delivery, setDelivery] = useState('standard')
  const [gift, setGift] = useState({ wrap: false, note: '' })
  const [pay, setPay] = useState('UPI')
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', exp: '', cvv: '' })
  const [upiId, setUpiId] = useState('')
  const [placing, setPlacing] = useState(false)

  if (cartItems.length === 0 && !placing) {
    return (
      <div className="wrap page-pad empty big">
        <p>Your shopping bag is currently empty.</p>
        <Link to="/shop" className="btn btn-dark">
          Explore Fine Jewellery
        </Link>
      </div>
    )
  }

  const set = (k) => (e) => {
    setAddr({ ...addr, [k]: e.target.value })
    if (errors[k]) setErrors({ ...errors, [k]: null })
  }

  const validate = () => {
    const e = {}
    if (!addr.name.trim()) e.name = 'Please enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(addr.email)) e.email = 'Please enter a valid email address'
    if (!/^\d{10}$/.test(addr.phone.replace(/\s+/g, ''))) e.phone = 'Please enter a valid 10-digit mobile number'
    if (!addr.line1.trim()) e.line1 = 'Please enter house/flat no. and street name'
    if (!addr.city.trim()) e.city = 'Please enter your city'
    if (!/^\d{6}$/.test(addr.pincode.trim())) e.pincode = 'Please enter a 6-digit Indian pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (step === 0 && !validate()) return
    setStep((s) => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const place = () => {
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder(addr, pay)
      navigate(`/order-success/${order.id}`)
    }, 1200)
  }

  const F = ({ k, label, half, placeholder = '', ...rest }) => (
    <label className={`field ${half ? 'half' : ''} ${errors[k] ? 'has-err' : ''}`}>
      <span>{label}</span>
      <input
        id={`co-${k}`}
        className="input"
        value={addr[k]}
        onChange={set(k)}
        placeholder={placeholder}
        {...rest}
      />
      {errors[k] && <small className="err">{errors[k]}</small>}
    </label>
  )

  const deliveryCost = delivery === 'express' ? 249 : 0
  const grandTotal = total + deliveryCost

  return (
    <div className="checkout wrap page-pad">
      <div className="co-head">
        <Link to="/" aria-label="Caresa Home">
          <Logo size="sm" />
        </Link>

        <ol className="steps" aria-label="Checkout Progress">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
              <button disabled={i > step} onClick={() => setStep(i)}>
                <span>{i < step ? <Icon name="check" size={12} stroke={2.4} /> : i + 1}</span>
                {s}
              </button>
            </li>
          ))}
        </ol>

        <span className="secure">
          <Icon name="shield" size={16} /> 256-Bit SSL Encrypted
        </span>
      </div>

      <div className="two-col checkout-layout">
        <div className="co-main">
          {/* STEP 0: Contact & Address */}
          {step === 0 && (
            <section className="co-card">
              <div className="co-card-header">
                <h2>1. Shipping Destination</h2>
                {!user && (
                  <p className="muted small">
                    Already a collector? <Link to="/login" className="link-u">Sign in</Link> for auto-filled details.
                  </p>
                )}
              </div>

              <div className="form-grid">
                {F({ k: 'name', label: 'Full Recipient Name', autoComplete: 'name', placeholder: 'e.g. Radhika Sharma' })}
                {F({ k: 'email', label: 'Order Confirmation Email', half: true, type: 'email', autoComplete: 'email', placeholder: 'you@example.com' })}
                {F({ k: 'phone', label: '10-Digit Mobile Number (for Courier SMS)', half: true, inputMode: 'numeric', maxLength: 10, placeholder: '9876543210' })}
                {F({ k: 'line1', label: 'Flat / House No., Apartment & Street', autoComplete: 'address-line1', placeholder: 'Apartment, Floor, Street' })}
                {F({ k: 'line2', label: 'Landmark / Colony (Optional)', autoComplete: 'address-line2', placeholder: 'Near Johari Gate, etc.' })}
                {F({ k: 'city', label: 'City', half: true, autoComplete: 'address-level2', placeholder: 'e.g. Mumbai' })}

                <label className="field half">
                  <span>State</span>
                  <select
                    id="co-state"
                    className="input"
                    value={addr.state}
                    onChange={set('state')}
                  >
                    {[
                      'Maharashtra',
                      'Delhi',
                      'Karnataka',
                      'Tamil Nadu',
                      'Rajasthan',
                      'Gujarat',
                      'Uttar Pradesh',
                      'West Bengal',
                      'Telangana',
                      'Punjab',
                      'Kerala',
                      'Haryana',
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>

                {F({ k: 'pincode', label: 'Pincode', half: true, inputMode: 'numeric', maxLength: 6, placeholder: 'e.g. 400050' })}
              </div>

              <button className="btn btn-dark" onClick={next}>
                Continue to Delivery & Gifting →
              </button>
            </section>
          )}

          {/* STEP 1: Delivery & Gifting */}
          {step === 1 && (
            <section className="co-card">
              <div className="co-card-header">
                <h2>2. Delivery & Gifting Options</h2>
                <p className="muted small">All shipments are 100% insured until signed by you.</p>
              </div>

              <div className="radio-cards">
                {[
                  ['standard', 'Standard Insured Express', '3–5 business days via BlueDart', 'FREE'],
                  ['express', 'Priority Air Insured Delivery', '1–2 business days guaranteed priority', '₹249'],
                ].map(([v, t, d, pr]) => (
                  <label key={v} className={`rcard ${delivery === v ? 'on' : ''}`}>
                    <input
                      type="radio"
                      name="delivery"
                      checked={delivery === v}
                      onChange={() => setDelivery(v)}
                    />
                    <div>
                      <b>{t}</b>
                      <small>{d}</small>
                    </div>
                    <span className="rcard-price">{pr}</span>
                  </label>
                ))}
              </div>

              <div className="co-gift-block">
                <h3>✦ Signature Gifting</h3>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={gift.wrap}
                    onChange={(e) => setGift({ ...gift, wrap: e.target.checked })}
                  />
                  <span>
                    Add signature ivory gift box, satin ribbon & handwritten calligraphy note (Complimentary)
                  </span>
                </label>

                {gift.wrap && (
                  <div className="co-gift-fields">
                    <textarea
                      id="gift-note"
                      className="input"
                      rows={3}
                      placeholder="Write your note message here. Our atelier calligrapher will handwrite it on an embossed card..."
                      value={gift.note}
                      onChange={(e) => setGift({ ...gift, note: e.target.value })}
                    />
                    <small className="muted">
                      All physical prices will be concealed from the packaging invoice.
                    </small>
                  </div>
                )}
              </div>

              <div className="co-nav">
                <button className="link-btn" onClick={() => setStep(0)}>
                  ← Return to Address
                </button>
                <button className="btn btn-dark" onClick={next}>
                  Continue to Payment →
                </button>
              </div>
            </section>
          )}

          {/* STEP 2: Payment Simulation */}
          {step === 2 && (
            <section className="co-card">
              <div className="co-card-header">
                <h2>3. Payment Method</h2>
                <div className="demo-simulation-banner">
                  <Icon name="award" size={18} />
                  <span>
                    <b>Frontend Demo Mode:</b> No real transaction will occur. Select any method to simulate a completed order.
                  </span>
                </div>
              </div>

              <div className="radio-cards">
                {[
                  ['UPI', 'UPI Instant Pay', 'Google Pay, PhonePe, Paytm, BHIM, CRED'],
                  ['Card', 'Credit / Debit Card', 'Visa, Mastercard, RuPay, American Express'],
                  ['NetBanking', 'Net Banking', 'HDFC, ICICI, SBI, Axis, Kotak, and 50+ banks'],
                  ['COD', 'Cash on Delivery', 'Pay upon doorstep receipt (Insured cash handling)'],
                ].map(([v, t, d]) => (
                  <label key={v} className={`rcard ${pay === v ? 'on' : ''}`}>
                    <input
                      type="radio"
                      name="pay"
                      checked={pay === v}
                      onChange={() => setPay(v)}
                    />
                    <div>
                      <b>{t}</b>
                      <small>{d}</small>
                    </div>
                  </label>
                ))}
              </div>

              {/* UPI Input Mock */}
              {pay === 'UPI' && (
                <div className="pay-subpanel">
                  <label className="field">
                    <span>UPI ID / VPA</span>
                    <input
                      className="input"
                      placeholder="e.g. yourname@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </label>
                  <p className="small muted">
                    A payment request link will be delivered to your UPI app.
                  </p>
                </div>
              )}

              {/* Card Inputs Mock */}
              {pay === 'Card' && (
                <div className="pay-subpanel form-grid">
                  <label className="field">
                    <span>Card Number</span>
                    <input
                      className="input"
                      placeholder="•••• •••• •••• ••••"
                      maxLength={19}
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </label>
                  <label className="field half">
                    <span>Expiry (MM/YY)</span>
                    <input
                      className="input"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardDetails.exp}
                      onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                    />
                  </label>
                  <label className="field half">
                    <span>CVV</span>
                    <input
                      className="input"
                      placeholder="•••"
                      maxLength={4}
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </label>
                </div>
              )}

              <div className="co-review">
                <h3>Delivery Summary</h3>
                <p>
                  <b>{addr.name}</b>
                  <br />
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
                  <br />
                  Mobile: {addr.phone}
                </p>
                <button className="link-btn" onClick={() => setStep(0)}>
                  Edit address
                </button>
              </div>

              <div className="co-nav">
                <button className="link-btn" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button className="btn btn-gold" onClick={place} disabled={placing}>
                  {placing ? 'Authorizing & Placing Order…' : `Place Order · ${formatINR(grandTotal)}`}
                </button>
              </div>
            </section>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <Summary>
          <div className="mini-items">
            {cartItems.map((i) => (
              <div key={i.key} className="mini-item">
                <div className="mi-img">
                  <Img id={i.product.images[0]} w={160} alt="" />
                  <span>{i.qty}</span>
                </div>
                <div>
                  <p>{i.product.name}</p>
                  <small>
                    {i.product.metal}
                    {i.size ? ` · Size ${i.size}` : ''}
                  </small>
                </div>
                <b>{formatINR(i.product.price * i.qty)}</b>
              </div>
            ))}
            {delivery === 'express' && (
              <div className="row-between express-line">
                <span>Priority Air Courier</span>
                <span>₹249</span>
              </div>
            )}
          </div>
        </Summary>
      </div>
    </div>
  )
}
