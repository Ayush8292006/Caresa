import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { Bow, Breadcrumb, Reveal } from '../components/Common'
import { PRODUCTS } from '../data/products'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))
  return (
    <div className="wrap page-pad">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Wishlist']} />
      <h1 className="page-title">Wishlist</h1>
      {items.length === 0 ? (
        <div className="empty big"><Bow size={60} /><p>Nothing saved yet. Tap the heart on any piece you love.</p><Link to="/shop" className="btn btn-dark">Browse Jewellery</Link></div>
      ) : (
        <div className="pgrid">{items.map((p, i) => <Reveal key={p.id} delay={i * 60}><ProductCard p={p} /></Reveal>)}</div>
      )}
    </div>
  )
}
