import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import { Bow, Breadcrumb, Reveal, Icon } from '../components/Common'
import { PRODUCTS } from '../data/products'

export default function Wishlist() {
  const { wishlist, addToCart, notify } = useStore()
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id))

  const handleAddAll = () => {
    if (items.length === 0) return
    items.forEach((p) => {
      addToCart(p.id, 1, p.sizes ? p.sizes[1] || p.sizes[0] : null)
    })
    notify(`Added ${items.length} pieces from your wishlist to your bag`, 'success')
  }

  return (
    <div className="wrap page-pad wishlist-page">
      <Breadcrumb items={[<Link to="/" key="h">Home</Link>, 'Saved Heirlooms']} />

      <div className="wishlist-head row-between wrap-gap">
        <div>
          <h1 className="page-title">Saved Pieces</h1>
          <p className="muted">
            {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved for your private collection
          </p>
        </div>

        {items.length > 0 && (
          <div className="btn-row">
            <button className="btn btn-dark" onClick={handleAddAll}>
              <Icon name="bag" size={16} /> Add All Pieces to Bag
            </button>
            <Link to="/shop" className="btn btn-line">
              Explore More Pieces
            </Link>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty big">
          <Bow size={64} />
          <h2>Your wishlist is waiting</h2>
          <p className="muted">
            Tap the heart icon on any piece you love to save it to your private selection.
          </p>
          <Link to="/shop" className="btn btn-dark">
            Discover Fine Jewellery
          </Link>
        </div>
      ) : (
        <div className="pgrid">
          {items.map((p, i) => (
            <Reveal key={p.id} delay={i * 60} effect="fade-up">
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
