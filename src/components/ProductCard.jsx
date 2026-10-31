import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Icon } from './Common'
import { formatINR } from '../data/products'

export default function ProductCard({ p }) {
  const { toggleWish, wishlist, addToCart } = useStore()
  const saved = wishlist.includes(p.id)
  const off = Math.round((1 - p.price / p.mrp) * 100)
  return (
    <article className="pcard">
      <Link to={`/product/${p.id}`} className="pcard-media">
        <Img id={p.images[0]} w={700} alt={p.name} className="pc-img a" />
        <Img id={p.images[1]} w={700} alt="" className="pc-img b" />
        {p.badge && <span className="badge">{p.badge}</span>}
      </Link>
      <button className={`wish ${saved ? 'on' : ''}`} onClick={() => toggleWish(p.id)} aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}>
        <Icon name="heart" size={18} />
      </button>
      <button className="quick-add" onClick={() => addToCart(p.id, 1, p.sizes ? p.sizes[1] : null)}>
        {p.sizes ? 'Add · Size ' + p.sizes[1] : 'Add to Bag'}
      </button>
      <div className="pcard-info">
        <p className="pc-metal">{p.metal}</p>
        <Link to={`/product/${p.id}`} className="pc-name">{p.name}</Link>
        <p className="pc-price">
          <span>{formatINR(p.price)}</span>
          <s>{formatINR(p.mrp)}</s>
          <em>{off}% off</em>
        </p>
      </div>
    </article>
  )
}
