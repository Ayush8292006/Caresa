import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { getProduct, COUPONS } from '../data/products'
import { DEMO_ORDERS } from '../data/demo'

/*
  Frontend-only store. Every function here is where the backend team plugs in an API call:
  addToCart -> POST /api/cart, placeOrder -> POST /api/orders, login -> POST /api/auth/login, etc.
*/
const StoreContext = createContext(null)

const load = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* ignore */ } }

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('caresa_cart', []))
  const [wishlist, setWishlist] = useState(() => load('caresa_wish', []))
  const [user, setUser] = useState(() => load('caresa_user', null))
  const [orders, setOrders] = useState(() => load('caresa_orders', DEMO_ORDERS))
  const [coupon, setCoupon] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => save('caresa_cart', cart), [cart])
  useEffect(() => save('caresa_wish', wishlist), [wishlist])
  useEffect(() => save('caresa_user', user), [user])
  useEffect(() => save('caresa_orders', orders), [orders])

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(window.__caresaToast)
    window.__caresaToast = setTimeout(() => setToast(null), 2600)
  }, [])

  const addToCart = (id, qty = 1, size = null) => {
    setCart((c) => {
      const key = id + '|' + (size || '')
      const found = c.find((i) => i.key === key)
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      return [...c, { key, id, qty, size }]
    })
    setCartOpen(true)
  }
  const updateQty = (key, qty) =>
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))))
  const removeFromCart = (key) => setCart((c) => c.filter((i) => i.key !== key))

  const toggleWish = (id) => {
    setWishlist((w) => {
      const has = w.includes(id)
      notify(has ? 'Removed from wishlist' : 'Saved to wishlist')
      return has ? w.filter((x) => x !== id) : [...w, id]
    })
  }

  const cartItems = useMemo(
    () => cart.map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product),
    [cart]
  )
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const discount = coupon ? Math.round(subtotal * COUPONS[coupon]) : 0
  const shipping = subtotal - discount >= 999 || subtotal === 0 ? 0 : 99
  const total = subtotal - discount + shipping
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase()
    if (COUPONS[c]) { setCoupon(c); notify(`Coupon ${c} applied`); return true }
    return false
  }

  const login = (email, name) => {
    const u = { name: name || email.split('@')[0], email, phone: '', isAdmin: email.toLowerCase().startsWith('admin') }
    setUser(u)
    notify(`Welcome, ${u.name}`)
    return u
  }
  const logout = () => { setUser(null); notify('Signed out') }

  const placeOrder = (address, payment) => {
    const id = 'CRS' + (10249 + orders.filter((o) => o.mine).length)
    const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    const order = {
      id, mine: true, date: new Date().toISOString().slice(0, 10), customer: address.name, email: user?.email || address.email,
      phone: address.phone, city: address.city, address, status: 0, payment,
      items: cart.map(({ id, qty, size }) => ({ id, qty, size })), total, history: [now],
    }
    setOrders((o) => [order, ...o])
    setCart([]); setCoupon(null)
    return order
  }

  const updateOrderStatus = (id, status) =>
    setOrders((os) => os.map((o) => {
      if (o.id !== id) return o
      const history = [...(o.history || [])]
      while (history.length <= status) history.push(new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short' }))
      return { ...o, status, history: history.slice(0, status + 1) }
    }))

  const value = {
    cart, cartItems, cartCount, subtotal, discount, shipping, total, coupon, applyCoupon, setCoupon,
    addToCart, updateQty, removeFromCart, cartOpen, setCartOpen,
    wishlist, toggleWish, user, login, logout, setUser,
    orders, placeOrder, updateOrderStatus, toast, notify,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
