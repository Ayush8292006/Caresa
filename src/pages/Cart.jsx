import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Bow, Breadcrumb } from '../components/Common'
import { Qty } from '../components/Layout'
import { formatINR } from '../data/products'

export function Summary({ children }) {
  const { subtotal, discount, shipping, total, coupon, applyCoupon, setCoupon } = useStore()
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  return (
    <aside className="summary">
      <h3>Order Summary</h3>
      <div className="coupon">
        {coupon ? (
          <div className="coupon-on"><span><b>{coupon}</b> applied</span><button className="link-btn" onClick={() => setCoupon(null)}>Remove</button></div>
        ) : (
          <>
            <div className="pin-row">
              <input id="coupon-input" className="input" value={code} onChange={(e) => { setCode(e.target.value); setErr('') }} placeholder="Coupon code" />
              <button className="btn btn-line" onClick={() => !applyCoupon(code) && setErr('This code is not valid. Try CARESA10 or FIRSTLOVE.')}>Apply</button>
            </div>
            {err && <small className="err">{err}</small>}
          </>
        )}
      </div>
      <div className="sum-rows">
        <div className="row-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
        {discount > 0 && <div className="row-between ok"><span>Discount</span><span>−{formatINR(discount)}</span></div>}
        <div className="row-between"><span>Shipping</span><span>{shipping ? formatINR(shipping) : 'Free'}</span></div>
        <div className="row-between total"><span>Total</span><span>{formatINR(total)}</span></div>
        <small className="muted">Inclusive of GST</small>
      </div>
      {children}
    </aside>
  )
}

export default function Cart() {
  const { cartItems, updateQty, removeFromCart, toggleWish } = useStore()
  const navigate = useNavigate()
  return (
    <div className="wrap page-pad">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Shopping Bag']} />
      <h1 className="page-title">Shopping Bag</h1>
      {cartItems.length === 0 ? (
        <div className="empty big"><Bow size={64} /><p>Your bag is empty.</p><Link to="/shop" className="btn btn-dark">Continue Shopping</Link></div>
      ) : (
        <div className="two-col">
          <div className="cart-table">
            {cartItems.map((i) => (
              <div className="cart-row" key={i.key}>
                <Link to={`/product/${i.product.id}`}><Img id={i.product.images[0]} w={300} alt={i.product.name} /></Link>
                <div className="cr-info">
                  <Link to={`/product/${i.product.id}`} className="cl-name">{i.product.name}</Link>
                  <small>{i.product.metal}{i.size ? ` · Size ${i.size}` : ''} · {i.product.sku}</small>
                  <div className="cr-actions">
                    <button className="link-btn" onClick={() => { toggleWish(i.product.id); removeFromCart(i.key) }}>Move to wishlist</button>
                    <button className="link-btn" onClick={() => removeFromCart(i.key)}>Remove</button>
                  </div>
                </div>
                <Qty value={i.qty} onChange={(q) => updateQty(i.key, q)} />
                <span className="price">{formatINR(i.product.price * i.qty)}</span>
              </div>
            ))}
          </div>
          <Summary>
            <button className="btn btn-dark btn-block" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            <Link to="/shop" className="btn btn-line btn-block">Continue Shopping</Link>
          </Summary>
        </div>
      )}
    </div>
  )
}
