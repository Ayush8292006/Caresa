import { Link, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Bow } from '../components/Common'
import { OrderItems } from './Track'
import { formatINR } from '../data/products'

export default function OrderSuccess() {
  const { id } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.id === id)
  const eta = new Date(); eta.setDate(eta.getDate() + 5)
  return (
    <div className="wrap page-pad success">
      <div className="success-card">
        <div className="success-mark"><Bow size={72} draw /></div>
        <p className="script">thank you</p>
        <h1>Your order is confirmed</h1>
        <p className="muted">Order <b>{id}</b> · A confirmation has been sent to {order?.email || 'your email'}.</p>
        <p>Estimated delivery by <b>{eta.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</b></p>
        {order && <><OrderItems order={order} /><div className="row-between total"><span>Total</span><span>{formatINR(order.total)}</span></div></>}
        <div className="success-actions">
          <Link to={`/track/${id}`} className="btn btn-dark">Track Order</Link>
          <Link to="/shop" className="btn btn-line">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
