import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Icon, Logo } from '../components/Common'
import { Summary } from './Cart'
import { formatINR } from '../data/products'

const STEPS = ['Address', 'Delivery', 'Payment']

export default function Checkout() {
  const { cartItems, user, placeOrder, total } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState({})
  const [addr, setAddr] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', line1: '', line2: '', city: '', state: 'Maharashtra', pincode: '',
  })
  const [delivery, setDelivery] = useState('standard')
  const [gift, setGift] = useState({ wrap: false, note: '' })
  const [pay, setPay] = useState('UPI')
  const [placing, setPlacing] = useState(false)

  if (cartItems.length === 0 && !placing) return (
    <div className="wrap page-pad empty big">
      <p>Your bag is empty, so there is nothing to check out yet.</p>
      <Link to="/shop" className="btn btn-dark">Shop Jewellery</Link>
    </div>
  )

  const set = (k) => (e) => setAddr({ ...addr, [k]: e.target.value })
  const validate = () => {
    const e = {}
    if (!addr.name.trim()) e.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(addr.email)) e.email = 'Enter a valid email'
    if (!/^\d{10}$/.test(addr.phone.replace(/\s/g, ''))) e.phone = 'Enter a 10-digit mobile number'
    if (!addr.line1.trim()) e.line1 = 'Enter house no. and street'
    if (!addr.city.trim()) e.city = 'Enter your city'
    if (!/^\d{6}$/.test(addr.pincode)) e.pincode = 'Enter a 6-digit pincode'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const next = () => { if (step === 0 && !validate()) return; setStep(step + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const place = () => {
    setPlacing(true)
    setTimeout(() => {
      const order = placeOrder(addr, pay)
      navigate(`/order-success/${order.id}`)
    }, 1400)
  }
  const F = ({ k, label, half, ...rest }) => (
    <label className={`field ${half ? 'half' : ''} ${errors[k] ? 'has-err' : ''}`}>
      <span>{label}</span>
      <input id={`co-${k}`} className="input" value={addr[k]} onChange={set(k)} {...rest} />
      {errors[k] && <small className="err">{errors[k]}</small>}
    </label>
  )

  return (
    <div className="checkout wrap page-pad">
      <div className="co-head">
        <Link to="/"><Logo size="sm" /></Link>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
              <button disabled={i > step} onClick={() => setStep(i)}><span>{i < step ? <Icon name="check" size={12} stroke={2} /> : i + 1}</span>{s}</button>
            </li>
          ))}
        </ol>
        <span className="secure"><Icon name="shield" size={16} /> Secure checkout</span>
      </div>

      <div className="two-col">
        <div className="co-main">
          {step === 0 && (
            <section className="co-card">
              <h2>Shipping address</h2>
              {!user && <p className="muted">Have an account? <Link to="/login" className="link-u">Sign in</Link> for faster checkout.</p>}
              <div className="form-grid">
                {F({ k: 'name', label: 'Full name', autoComplete: 'name' })}
                {F({ k: 'email', label: 'Email', half: true, type: 'email', autoComplete: 'email' })}
                {F({ k: 'phone', label: 'Mobile number', half: true, inputMode: 'numeric', autoComplete: 'tel' })}
                {F({ k: 'line1', label: 'House no., building, street', autoComplete: 'address-line1' })}
                {F({ k: 'line2', label: 'Area, landmark (optional)', autoComplete: 'address-line2' })}
                {F({ k: 'city', label: 'City', half: true, autoComplete: 'address-level2' })}
                <label className="field half"><span>State</span>
                  <select id="co-state" className="input" value={addr.state} onChange={set('state')}>
                    {['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Rajasthan', 'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Telangana', 'Punjab'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                {F({ k: 'pincode', label: 'Pincode', half: true, inputMode: 'numeric', maxLength: 6 })}
              </div>
              <button className="btn btn-dark" onClick={next}>Continue to Delivery</button>
            </section>
          )}

          {step === 1 && (
            <section className="co-card">
              <h2>Delivery method</h2>
              <div className="radio-cards">
                {[['standard', 'Standard insured', '3–5 business days', 'Free'], ['express', 'Express insured', '1–2 business days', '₹249']].map(([v, t, d, pr]) => (
                  <label key={v} className={`rcard ${delivery === v ? 'on' : ''}`}>
                    <input type="radio" name="delivery" checked={delivery === v} onChange={() => setDelivery(v)} />
                    <div><b>{t}</b><small>{d}</small></div><span>{pr}</span>
                  </label>
                ))}
              </div>
              <h3 className="mt">Gifting</h3>
              <label className="check"><input type="checkbox" checked={gift.wrap} onChange={(e) => setGift({ ...gift, wrap: e.target.checked })} /><span>Add signature gift wrap & hide prices on invoice (free)</span></label>
              {gift.wrap && <textarea id="gift-note" className="input" rows={3} placeholder="Your handwritten note (we write it for you)" value={gift.note} onChange={(e) => setGift({ ...gift, note: e.target.value })} />}
              <div className="co-nav">
                <button className="link-btn" onClick={() => setStep(0)}>← Back to address</button>
                <button className="btn btn-dark" onClick={next}>Continue to Payment</button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="co-card">
              <h2>Payment</h2>
              <p className="muted">Demo only — payment gateway (Razorpay / Cashfree) will be connected by the backend team.</p>
              <div className="radio-cards">
                {[['UPI', 'UPI', 'GPay, PhonePe, Paytm, BHIM'], ['Card', 'Credit / Debit card', 'Visa, Mastercard, RuPay, Amex'], ['NetBanking', 'Net banking', 'All major Indian banks'], ['COD', 'Cash on delivery', 'Available up to ₹50,000']].map(([v, t, d]) => (
                  <label key={v} className={`rcard ${pay === v ? 'on' : ''}`}>
                    <input type="radio" name="pay" checked={pay === v} onChange={() => setPay(v)} />
                    <div><b>{t}</b><small>{d}</small></div>
                  </label>
                ))}
              </div>
              <div className="co-review">
                <h3>Deliver to</h3>
                <p>{addr.name}, {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}<br />{addr.phone}</p>
                <button className="link-btn" onClick={() => setStep(0)}>Edit</button>
              </div>
              <div className="co-nav">
                <button className="link-btn" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-gold" onClick={place} disabled={placing}>{placing ? 'Placing order…' : `Pay ${formatINR(total + (delivery === 'express' ? 249 : 0))}`}</button>
              </div>
            </section>
          )}
        </div>

        <Summary>
          <div className="mini-items">
            {cartItems.map((i) => (
              <div key={i.key} className="mini-item">
                <div className="mi-img"><Img id={i.product.images[0]} w={160} alt="" /><span>{i.qty}</span></div>
                <div><p>{i.product.name}</p><small>{i.product.metal}{i.size ? ` · ${i.size}` : ''}</small></div>
                <b>{formatINR(i.product.price * i.qty)}</b>
              </div>
            ))}
            {delivery === 'express' && <div className="row-between"><span>Express delivery</span><span>₹249</span></div>}
          </div>
        </Summary>
      </div>
    </div>
  )
}
