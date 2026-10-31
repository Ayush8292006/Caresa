import { useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Icon } from '../components/Common'
import ProductCard from '../components/ProductCard'
import { Timeline, StatusPill, OrderItems } from './Track'
import { PRODUCTS, formatINR } from '../data/products'

export default function Account() {
  const { user, logout, orders } = useStore()
  const navigate = useNavigate()
  if (!user) return <Navigate to="/login" replace />
  const mine = orders.filter((o) => o.mine || o.email === user.email)
  const myOrders = mine.length ? mine : orders.slice(0, 2) // demo fallback so the screen is never empty

  return (
    <div className="wrap page-pad account">
      <div className="acc-hero">
        <div className="avatar">{user.name[0]?.toUpperCase()}</div>
        <div><p className="eyebrow">My Account</p><h1>Hello, {user.name}</h1><p className="muted">{user.email}</p></div>
      </div>
      <div className="acc-layout">
        <nav className="acc-nav">
          <NavLink end to="/account"><Icon name="grid" size={18} /> Overview</NavLink>
          <NavLink to="/account/orders"><Icon name="box" size={18} /> Orders</NavLink>
          <NavLink to="/account/wishlist"><Icon name="heart" size={18} /> Wishlist</NavLink>
          <NavLink to="/account/addresses"><Icon name="pin" size={18} /> Addresses</NavLink>
          <NavLink to="/account/profile"><Icon name="user" size={18} /> Profile</NavLink>
          <button onClick={() => { logout(); navigate('/') }}><Icon name="logout" size={18} /> Sign out</button>
        </nav>
        <div className="acc-main">
          <Routes>
            <Route index element={<Overview orders={myOrders} />} />
            <Route path="orders" element={<Orders orders={myOrders} />} />
            <Route path="orders/:oid" element={<Orders orders={myOrders} />} />
            <Route path="wishlist" element={<WishGrid />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function Overview({ orders }) {
  const { wishlist } = useStore()
  const spent = orders.reduce((s, o) => s + o.total, 0)
  return (
    <>
      <div className="kpis">
        <div className="kpi"><small>Orders</small><b>{orders.length}</b></div>
        <div className="kpi"><small>Wishlist</small><b>{wishlist.length}</b></div>
        <div className="kpi"><small>Caresa Points</small><b>{Math.round(spent / 100).toLocaleString('en-IN')}</b></div>
      </div>
      <h3 className="mt">Recent orders</h3>
      <OrderList orders={orders.slice(0, 3)} />
    </>
  )
}

function OrderList({ orders }) {
  return (
    <div className="order-list">
      {orders.map((o) => (
        <Link to={`/account/orders/${o.id}`} key={o.id} className="order-row">
          <div><b>{o.id}</b><small>{new Date(o.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</small></div>
          <StatusPill status={o.status} />
          <span className="price">{formatINR(o.total)}</span>
          <Icon name="arrow" size={16} />
        </Link>
      ))}
    </div>
  )
}

function Orders({ orders }) {
  const { oid } = useParams()
  const order = oid && orders.find((o) => o.id === oid)
  if (order) return (
    <div className="order-detail">
      <Link to="/account/orders" className="link-btn">← All orders</Link>
      <div className="row-between wrap-gap"><h2>Order {order.id}</h2><StatusPill status={order.status} /></div>
      <div className="tc-grid">
        <Timeline order={order} />
        <div>
          <OrderItems order={order} />
          <div className="row-between total"><span>Total</span><span>{formatINR(order.total)}</span></div>
          <div className="btn-row">
            <Link to={`/track/${order.id}`} className="btn btn-dark btn-sm">Live tracking</Link>
            <button className="btn btn-line btn-sm">Download invoice</button>
            {order.status >= 5 && <button className="btn btn-line btn-sm">Request return</button>}
          </div>
        </div>
      </div>
    </div>
  )
  return (<><h2>My orders</h2><OrderList orders={orders} /></>)
}

function WishGrid() {
  const { wishlist } = useStore()
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))
  return (<><h2>Wishlist</h2>{items.length ? <div className="pgrid pgrid-3">{items.map((p) => <ProductCard key={p.id} p={p} />)}</div> : <p className="muted">Tap the heart on any piece to save it here. <Link to="/shop" className="link-u">Browse jewellery</Link></p>}</>)
}

function Addresses() {
  const { notify } = useStore()
  const [list, setList] = useState([
    { id: 1, tag: 'Home', text: '12 Palm Grove, Bandra West, Mumbai, Maharashtra 400050', def: true },
    { id: 2, tag: 'Work', text: '4th Floor, One BKC, Bandra Kurla Complex, Mumbai 400051', def: false },
  ])
  return (
    <>
      <div className="row-between"><h2>Saved addresses</h2><button className="btn btn-line btn-sm" onClick={() => notify('Add address form — connect to backend')}>+ Add new</button></div>
      <div className="addr-grid">
        {list.map((a) => (
          <div key={a.id} className={`addr ${a.def ? 'def' : ''}`}>
            <b>{a.tag} {a.def && <span className="pill pill-neutral">Default</span>}</b>
            <p>{a.text}</p>
            <div className="btn-row">
              {!a.def && <button className="link-btn" onClick={() => setList(list.map((x) => ({ ...x, def: x.id === a.id })))}>Set default</button>}
              <button className="link-btn" onClick={() => setList(list.filter((x) => x.id !== a.id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Profile() {
  const { user, setUser, notify } = useStore()
  const [f, setF] = useState({ name: user.name, email: user.email, phone: user.phone || '', dob: '' })
  return (
    <>
      <h2>Profile</h2>
      <form className="form-grid narrow" onSubmit={(e) => { e.preventDefault(); setUser({ ...user, ...f }); notify('Profile saved') }}>
        <label className="field"><span>Name</span><input id="pf-name" className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label className="field"><span>Email</span><input id="pf-email" className="input" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
        <label className="field half"><span>Mobile</span><input id="pf-phone" className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <label className="field half"><span>Birthday (for a surprise)</span><input id="pf-dob" className="input" type="date" value={f.dob} onChange={(e) => setF({ ...f, dob: e.target.value })} /></label>
        <button className="btn btn-dark">Save changes</button>
      </form>
    </>
  )
}
