import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { Img, Icon, Stars } from './Common'
import { formatINR } from '../data/products'

export default function ProductCard({ p }) {
  const { toggleWish, wishlist, addToCart, openQuickView } = useStore()
  const saved = wishlist.includes(p.id)
  const off = Math.round((1 - p.price / p.mrp) * 100)

  return (
    <article className="pcard">
      <div className="pcard-media-wrap">
        <Link to={`/product/${p.id}`} className="pcard-media" aria-label={`View ${p.name}`}>
          <Img id={p.images[0]} w={700} alt={p.name} className="pc-img a" />
          {p.images[1] && <Img id={p.images[1]} w={700} alt="" className="pc-img b" />}
          {p.badge && <span className={`badge badge-${p.badge.toLowerCase().replace(/\s+/g, '-')}`}>{p.badge}</span>}
        </Link>

        {/* Wishlist Button */}
        <button
          className={`wish ${saved ? 'on' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            toggleWish(p.id)
          }}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Icon name="heart" size={17} />
        </button>

        {/* Hover Actions Toolbar */}
        <div className="pcard-hover-actions">
          <button
            className="pcard-action-btn qv-btn"
            onClick={(e) => {
              e.preventDefault()
              openQuickView(p.id)
            }}
            title="Quick View"
            aria-label={`Quick view ${p.name}`}
          >
            <Icon name="eye" size={15} />
            <span>Quick View</span>
          </button>

          <button
            className="pcard-action-btn qa-btn"
            onClick={(e) => {
              e.preventDefault()
              addToCart(p.id, 1, p.sizes ? p.sizes[1] || p.sizes[0] : null)
            }}
            aria-label={`Add ${p.name} to bag`}
          >
            <Icon name="bag" size={15} />
            <span>{p.sizes ? `Add · ${p.sizes[1] || p.sizes[0]}` : 'Add to Bag'}</span>
          </button>
        </div>
      </div>

      <div className="pcard-info">
        <div className="pc-top-row">
          <span className="pc-metal">{p.metal}</span>
          <div className="pc-rating">
            <Stars value={p.rating} size="xs" />
            <span className="pc-rev-count">({p.reviews})</span>
          </div>
        </div>

        <Link to={`/product/${p.id}`} className="pc-name" title={p.name}>
          {p.name}
        </Link>

        <div className="pc-price">
          <span className="pc-curr">{formatINR(p.price)}</span>
          <s className="pc-mrp">{formatINR(p.mrp)}</s>
          <span className="pc-badge-off">{off}% off</span>
        </div>
      </div>
    </article>
  )
}
