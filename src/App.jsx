import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Intro from './components/Intro'
import { Header, Footer, CartDrawer, Toast } from './components/Layout'
import { QuickViewModal } from './components/Common'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Track from './pages/Track'
import Login from './pages/Login'
import Account from './pages/Account'
import Wishlist from './pages/Wishlist'
import { About, Contact, Gifting, Policies, NotFound } from './pages/Static'
import AdminApp from './admin/AdminApp'

function ScrollTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname, hash])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <>
        <ScrollTop />
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
        <Toast />
      </>
    )
  }

  return (
    <>
      <ScrollTop />
      <Intro />
      <Header />
      <main key={pathname} className="page-enter">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          <Route path="/track" element={<Track />} />
          <Route path="/track/:id" element={<Track />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account/*" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gifting" element={<Gifting />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <QuickViewModal />
      <Toast />
    </>
  )
}
