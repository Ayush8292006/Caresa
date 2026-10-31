import { useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Logo, Icon, Img } from '../components/Common'
import { StatusPill, Timeline, OrderItems } from '../pages/Track'
import { PRODUCTS, CATEGORIES, METALS, ORDER_STEPS, formatINR } from '../data/products'
import { DEMO_CUSTOMERS, SALES_LAST_12, DEMO_COUPONS } from '../data/demo'

/* Admin panel — frontend only. Each table maps to an admin API endpoint (see README). */
export default function AdminApp() {
  const [open, setOpen] = useState(false)
  const { user } = useStore()
  return (
    <div className="admin">
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <Link to="/admin" className="admin-logo"><Logo light size="sm" /><span>Admin</span></Link>
        <nav onClick={() => setOpen(false)}>
          <NavLink end to="/admin"><Icon name="chart" size={18} /> Dashboard</NavLink>
          <NavLink to="/admin/orders"><Icon name="box" size={18} /> Orders</NavLink>
          <NavLink to="/admin/products"><Icon name="gem" size={18} /> Products</NavLink>
          <NavLink to="/admin/inventory"><Icon name="grid" size={18} /> Inventory</NavLink>
          <NavLink to="/admin/customers"><Icon name="users" size={18} /> Customers</NavLink>
          <NavLink to="/admin/coupons"><Icon name="tag" size={18} /> Coupons</NavLink>
          <NavLink to="/admin/settings"><Icon name="settings" size={18} /> Settings</NavLink>
        </nav>
        <Link to="/" className="admin-store"><Icon name="eye" size={18} /> View store</Link>
      </aside>
      {open && <div className="drawer-bg show admin-bg" onClick={() => setOpen(false)} />}
      <div className="admin-main">
        <header className="admin-top">
          <button className="icon-btn only-mobile" onClick={() => setOpen(true)} aria-label="Menu"><Icon name="menu" /></button>
          <div className="admin-search"><Icon name="search" size={18} /><input id="admin-search" placeholder="Search orders, products, customers" /></div>
          <div className="admin-user"><div className="avatar sm">{(user?.name || 'A')[0].toUpperCase()}</div><div className="only-desktop"><b>{user?.name || 'Admin'}</b><small>Store owner</small></div></div>
        </header>
        <div className="admin-body">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const { orders } = useStore()
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status < 3).length
  const max = Math.max(...SALES_LAST_12.map((d) => d.v))
  const W = 640, H = 220, pad = 30
  const pts = SALES_LAST_12.map((d, i) => [pad + (i * (W - pad * 2)) / 11, H - pad - (d.v / max) * (H - pad * 2)])
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
  const area = line + ` L${pts[11][0]} ${H - pad} L${pts[0][0]} ${H - pad} Z`
  const byCat = CATEGORIES.map((c) => ({ name: c.name, n: PRODUCTS.filter((p) => p.category === c.slug).reduce((s, p) => s + p.reviews, 0) }))
  const catMax = Math.max(...byCat.map((c) => c.n))

  return (
    <>
      <div className="admin-head"><div><h1>Good evening</h1><p className="muted">Here's how Caresa is doing this month.</p></div><button className="btn btn-dark btn-sm">Download report</button></div>
      <div className="kpis kpis-4">
        <div className="kpi"><small>Revenue (Oct)</small><b>{formatINR(890000)}</b><em className="up">▲ 34.8% vs Sep</em></div>
        <div className="kpi"><small>Orders</small><b>{orders.length + 212}</b><em className="up">▲ 12.1%</em></div>
        <div className="kpi"><small>Avg. order value</small><b>{formatINR(Math.round(revenue / orders.length))}</b><em className="up">▲ 6.4%</em></div>
        <div className="kpi"><small>To fulfil</small><b>{pending}</b><em className="warn">Needs attention</em></div>
      </div>
      <div className="admin-grid">
        <section className="panel">
          <div className="panel-head"><h3>Sales · last 12 months</h3><span className="muted small">₹ lakh</span></div>
          <div className="chart-wrap">
            <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="Monthly sales chart">
              {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                const y = H - pad - t * (H - pad * 2)
                return <g key={t}><line x1={pad} x2={W - pad} y1={y} y2={y} className="grid" /><text x={pad - 6} y={y + 4} className="axis" textAnchor="end">{(max * t).toFixed(0)}</text></g>
              })}
              <path d={area} className="area" />
              <path d={line} className="line" />
              {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r={i === 11 ? 5 : 3} className={i === 11 ? 'pt end' : 'pt'} /><text x={p[0]} y={H - 8} className="axis" textAnchor="middle">{SALES_LAST_12[i].m}</text></g>)}
              <text x={pts[11][0] - 8} y={pts[11][1] - 12} className="axis strong" textAnchor="end">₹{SALES_LAST_12[11].v}L</text>
            </svg>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Top categories</h3></div>
          <div className="bars">
            {byCat.sort((a, b) => b.n - a.n).map((c) => (
              <div key={c.name} className="bar-row"><span>{c.name}</span><div className="bar"><i style={{ width: `${(c.n / catMax) * 100}%` }} /></div><b>{c.n}</b></div>
            ))}
          </div>
        </section>
      </div>
      <section className="panel">
        <div className="panel-head"><h3>Recent orders</h3><Link to="/admin/orders" className="link-arrow small">All orders <Icon name="arrow" size={14} /></Link></div>
        <OrdersTable orders={orders.slice(0, 5)} />
      </section>
    </>
  )
}

function OrdersTable({ orders }) {
  const navigate = useNavigate()
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Order</th><th>Date</th><th>Customer</th><th>Payment</th><th>Status</th><th className="r">Total</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} onClick={() => navigate(`/admin/orders/${o.id}`)} className="clickable">
              <td><b>{o.id}</b></td>
              <td>{new Date(o.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
              <td>{o.customer}<small className="block muted">{o.city}</small></td>
              <td>{o.payment}</td>
              <td><StatusPill status={o.status} /></td>
              <td className="r num">{formatINR(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Orders() {
  const { orders } = useStore()
  const [tab, setTab] = useState('all')
  const tabs = { all: () => true, new: (o) => o.status <= 1, ship: (o) => o.status >= 2 && o.status <= 4, done: (o) => o.status === 5 }
  const list = orders.filter(tabs[tab])
  return (
    <>
      <div className="admin-head"><h1>Orders</h1><button className="btn btn-line btn-sm">Export CSV</button></div>
      <div className="tabs tabs-line">
        {[['all', 'All'], ['new', 'New'], ['ship', 'In transit'], ['done', 'Delivered']].map(([k, l]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l} <span className="muted">{orders.filter(tabs[k]).length}</span></button>
        ))}
      </div>
      <section className="panel"><OrdersTable orders={list} /></section>
    </>
  )
}

function OrderDetail() {
  const { id } = useParams()
  const { orders, updateOrderStatus, notify } = useStore()
  const o = orders.find((x) => x.id === id)
  const [awb, setAwb] = useState(o?.awb || '')
  if (!o) return <p>Order not found. <Link to="/admin/orders" className="link-u">Back</Link></p>
  return (
    <>
      <Link to="/admin/orders" className="link-btn">← Orders</Link>
      <div className="admin-head"><div><h1>{o.id}</h1><p className="muted">{o.date} · {o.payment}</p></div><StatusPill status={o.status} /></div>
      <div className="admin-grid">
        <section className="panel">
          <div className="panel-head"><h3>Items</h3></div>
          <OrderItems order={o} />
          <div className="row-between total"><span>Total</span><span>{formatINR(o.total)}</span></div>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Customer</h3></div>
          <p><b>{o.customer}</b><br />{o.email}<br />{o.phone}<br />{o.address ? `${o.address.line1}, ${o.address.city} ${o.address.pincode}` : o.city}</p>
        </section>
      </div>
      <div className="admin-grid">
        <section className="panel">
          <div className="panel-head"><h3>Fulfilment</h3></div>
          <label className="field"><span>Update status</span>
            <select id="order-status" className="input" value={o.status} onChange={(e) => { updateOrderStatus(o.id, Number(e.target.value)); notify('Status updated · customer notified') }}>
              {ORDER_STEPS.map((s, i) => <option key={s} value={i}>{s}</option>)}
            </select>
          </label>
          <label className="field"><span>Courier AWB number</span>
            <div className="pin-row"><input id="order-awb" className="input" value={awb} onChange={(e) => setAwb(e.target.value)} placeholder="e.g. BD7744120983" /><button className="btn btn-line" onClick={() => notify('Tracking number saved')}>Save</button></div>
          </label>
          <div className="btn-row"><button className="btn btn-line btn-sm">Print invoice</button><button className="btn btn-line btn-sm">Shipping label</button><button className="btn btn-line btn-sm danger">Cancel order</button></div>
        </section>
        <section className="panel"><div className="panel-head"><h3>Timeline</h3></div><Timeline order={o} /></section>
      </div>
    </>
  )
}

const EMPTY = { name: '', category: 'rings', metal: METALS[0], price: '', mrp: '', stock: 10, images: ['photo-1605100804763-247f67b3557e', 'photo-1515562141207-7a88fb7ce338'] }

function Products() {
  const { notify } = useStore()
  const [items, setItems] = useState(PRODUCTS.map((p) => ({ ...p, live: true })))
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [edit, setEdit] = useState(null)
  const [confirmDel, setConfirmDel] = useState(null)
  const list = items.filter((p) => (!cat || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()))

  const save = (e) => {
    e.preventDefault()
    const data = { ...edit, price: Number(edit.price), mrp: Number(edit.mrp || edit.price), stock: Number(edit.stock) }
    if (data.id) setItems(items.map((p) => (p.id === data.id ? data : p)))
    else setItems([{ ...data, id: 'new-' + Date.now(), sku: 'CRS-NEW', live: true, reviews: 0, rating: 0 }, ...items])
    setEdit(null); notify(data.id ? 'Product updated' : 'Product added')
  }

  return (
    <>
      <div className="admin-head"><h1>Products</h1><button className="btn btn-dark btn-sm" onClick={() => setEdit({ ...EMPTY })}>+ Add product</button></div>
      <div className="toolbar">
        <div className="admin-search"><Icon name="search" size={18} /><input id="prod-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" /></div>
        <select id="prod-cat" className="input" value={cat} onChange={(e) => setCat(e.target.value)}><option value="">All categories</option>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select>
      </div>
      <section className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Product</th><th>Category</th><th>Metal</th><th className="r">Price</th><th className="r">Stock</th><th>Live</th><th></th></tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td><div className="t-prod"><Img id={p.images[0]} w={120} alt="" /><div><b>{p.name}</b><small className="block muted">{p.sku}</small></div></div></td>
                  <td className="cap">{p.category}</td>
                  <td>{p.metal}</td>
                  <td className="r num">{formatINR(p.price)}</td>
                  <td className="r num"><span className={p.stock <= 4 ? 'warn-text' : ''}>{p.stock}</span></td>
                  <td><button className={`switch ${p.live ? 'on' : ''}`} onClick={() => setItems(items.map((x) => (x.id === p.id ? { ...x, live: !x.live } : x)))} aria-label="Toggle visibility"><i /></button></td>
                  <td className="r nowrap">
                    <button className="icon-btn" onClick={() => setEdit({ ...p })} aria-label="Edit"><Icon name="edit" size={16} /></button>
                    <button className="icon-btn" onClick={() => setConfirmDel(p)} aria-label="Delete"><Icon name="trash" size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {edit && (
        <div className="modal-bg" onClick={() => setEdit(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className="side-head"><h3>{edit.id ? 'Edit product' : 'Add product'}</h3><button type="button" className="icon-btn" onClick={() => setEdit(null)} aria-label="Close"><Icon name="close" /></button></div>
            <div className="form-grid">
              <label className="field"><span>Product name</span><input id="pm-name" className="input" required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
              <label className="field half"><span>Category</span><select id="pm-cat" className="input" value={edit.category} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>{CATEGORIES.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
              <label className="field half"><span>Metal</span><select id="pm-metal" className="input" value={edit.metal} onChange={(e) => setEdit({ ...edit, metal: e.target.value })}>{METALS.map((m) => <option key={m}>{m}</option>)}</select></label>
              <label className="field half"><span>Selling price (₹)</span><input id="pm-price" className="input" type="number" required value={edit.price} onChange={(e) => setEdit({ ...edit, price: e.target.value })} /></label>
              <label className="field half"><span>MRP (₹)</span><input id="pm-mrp" className="input" type="number" value={edit.mrp} onChange={(e) => setEdit({ ...edit, mrp: e.target.value })} /></label>
              <label className="field half"><span>Stock</span><input id="pm-stock" className="input" type="number" value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: e.target.value })} /></label>
              <label className="field half"><span>Images</span><input id="pm-images" className="input" type="file" multiple accept="image/*" /></label>
              <label className="field"><span>Description</span><textarea id="pm-desc" className="input" rows={3} value={edit.description || ''} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
            </div>
            <div className="btn-row end"><button type="button" className="btn btn-line" onClick={() => setEdit(null)}>Cancel</button><button className="btn btn-dark">Save product</button></div>
          </form>
        </div>
      )}
      {confirmDel && (
        <div className="modal-bg" onClick={() => setConfirmDel(null)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h3>Delete “{confirmDel.name}”?</h3>
            <p className="muted">This removes the product from the store. Past orders keep their record.</p>
            <div className="btn-row end"><button className="btn btn-line" onClick={() => setConfirmDel(null)}>Keep it</button><button className="btn btn-dark" onClick={() => { setItems(items.filter((x) => x.id !== confirmDel.id)); setConfirmDel(null); notify('Product deleted') }}>Delete</button></div>
          </div>
        </div>
      )}
    </>
  )
}

function Inventory() {
  const { notify } = useStore()
  const [stock, setStock] = useState(() => Object.fromEntries(PRODUCTS.map((p) => [p.id, p.stock])))
  const sorted = useMemo(() => [...PRODUCTS].sort((a, b) => stock[a.id] - stock[b.id]), []) // eslint-disable-line
  return (
    <>
      <div className="admin-head"><div><h1>Inventory</h1><p className="muted">{PRODUCTS.filter((p) => stock[p.id] <= 4).length} pieces are low on stock.</p></div></div>
      <section className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Product</th><th>SKU</th><th>Status</th><th className="r">In stock</th></tr></thead>
            <tbody>
              {sorted.map((p) => (
                <tr key={p.id}>
                  <td><div className="t-prod"><Img id={p.images[0]} w={120} alt="" /><b>{p.name}</b></div></td>
                  <td className="muted">{p.sku}</td>
                  <td>{stock[p.id] === 0 ? <span className="pill pill-warn">Out of stock</span> : stock[p.id] <= 4 ? <span className="pill pill-warn">Low</span> : <span className="pill pill-ok">In stock</span>}</td>
                  <td className="r"><input id={`stock-${p.id}`} className="input input-num" type="number" min="0" value={stock[p.id]} onChange={(e) => setStock({ ...stock, [p.id]: Number(e.target.value) })} onBlur={() => notify('Stock updated')} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Customers() {
  return (
    <>
      <div className="admin-head"><h1>Customers</h1><button className="btn btn-line btn-sm">Export</button></div>
      <section className="panel">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Customer</th><th>City</th><th>Joined</th><th className="r">Orders</th><th className="r">Lifetime spend</th></tr></thead>
            <tbody>
              {DEMO_CUSTOMERS.map((c) => (
                <tr key={c.email}>
                  <td><div className="t-prod"><div className="avatar sm">{c.name[0]}</div><div><b>{c.name}</b><small className="block muted">{c.email}</small></div></div></td>
                  <td>{c.city}</td><td>{c.joined}</td><td className="r num">{c.orders}</td><td className="r num">{formatINR(c.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function Coupons() {
  const { notify } = useStore()
  const [list, setList] = useState(DEMO_COUPONS)
  const [f, setF] = useState({ code: '', type: '10% off', min: '' })
  return (
    <>
      <div className="admin-head"><h1>Coupons & offers</h1></div>
      <div className="admin-grid">
        <section className="panel">
          <div className="table-wrap">
            <table className="table">
              <thead><tr><th>Code</th><th>Offer</th><th className="r">Min. order</th><th className="r">Uses</th><th>Status</th><th>Expires</th></tr></thead>
              <tbody>{list.map((c) => (
                <tr key={c.code}><td><b className="mono">{c.code}</b></td><td>{c.type}</td><td className="r num">{c.min ? formatINR(c.min) : '—'}</td><td className="r num">{c.uses}</td><td><span className={`pill ${c.status === 'Active' ? 'pill-ok' : 'pill-neutral'}`}>{c.status}</span></td><td>{c.expires}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </section>
        <form className="panel" onSubmit={(e) => { e.preventDefault(); if (!f.code) return; setList([{ code: f.code.toUpperCase(), type: f.type, min: Number(f.min) || 0, uses: 0, status: 'Active', expires: 'No expiry' }, ...list]); setF({ code: '', type: '10% off', min: '' }); notify('Coupon created') }}>
          <div className="panel-head"><h3>New coupon</h3></div>
          <label className="field"><span>Code</span><input id="cp-code" className="input" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="FESTIVE20" /></label>
          <label className="field"><span>Offer</span><select id="cp-type" className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>{['10% off', '15% off', '20% off', '₹500 off', '₹1,000 off', 'Free shipping'].map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="field"><span>Minimum order (₹)</span><input id="cp-min" className="input" type="number" value={f.min} onChange={(e) => setF({ ...f, min: e.target.value })} /></label>
          <button className="btn btn-dark btn-block">Create coupon</button>
        </form>
      </div>
    </>
  )
}

function Settings() {
  const { notify } = useStore()
  return (
    <>
      <div className="admin-head"><h1>Store settings</h1></div>
      <form className="panel form-grid narrow" onSubmit={(e) => { e.preventDefault(); notify('Settings saved') }}>
        <label className="field half"><span>Store name</span><input id="st-name" className="input" defaultValue="Caresa" /></label>
        <label className="field half"><span>Support email</span><input id="st-email" className="input" defaultValue="care@caresa.in" /></label>
        <label className="field half"><span>Free shipping above (₹)</span><input id="st-free" className="input" type="number" defaultValue={999} /></label>
        <label className="field half"><span>Today's gold rate, 22K (₹/g)</span><input id="st-gold" className="input" type="number" defaultValue={7240} /></label>
        <label className="field half"><span>GSTIN</span><input id="st-gst" className="input" defaultValue="08AAKCC1234F1Z5" /></label>
        <label className="field half"><span>Payment gateway</span><select id="st-pg" className="input"><option>Razorpay</option><option>Cashfree</option><option>PhonePe PG</option></select></label>
        <label className="check"><input type="checkbox" defaultChecked /><span>Enable cash on delivery</span></label>
        <label className="check"><input type="checkbox" defaultChecked /><span>Send WhatsApp order updates</span></label>
        <button className="btn btn-dark">Save settings</button>
      </form>
    </>
  )
}
