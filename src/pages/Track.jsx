import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Icon, Img, Reveal } from '../components/Common'
import { getProduct, formatINR, ORDER_STEPS } from '../data/products'

export function Timeline({ order }) {
  return (
    <ol className="timeline">
      {ORDER_STEPS.map((s, i) => {
        const state = i < order.status ? 'done' : i === order.status ? 'current' : ''
        return (
          <li key={s} className={state}>
            <span className="tl-dot">{i <= order.status ? <Icon name="check" size={12} stroke={2.2} /> : null}</span>
            <div>
              <b>{s}</b>
              <small>{order.history?.[i] || (i === order.status + 1 ? 'Up next' : '')}</small>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function StatusPill({ status }) {
  const tone = status >= 5 ? 'ok' : status >= 3 ? 'info' : status === 0 ? 'warn' : 'neutral'
  return <span className={`pill pill-${tone}`}>{ORDER_STEPS[status]}</span>
}

export function OrderItems({ order }) {
  return (
    <div className="order-items">
      {order.items.map((it, k) => {
        const p = getProduct(it.id)
        if (!p) return null
        return (
          <div key={k} className="mini-item">
            <div className="mi-img"><Img id={p.images[0]} w={160} alt="" /><span>{it.qty}</span></div>
            <div><Link to={`/product/${p.id}`}>{p.name}</Link><small>{p.metal}{it.size ? ` · Size ${it.size}` : ''}</small></div>
            <b>{formatINR(p.price * it.qty)}</b>
          </div>
        )
      })}
    </div>
  )
}

export default function Track() {
  const { id } = useParams()
  const { orders } = useStore()
  const navigate = useNavigate()
  const [q, setQ] = useState(id || '')
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  const order = id ? orders.find((o) => o.id.toLowerCase() === id.toLowerCase()) : null

  const submit = (e) => {
    e.preventDefault()
    const found = orders.find((o) => o.id.toLowerCase() === q.trim().toLowerCase())
    if (!found) { setErr('We could not find that order. Check the ID in your confirmation email (e.g. CRS10248).'); return }
    setErr(''); navigate(`/track/${found.id}`)
  }

  return (
    <div className="wrap page-pad track">
      <Reveal className="track-head">
        <p className="eyebrow">Order Tracking</p>
        <h1 className="page-title">Where is my order?</h1>
        <form className="track-form" onSubmit={submit}>
          <input id="track-id" className="input" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Order ID, e.g. CRS10248" required />
          <input id="track-phone" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile or email (optional)" />
          <button className="btn btn-dark">Track</button>
        </form>
        {err && <small className="err">{err}</small>}
        {!id && <p className="muted small">Try demo orders: <button className="link-u" onClick={() => navigate('/track/CRS10248')}>CRS10248</button> · <button className="link-u" onClick={() => navigate('/track/CRS10247')}>CRS10247</button></p>}
      </Reveal>

      {id && !order && <div className="empty big"><p>No order found with ID {id}.</p></div>}

      {order && (
        <Reveal className="track-card">
          <div className="tc-top">
            <div>
              <p className="eyebrow">Order {order.id}</p>
              <h2>{order.status >= 5 ? 'Delivered' : order.status >= 3 ? 'On its way to you' : 'Being prepared with care'}</h2>
              <p className="muted">Placed on {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · {order.payment}</p>
            </div>
            <StatusPill status={order.status} />
          </div>
          <div className="progress-bar"><span style={{ width: `${(order.status / 5) * 100}%` }} /></div>
          <div className="tc-grid">
            <Timeline order={order} />
            <div>
              {order.courier && (
                <div className="courier">
                  <Icon name="truck" size={22} />
                  <div><b>{order.courier}</b><small>AWB {order.awb}</small></div>
                </div>
              )}
              <h3>Items</h3>
              <OrderItems order={order} />
              <div className="row-between total"><span>Total paid</span><span>{formatINR(order.total)}</span></div>
              <p className="muted small">Need help? WhatsApp us at +91 98765 43210 with your order ID.</p>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  )
}
