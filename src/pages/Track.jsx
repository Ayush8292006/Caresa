import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Icon, Img, Reveal, Breadcrumb } from '../components/Common'
import { getProduct, formatINR, ORDER_STEPS } from '../data/products'

export function Timeline({ order }) {
  const stepDescriptions = [
    'Order received and verified with payment gateway',
    'Order confirmed by Jaipur atelier manager',
    'Piece cast, stone-set, hand-polished & hallmarked',
    'Handed over to BlueDart Express with sealed pouch',
    'Shipment arrived at your local delivery hub',
    'Delivered safely into your hands with signature',
  ]

  return (
    <ol className="timeline" aria-label="Tracking progress stages">
      {ORDER_STEPS.map((s, i) => {
        const state = i < order.status ? 'done' : i === order.status ? 'current' : ''
        return (
          <li key={s} className={state}>
            <span className="tl-dot">
              {i <= order.status ? <Icon name="check" size={13} stroke={2.4} /> : null}
            </span>
            <div className="tl-content">
              <b>{s}</b>
              <span className="tl-subdesc">{stepDescriptions[i]}</span>
              <small className="tl-timestamp">
                {order.history?.[i] || (i === order.status + 1 ? '✦ Next stage' : '')}
              </small>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function StatusPill({ status }) {
  const tone = status >= 5 ? 'ok' : status >= 3 ? 'info' : status === 0 ? 'warn' : 'neutral'
  return <span className={`pill pill-${tone}`}>✦ {ORDER_STEPS[status] || 'Processing'}</span>
}

export function OrderItems({ order }) {
  return (
    <div className="order-items">
      {order.items.map((it, k) => {
        const p = getProduct(it.id)
        if (!p) return null
        return (
          <div key={k} className="mini-item">
            <div className="mi-img">
              <Img id={p.images[0]} w={160} alt="" />
              <span>{it.qty}</span>
            </div>
            <div>
              <Link to={`/product/${p.id}`} className="mini-item-name">
                {p.name}
              </Link>
              <small>
                {p.metal}
                {it.size ? ` · Size ${it.size}` : ''} · {p.purity}
              </small>
            </div>
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
    if (!found) {
      setErr('We could not find an order with that reference. Please check your confirmation email (e.g. CRS10248 or CRS10247).')
      return
    }
    setErr('')
    navigate(`/track/${found.id}`)
  }

  return (
    <div className="wrap page-pad track-page">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Concierge', 'Track Your Order']} />

      <Reveal className="track-head" effect="fade-up">
        <p className="eyebrow">Real-Time Concierge Tracking</p>
        <h1 className="page-title">Where is my heirloom?</h1>
        <p className="track-sub">
          Track the journey of your hand-finished jewellery piece from our Jaipur workshop to your door.
        </p>

        <form className="track-form" onSubmit={submit}>
          <input
            id="track-id"
            className="input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Order ID, e.g. CRS10248"
            required
          />
          <input
            id="track-phone"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile or email (optional)"
          />
          <button className="btn btn-dark" type="submit">
            Track Order
          </button>
        </form>

        {err && <small className="err">{err}</small>}

        {!id && (
          <div className="demo-track-suggestions">
            <span className="small muted">Try tracking these demo orders:</span>
            <div className="demo-chips">
              <button className="chip" onClick={() => navigate('/track/CRS10248')}>
                CRS10248 (In Transit · Mumbai)
              </button>
              <button className="chip" onClick={() => navigate('/track/CRS10247')}>
                CRS10247 (Delivered · Delhi)
              </button>
              <button className="chip" onClick={() => navigate('/track/CRS10246')}>
                CRS10246 (Confirmed · Bengaluru)
              </button>
            </div>
          </div>
        )}
      </Reveal>

      {id && !order && (
        <div className="empty big">
          <p>No active order found with Reference ID {id}.</p>
          <button className="btn btn-line" onClick={() => navigate('/track')}>
            Try another order
          </button>
        </div>
      )}

      {order && (
        <Reveal className="track-card" effect="fade-up">
          <div className="tc-top">
            <div>
              <p className="eyebrow">Order Reference: {order.id}</p>
              <h2>
                {order.status >= 5
                  ? 'Delivered into your hands'
                  : order.status >= 3
                  ? 'In transit via Express Air'
                  : 'Being hand-finished in our Jaipur atelier'}
              </h2>
              <p className="muted small">
                Placed on{' '}
                {new Date(order.date).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                · Payment: {order.payment}
              </p>
            </div>
            <StatusPill status={order.status} />
          </div>

          <div className="progress-bar" role="progressbar" aria-valuenow={(order.status / 5) * 100}>
            <span style={{ width: `${Math.max(8, (order.status / 5) * 100)}%` }} />
          </div>

          <div className="tc-grid">
            <Timeline order={order} />

            <div className="tc-side-details">
              <div className="courier-card">
                <Icon name="truck" size={24} />
                <div>
                  <b>{order.courier || 'BlueDart Express Air'}</b>
                  <small>Air Waybill: <b>{order.awb || 'BD7744120983'}</b></small>
                  <span className="small ok">✦ Insured Doorstep Transit</span>
                </div>
              </div>

              <h3>Pieces in this shipment</h3>
              <OrderItems order={order} />

              <div className="row-between total tc-total-row">
                <span>Total amount</span>
                <span>{formatINR(order.total)}</span>
              </div>

              <div className="tc-concierge-box">
                <p className="small">
                  <b>Questions about this delivery?</b>
                  <br />
                  Our atelier concierge is on standby via WhatsApp at +91 98765 43210 with your order reference.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  )
}
