import { useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Icon, Breadcrumb } from '../components/Common'
import ProductCard from '../components/ProductCard'
import { Timeline, StatusPill, OrderItems } from './Track'
import { PRODUCTS, formatINR } from '../data/products'

export default function Account() {
  const { user, logout, orders } = useStore()
  const navigate = useNavigate()

  if (!user) return <Navigate to="/login" replace />

  const mine = orders.filter((o) => o.mine || o.email === user.email)
  const myOrders = mine.length ? mine : orders.slice(0, 2) // demo fallback so account is lively

  return (
    <div className="wrap page-pad account-page">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Collector Account']} />

      <div className="acc-hero">
        <div className="avatar">{(user.name || 'C')[0]?.toUpperCase()}</div>
        <div className="acc-hero-info">
          <p className="eyebrow">Caresa Collector</p>
          <h1>Welcome, {user.name}</h1>
          <p className="muted small">{user.email} · Jaipur Collector Circle</p>
        </div>
      </div>

      <div className="acc-layout">
        <nav className="acc-nav" aria-label="Account navigation">
          <NavLink end to="/account">
            <Icon name="grid" size={18} /> Overview
          </NavLink>
          <NavLink to="/account/orders">
            <Icon name="box" size={18} /> Order History
          </NavLink>
          <NavLink to="/account/wishlist">
            <Icon name="heart" size={18} /> Saved Pieces
          </NavLink>
          <NavLink to="/account/addresses">
            <Icon name="pin" size={18} /> Delivery Addresses
          </NavLink>
          <NavLink to="/account/profile">
            <Icon name="user" size={18} /> Profile & Preferences
          </NavLink>
          <button
            onClick={() => {
              logout()
              navigate('/')
            }}
          >
            <Icon name="logout" size={18} /> Sign Out
          </button>
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
    <div className="acc-overview-tab">
      <div className="kpis">
        <div className="kpi">
          <small>Orders Placed</small>
          <b>{orders.length}</b>
          <span className="small muted">Handcrafted heirlooms</span>
        </div>
        <div className="kpi">
          <small>Saved Pieces</small>
          <b>{wishlist.length}</b>
          <span className="small muted">In private wishlist</span>
        </div>
        <div className="kpi">
          <small>Caresa Club Points</small>
          <b>{Math.round(spent / 100).toLocaleString('en-IN')}</b>
          <span className="small ok">✦ Elite Tier Member</span>
        </div>
      </div>

      <div className="row-between mt-large">
        <h3>Recent Orders</h3>
        <Link to="/account/orders" className="link-arrow">
          View all orders <Icon name="arrow" size={14} />
        </Link>
      </div>

      <OrderList orders={orders.slice(0, 3)} />
    </div>
  )
}

function OrderList({ orders }) {
  return (
    <div className="order-list">
      {orders.map((o) => (
        <Link to={`/account/orders/${o.id}`} key={o.id} className="order-row">
          <div className="order-row-main">
            <b>{o.id}</b>
            <small>
              {new Date(o.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}{' '}
              · {o.items.length} {o.items.length > 1 ? 'pieces' : 'piece'}
            </small>
          </div>
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
  const { notify } = useStore()
  const order = oid && orders.find((o) => o.id === oid)

  if (order) {
    return (
      <div className="order-detail">
        <Link to="/account/orders" className="link-btn">
          ← Return to All Orders
        </Link>
        <div className="row-between wrap-gap mt">
          <h2>Order Reference: {order.id}</h2>
          <StatusPill status={order.status} />
        </div>

        <div className="tc-grid">
          <Timeline order={order} />
          <div className="order-detail-side">
            <OrderItems order={order} />
            <div className="row-between total">
              <span>Total Paid</span>
              <span>{formatINR(order.total)}</span>
            </div>
            <div className="btn-row">
              <Link to={`/track/${order.id}`} className="btn btn-dark btn-sm">
                Live Tracking
              </Link>
              <button
                className="btn btn-line btn-sm"
                onClick={() => notify('Downloading official stamped invoice PDF...', 'info')}
              >
                Download Stamped Invoice
              </button>
              {order.status >= 5 && (
                <button
                  className="btn btn-line btn-sm"
                  onClick={() => notify('Return request initiated. Concierge will contact you within 24h.', 'info')}
                >
                  Initiate 30-Day Return
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <h2>My Order History</h2>
      <OrderList orders={orders} />
    </>
  )
}

function WishGrid() {
  const { wishlist } = useStore()
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))

  return (
    <>
      <div className="row-between">
        <h2>Saved Pieces</h2>
        <span className="muted small">{items.length} items</span>
      </div>

      {items.length ? (
        <div className="pgrid pgrid-3">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p className="muted">You have not saved any pieces yet.</p>
          <Link to="/shop" className="btn btn-dark btn-sm">
            Discover Jewellery
          </Link>
        </div>
      )}
    </>
  )
}

function Addresses() {
  const { notify } = useStore()
  const [list, setList] = useState([
    {
      id: 1,
      tag: 'Primary Residence',
      text: '12 Palm Grove, 4th Floor, Bandra West, Mumbai, Maharashtra 400050',
      phone: '+91 98200 11223',
      def: true,
    },
    {
      id: 2,
      tag: 'Office / Corporate',
      text: '4th Floor, One BKC, G Block, Bandra Kurla Complex, Mumbai 400051',
      phone: '+91 98200 44556',
      def: false,
    },
  ])

  return (
    <>
      <div className="row-between">
        <h2>Delivery Addresses</h2>
        <button
          className="btn btn-line btn-sm"
          onClick={() => notify('Add new address modal — simulated in demo', 'info')}
        >
          + Add New Address
        </button>
      </div>

      <div className="addr-grid">
        {list.map((a) => (
          <div key={a.id} className={`addr ${a.def ? 'def' : ''}`}>
            <b>
              {a.tag} {a.def && <span className="pill pill-ok">Default</span>}
            </b>
            <p>{a.text}</p>
            <small className="muted">{a.phone}</small>
            <div className="btn-row">
              {!a.def && (
                <button
                  className="link-btn"
                  onClick={() =>
                    setList(list.map((x) => ({ ...x, def: x.id === a.id })))
                  }
                >
                  Set as Default
                </button>
              )}
              <button
                className="link-btn"
                onClick={() => setList(list.filter((x) => x.id !== a.id))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function Profile() {
  const { user, setUser, notify } = useStore()
  const [f, setF] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '+91 98200 11223',
    dob: '1995-10-14',
  })

  return (
    <>
      <h2>Collector Profile & Preferences</h2>
      <form
        className="form-grid narrow"
        onSubmit={(e) => {
          e.preventDefault()
          setUser({ ...user, ...f })
          notify('Profile updated successfully', 'success')
        }}
      >
        <label className="field">
          <span>Full Name</span>
          <input
            id="pf-name"
            className="input"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Email Address</span>
          <input
            id="pf-email"
            className="input"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
        </label>
        <label className="field half">
          <span>Mobile Number</span>
          <input
            id="pf-phone"
            className="input"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
          />
        </label>
        <label className="field half">
          <span>Anniversary / Birthday</span>
          <input
            id="pf-dob"
            className="input"
            type="date"
            value={f.dob}
            onChange={(e) => setF({ ...f, dob: e.target.value })}
          />
        </label>

        <button className="btn btn-dark">Save Changes</button>
      </form>
    </>
  )
}


