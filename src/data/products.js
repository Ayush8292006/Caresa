// Demo catalogue. Backend team: replace with GET /api/products
// Images are real photos served from Unsplash CDN (swap with your own product shoots later).
export const img = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMAGES = {
  heroRing: 'photo-1605100804763-247f67b3557e',
  heroNecklace: 'photo-1599643478518-a784e5dc4c8f',
  heroModel: 'photo-1611591437281-460bfbe1220a',
  rings: 'photo-1515562141207-7a88fb7ce338',
  earrings: 'photo-1535632066927-ab7c9ab60908',
  bracelets: 'photo-1573408301185-9146fe634ad0',
  necklaces: 'photo-1602173574767-37ac01994b2a',
  bangles: 'photo-1611652022419-a9419f74343d',
  pendants: 'photo-1601121141461-9d6647bca1ed',
  bridal: 'photo-1610375461246-83df859d849d',
  gifting: 'photo-1549465220-1a8b9238cd48',
  craft: 'photo-1617038220319-276d3cfab638',
  studio: 'photo-1588444837495-c6cfeb53f32d',
}

export const CATEGORIES = [
  { slug: 'rings', name: 'Rings', subtitle: 'Solitaires, Bands & Halos', image: IMAGES.rings, count: 5 },
  { slug: 'necklaces', name: 'Necklaces', subtitle: 'Chokers, Chains & Collars', image: IMAGES.necklaces, count: 4 },
  { slug: 'earrings', name: 'Earrings', subtitle: 'Studs, Hoops & Drops', image: IMAGES.earrings, count: 5 },
  { slug: 'bracelets', name: 'Bracelets', subtitle: 'Tennis, Cuffs & Chains', image: IMAGES.bracelets, count: 3 },
  { slug: 'bangles', name: 'Bangles', subtitle: 'Kadas & Stackable Pairs', image: IMAGES.bangles, count: 2 },
  { slug: 'pendants', name: 'Pendants', subtitle: 'Motifs & Monograms', image: IMAGES.pendants, count: 3 },
]

export const METALS = ['18K Yellow Gold', '14K Rose Gold', '925 Sterling Silver']

const P = (id, name, category, metal, price, mrp, images, extra = {}) => ({
  id,
  name,
  category,
  metal,
  price,
  mrp,
  images,
  rating: extra.rating ?? 4.7,
  reviews: extra.reviews ?? 48,
  badge: extra.badge ?? null,
  stock: extra.stock ?? 12,
  collection: extra.collection ?? 'Everyday',
  sizes: category === 'rings' ? ['6', '7', '8', '9', '10', '11', '12'] : category === 'bangles' ? ['2.4', '2.6', '2.8'] : null,
  weight: extra.weight ?? '2.4 g',
  sku: 'CRS-' + id.toUpperCase().slice(0, 6),
  purity: metal.includes('18K') ? '18K (750 Hallmark)' : metal.includes('14K') ? '14K (585 Hallmark)' : '925 Sterling Silver',
  stones: metal.includes('Silver') ? 'Hand-cut Cubic Zirconia' : 'Natural Diamonds (VS-GH Grade)',
  certification: metal.includes('Silver') ? '925 Purity Stamped' : 'BIS 916 Hallmark & IGI Certified',
  dimensions: extra.dimensions ?? 'Standard fine jewellery proportions',
  origin: 'Jaipur Atelier, Rajasthan',
  description: extra.description ??
    'Hand-finished in our Jaipur atelier, this piece is cast in solid metal and polished by hand for a soft, lasting shine. Lightweight enough for every day, refined enough for every occasion.',
})

export const PRODUCTS = [
  P('aurelia-solitaire', 'Aurelia Solitaire Ring', 'rings', '18K Yellow Gold', 24990, 28990,
    ['photo-1605100804763-247f67b3557e', 'photo-1515562141207-7a88fb7ce338'],
    { badge: 'Bestseller', rating: 4.9, reviews: 212, collection: 'Bridal', weight: '3.1 g', dimensions: '1.8mm band width, 5.2mm center solitaire' }),
  P('noor-halo', 'Noor Halo Ring', 'rings', '14K Rose Gold', 18490, 21000,
    ['photo-1588444837495-c6cfeb53f32d', 'photo-1605100804763-247f67b3557e'],
    { reviews: 96, dimensions: 'Micro-pavé halo, 7mm head' }),
  P('ivy-band', 'Ivy Stacking Band', 'rings', '925 Sterling Silver', 3490, 3990,
    ['photo-1606760227091-3dd870d97f1d', 'photo-1515562141207-7a88fb7ce338'],
    { badge: 'New', reviews: 31, dimensions: '2.0mm textured organic band' }),
  P('celeste-eternity', 'Celeste Eternity Band', 'rings', '18K Yellow Gold', 32990, 36500,
    ['photo-1631982690223-8aa4be0a2497', 'photo-1588444837495-c6cfeb53f32d'],
    { collection: 'Bridal', rating: 4.8, reviews: 74, stock: 3, weight: '3.8 g' }),
  P('luna-pave-band', 'Luna Pavé Diamond Band', 'rings', '925 Sterling Silver', 4990, 5990,
    ['photo-1515562141207-7a88fb7ce338', 'photo-1606760227091-3dd870d97f1d'],
    { reviews: 42, weight: '2.1 g', dimensions: '1.5mm pavé contoured profile' }),

  P('meher-layered', 'Meher Layered Necklace', 'necklaces', '18K Yellow Gold', 15990, 18990,
    ['photo-1599643478518-a784e5dc4c8f', 'photo-1602173574767-37ac01994b2a'],
    { badge: 'Bestseller', rating: 4.8, reviews: 168, weight: '5.6 g', dimensions: '16 + 2 inch adjustable chain' }),
  P('pearl-whisper', 'Pearl Whisper Choker', 'necklaces', '925 Sterling Silver', 5490, 6490,
    ['photo-1602173574767-37ac01994b2a', 'photo-1599643478518-a784e5dc4c8f'],
    { reviews: 59, dimensions: '14-inch choker with freshwater seed pearls' }),
  P('rani-bridal', 'Rani Bridal Collar', 'necklaces', '18K Yellow Gold', 89990, 98000,
    ['photo-1610375461246-83df859d849d', 'photo-1599643478518-a784e5dc4c8f'],
    { collection: 'Bridal', badge: 'Limited', rating: 5.0, reviews: 22, stock: 2, weight: '24.8 g' }),
  P('araya-emerald-pendant', 'Araya Deco Choker', 'necklaces', '18K Yellow Gold', 28990, 32900,
    ['photo-1602173574767-37ac01994b2a', 'photo-1610375461246-83df859d849d'],
    { badge: 'New', reviews: 19, weight: '7.4 g' }),

  P('lumi-drops', 'Lumi Drop Earrings', 'earrings', '14K Rose Gold', 8990, 10490,
    ['photo-1535632066927-ab7c9ab60908', 'photo-1617038220319-276d3cfab638'],
    { badge: 'New', reviews: 44, dimensions: '22mm drop length' }),
  P('soleil-hoops', 'Soleil Hoops', 'earrings', '18K Yellow Gold', 11490, 12990,
    ['photo-1630019852942-f89202989a59', 'photo-1535632066927-ab7c9ab60908'],
    { badge: 'Bestseller', rating: 4.9, reviews: 301, dimensions: '14mm diameter' }),
  P('tara-studs', 'Tara Diamond Studs', 'earrings', '18K Yellow Gold', 19990, 22990,
    ['photo-1617038220319-276d3cfab638', 'photo-1630019852942-f89202989a59'],
    { reviews: 87, weight: '1.8 g' }),
  P('mist-jhumka', 'Mist Silver Jhumka', 'earrings', '925 Sterling Silver', 2990, 3490,
    ['photo-1596944924616-7b38e7cfac36', 'photo-1535632066927-ab7c9ab60908'],
    { reviews: 129, weight: '6.2 g' }),
  P('mahrani-heritage-jhumka', 'Mahrani Heritage Jhumka', 'earrings', '18K Yellow Gold', 46990, 52000,
    ['photo-1535632066927-ab7c9ab60908', 'photo-1596944924616-7b38e7cfac36'],
    { collection: 'Bridal', badge: 'Limited', rating: 4.9, reviews: 36, weight: '16.4 g' }),

  P('ember-tennis', 'Ember Tennis Bracelet', 'bracelets', '18K Yellow Gold', 42990, 47990,
    ['photo-1573408301185-9146fe634ad0', 'photo-1611591437281-460bfbe1220a'],
    { badge: 'Limited', rating: 4.9, reviews: 38, stock: 4, weight: '8.4 g', dimensions: '7-inch length with safety clasp' }),
  P('vine-cuff', 'Vine Open Cuff', 'bracelets', '925 Sterling Silver', 4290, 4990,
    ['photo-1611591437281-460bfbe1220a', 'photo-1573408301185-9146fe634ad0'],
    { reviews: 63, weight: '9.8 g', dimensions: 'Adjustable open cuff profile' }),
  P('sahara-mesh-cuff', 'Sahara Mesh Cuff', 'bracelets', '14K Rose Gold', 24490, 27500,
    ['photo-1573408301185-9146fe634ad0', 'photo-1611591437281-460bfbe1220a'],
    { badge: 'New', reviews: 29, weight: '11.2 g' }),

  P('kesar-bangles', 'Kesar Bangle Pair', 'bangles', '18K Yellow Gold', 54990, 59990,
    ['photo-1611652022419-a9419f74343d', 'photo-1610375461246-83df859d849d'],
    { collection: 'Bridal', reviews: 27, weight: '14.2 g' }),
  P('lotus-pendant', 'Lotus Pendant', 'pendants', '14K Rose Gold', 7490, 8490,
    ['photo-1601121141461-9d6647bca1ed', 'photo-1599643478518-a784e5dc4c8f'],
    { badge: 'New', reviews: 52, dimensions: '12mm motif on 18-inch cable chain' }),
  P('initial-pendant', 'Monogram Initial Pendant', 'pendants', '18K Yellow Gold', 9990, 11490,
    ['photo-1612817288484-6f916006741a', 'photo-1601121141461-9d6647bca1ed'],
    { badge: 'Personalise', rating: 4.8, reviews: 140, dimensions: '10mm medallion with custom letter engraving' }),
]

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id)

export const formatINR = (n) =>
  '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export const ORDER_STEPS = ['Order Placed', 'Confirmed', 'Packed in Atelier', 'Dispatched', 'Out for Delivery', 'Delivered']

export const COUPONS = {
  CARESA10: 0.1,
  FIRSTLOVE: 0.15,
  DIWALI26: 0.2,
}

export const TESTIMONIALS = [
  {
    name: 'Ananya R.',
    city: 'Mumbai',
    piece: 'Aurelia Solitaire Ring',
    text: 'The Aurelia ring is even more breathtaking in person. The packaging felt like opening a priceless heirloom keepsake.',
    rating: 5,
  },
  {
    name: 'Ishita M.',
    city: 'Delhi',
    piece: 'Soleil 18K Hoops',
    text: 'Wore the Soleil hoops every single day for six months — through work, travel and weddings. Not a scratch, still radiantly glowing.',
    rating: 5,
  },
  {
    name: 'Riya & Karan',
    city: 'Bengaluru',
    piece: 'Custom Engraved Wedding Bands',
    text: 'Our wedding bands came engraved precisely as we dreamed. Caresa concierge handled every bespoke detail with such grace.',
    rating: 5,
  },
  {
    name: 'Dr. Meera J.',
    city: 'Pune',
    piece: 'Ember Tennis Bracelet',
    text: 'The stones are so clean and catch the light from across the room. True luxury craftsmanship that honors Jaipur’s heritage.',
    rating: 5,
  },
]
