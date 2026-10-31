import { useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Bow, Icon } from '../components/Common'
import { OrderItems } from './Track'
import { formatINR } from '../data/products'

export default function OrderSuccess() {
  const { id } = useParams()
  const { orders } = useStore()
  const canvasRef = useRef(null)

  const order = orders.find((o) => o.id === id) || {
    id: id || 'CRS10249',
    customer: 'Valued Collector',
    email: 'collector@example.com',
    total: 24990,
    courier: 'BlueDart Express Air',
    awb: 'BD7744120983',
    items: [{ id: 'aurelia-solitaire', qty: 1 }],
  }

  const eta = new Date()
  eta.setDate(eta.getDate() + 4)

  // Pure lightweight canvas confetti particle celebration
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Palette of muted gold, soft champagne, warm bronze, ivory
    const colors = ['#b88e55', '#d6be9c', '#6b4a32', '#faf7f2', '#cdb08a']
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 5 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngle: 0,
        tiltAngleInc: Math.random() * 0.07 + 0.05,
        speedY: Math.random() * 2 + 1.5,
      })
    }

    let frameCount = 0
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.tiltAngle += p.tiltAngleInc
        p.y += p.speedY
        p.tilt = Math.sin(p.tiltAngle) * 12

        ctx.beginPath()
        ctx.lineWidth = p.r / 2
        ctx.strokeStyle = p.color
        ctx.moveTo(p.x + p.tilt + p.r, p.y)
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r)
        ctx.stroke()
      })

      frameCount++
      if (frameCount < 240) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
    render()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="wrap page-pad success-page">
      <canvas ref={canvasRef} className="confetti-canvas" aria-hidden="true" />

      <div className="success-card">
        <div className="success-mark">
          <Bow size={84} draw />
        </div>

        <p className="script">with our deepest gratitude</p>
        <h1 className="success-heading">Your Order is Confirmed</h1>

        <div className="success-badge-id">
          <span>Order Reference: <b>{order.id}</b></span>
          <span className="pill pill-ok">Payment Authorized</span>
        </div>

        <p className="success-desc">
          A confirmation and tracking dossier has been dispatched to <b>{order.email}</b>. Our Jaipur atelier artisans have received your order details and are preparing your piece with care.
        </p>

        <div className="success-delivery-card">
          <div className="sd-item">
            <Icon name="truck" size={22} />
            <div>
              <span className="small muted">Estimated Doorstep Delivery</span>
              <b>{eta.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</b>
            </div>
          </div>

          <div className="sd-item">
            <Icon name="shield" size={22} />
            <div>
              <span className="small muted">Courier & Waybill</span>
              <b>{order.courier || 'BlueDart Express Air'} · AWB {order.awb || 'BD7744120983'}</b>
            </div>
          </div>
        </div>

        <div className="success-order-items-box">
          <h3>Your Heirloom Pieces</h3>
          <OrderItems order={order} />
          <div className="row-between total success-total-row">
            <span>Total Amount Paid</span>
            <b>{formatINR(order.total)}</b>
          </div>
        </div>

        <div className="success-actions">
          <Link to={`/track/${order.id}`} className="btn btn-dark">
            <Icon name="truck" size={16} /> Live Order Tracking
          </Link>
          <button className="btn btn-line" onClick={handlePrint}>
            <Icon name="award" size={16} /> Print Receipt
          </button>
          <Link to="/shop" className="btn btn-line">
            Continue Exploring
          </Link>
        </div>

        <div className="success-concierge-help">
          <p className="small muted">
            Need bespoke changes or have a question? Our Johari Bazaar concierge is available on WhatsApp at <b>+91 98765 43210</b>.
          </p>
        </div>
      </div>
    </div>
  )
}
