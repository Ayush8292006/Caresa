import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { getProduct, COUPONS } from '../data/products'
import { DEMO_ORDERS } from '../data/demo'

/*
  Frontend-only store. Every function here is where the backend team plugs in an API call:
  addToCart -> POST /api/cart, placeOrder -> POST /api/orders, login -> POST /api/auth/login, etc.
*/
const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('caresa_cart', []))
  const [wishlist, setWishlist] = useState(() => load('caresa_wish', []))
  const [user, setUser] = useState(() => load('caresa_user', null))
  const [orders, setOrders] = useState(() => load('caresa_orders', DEMO_ORDERS))
  const [coupon, setCoupon] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [quickViewId, setQuickViewId] = useState(null)
  const [recentlyViewed, setRecentlyViewed] = useState(() => load('caresa_recent', ['aurelia-solitaire', 'meher-layered']))
  const [customReviews, setCustomReviews] = useState(() => load('caresa_reviews', {}))

  useEffect(() => save('caresa_cart', cart), [cart])
  useEffect(() => save('caresa_wish', wishlist), [wishlist])
  useEffect(() => save('caresa_user', user), [user])
  useEffect(() => save('caresa_orders', orders), [orders])
  useEffect(() => save('caresa_recent', recentlyViewed), [recentlyViewed])
  useEffect(() => save('caresa_reviews', customReviews), [customReviews])

  const notify = useCallback((msg, type = 'info') => {
    setToast(typeof msg === 'string' ? { message: msg, type } : msg)
    clearTimeout(window.__caresaToast)
    window.__caresaToast = setTimeout(() => setToast(null), 3200)
  }, [])

  const addToCart = (id, qty = 1, size = null) => {
    setCart((c) => {
      const key = id + '|' + (size || '')
      const found = c.find((i) => i.key === key)
      if (found) return c.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      return [...c, { key, id, qty, size }]
    })
    const product = getProduct(id)
    notify(`Added ${product ? product.name : 'item'} to bag`, 'success')
    setCartOpen(true)
  }

  const updateQty = (key, qty) =>
    setCart((c) => (qty <= 0 ? c.filter((i) => i.key !== key) : c.map((i) => (i.key === key ? { ...i, qty } : i))))

  const removeFromCart = (key) => {
    setCart((c) => c.filter((i) => i.key !== key))
    notify('Item removed from bag')
  }

  const toggleWish = (id) => {
    setWishlist((w) => {
      const has = w.includes(id)
      const p = getProduct(id)
      notify(has ? `Removed ${p?.name || 'item'} from wishlist` : `Saved ${p?.name || 'item'} to wishlist`, has ? 'info' : 'wish')
      return has ? w.filter((x) => x !== id) : [...w, id]
    })
  }

  const addRecentlyViewed = useCallback((id) => {
    if (!id) return
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((x) => x !== id)
      return [id, ...filtered].slice(0, 8)
    })
  }, [])

  const addReview = useCallback((productId, reviewData) => {
    const newReview = {
      id: 'rev_' + Date.now(),
      name: reviewData.name || 'Verified Collector',
      city: reviewData.city || 'India',
      rating: reviewData.rating || 5,
      title: reviewData.title || '',
      text: reviewData.text || '',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    setCustomReviews((prev) => ({
      ...prev,
      [productId]: [newReview, ...(prev[productId] || [])],
    }))
    notify('Thank you for sharing your review!', 'success')
  }, [notify])

  const openQuickView = (id) => setQuickViewId(id)
  const closeQuickView = () => setQuickViewId(null)

  const cartItems = useMemo(
    () => cart.map((i) => ({ ...i, product: getProduct(i.id) })).filter((i) => i.product),
    [cart]
  )
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0)
  const discount = coupon ? Math.round(subtotal * (COUPONS[coupon] || 0)) : 0
  const shipping = subtotal - discount >= 999 || subtotal === 0 ? 0 : 99
  const total = subtotal - discount + shipping
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  const applyCoupon = (code) => {
    const c = code.trim().toUpperCase()
    if (COUPONS[c]) {
      setCoupon(c)
      const pct = Math.round(COUPONS[c] * 100)
      notify(`Coupon ${c} applied! You saved ${pct}%`, 'success')
      return true
    }
    return false
  }

  const login = (email, name) => {
    const u = { name: name || email.split('@')[0], email, phone: '', isAdmin: email.toLowerCase().startsWith('admin') }
    setUser(u)
    notify(`Welcome back, ${u.name}`, 'success')
    return u
  }
  const logout = () => {
    setUser(null)
    notify('Signed out successfully')
  }

  const placeOrder = (address, payment) => {
    const id = 'CRS' + (10249 + orders.filter((o) => o.mine).length)
    const now = new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    const order = {
      id,
      mine: true,
      date: new Date().toISOString().slice(0, 10),
      customer: address.name,
      email: user?.email || address.email,
      phone: address.phone,
      city: address.city,
      address,
      status: 0,
      payment,
      items: cart.map(({ id, qty, size }) => ({ id, qty, size })),
      total,
      history: [now],
      courier: 'BlueDart Express Air',
      awb: 'BD' + Math.floor(1000000000 + Math.random() * 9000000000),
    }
    setOrders((o) => [order, ...o])
    setCart([])
    setCoupon(null)
    return order
  }

  const updateOrderStatus = (id, status) =>
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o
        const history = [...(o.history || [])]
        while (history.length <= status) {
          history.push(new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short' }))
        }
        return { ...o, status, history: history.slice(0, status + 1) }
      })
    )

  const value = {
    cart,
    cartItems,
    cartCount,
    subtotal,
    discount,
    shipping,
    total,
    coupon,
    applyCoupon,
    setCoupon,
    addToCart,
    updateQty,
    removeFromCart,
    cartOpen,
    setCartOpen,
    wishlist,
    toggleWish,
    user,
    login,
    logout,
    setUser,
    orders,
    placeOrder,
    updateOrderStatus,
    toast,
    notify,
    quickViewId,
    openQuickView,
    closeQuickView,
    recentlyViewed,
    addRecentlyViewed,
    customReviews,
    addReview,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
