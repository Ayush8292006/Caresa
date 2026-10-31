// Demo admin + order data. Backend team: replace with real API responses.
export const DEMO_ORDERS = [
  {
    id: 'CRS10248', date: '2026-10-28', customer: 'Ananya Rao', email: 'ananya@example.com', phone: '98200 11223',
    city: 'Mumbai', status: 3, payment: 'UPI', courier: 'BlueDart', awb: 'BD7744120983',
    items: [{ id: 'aurelia-solitaire', qty: 1, size: '7' }, { id: 'soleil-hoops', qty: 1 }],
    total: 36480,
    history: ['28 Oct, 10:12 AM', '28 Oct, 11:40 AM', '29 Oct, 4:05 PM', '30 Oct, 9:30 AM'],
  },
  {
    id: 'CRS10247', date: '2026-10-27', customer: 'Ishita Mehra', email: 'ishita@example.com', phone: '98110 44556',
    city: 'Delhi', status: 5, payment: 'Card', courier: 'Delhivery', awb: 'DL5521980012',
    items: [{ id: 'meher-layered', qty: 1 }], total: 15990,
    history: ['24 Oct, 2:10 PM', '24 Oct, 3:00 PM', '25 Oct, 11:20 AM', '25 Oct, 6:45 PM', '27 Oct, 9:10 AM', '27 Oct, 1:32 PM'],
  },
  { id: 'CRS10246', date: '2026-10-27', customer: 'Riya Kapoor', email: 'riya@example.com', phone: '99000 77881', city: 'Bengaluru', status: 1, payment: 'COD', items: [{ id: 'celeste-eternity', qty: 2, size: '8' }], total: 65980, history: ['27 Oct, 8:05 PM', '27 Oct, 9:15 PM'] },
  { id: 'CRS10245', date: '2026-10-26', customer: 'Sneha Iyer', email: 'sneha@example.com', phone: '98450 22114', city: 'Chennai', status: 0, payment: 'UPI', items: [{ id: 'lumi-drops', qty: 1 }, { id: 'lotus-pendant', qty: 1 }], total: 16480, history: ['26 Oct, 7:40 PM'] },
  { id: 'CRS10244', date: '2026-10-25', customer: 'Meera Joshi', email: 'meera@example.com', phone: '97690 55443', city: 'Pune', status: 4, payment: 'Card', courier: 'BlueDart', awb: 'BD7744120871', items: [{ id: 'ember-tennis', qty: 1 }], total: 42990, history: ['22 Oct', '22 Oct', '23 Oct', '24 Oct', '25 Oct'] },
  { id: 'CRS10243', date: '2026-10-24', customer: 'Aditi Sharma', email: 'aditi@example.com', phone: '98290 66778', city: 'Jaipur', status: 2, payment: 'UPI', items: [{ id: 'mist-jhumka', qty: 2 }], total: 5980, history: ['24 Oct', '24 Oct', '25 Oct'] },
]

export const DEMO_CUSTOMERS = [
  { name: 'Ananya Rao', email: 'ananya@example.com', city: 'Mumbai', orders: 6, spent: 128400, joined: 'Jan 2025' },
  { name: 'Ishita Mehra', email: 'ishita@example.com', city: 'Delhi', orders: 3, spent: 41270, joined: 'Mar 2025' },
  { name: 'Riya Kapoor', email: 'riya@example.com', city: 'Bengaluru', orders: 2, spent: 65980, joined: 'Aug 2026' },
  { name: 'Sneha Iyer', email: 'sneha@example.com', city: 'Chennai', orders: 4, spent: 38920, joined: 'Nov 2025' },
  { name: 'Meera Joshi', email: 'meera@example.com', city: 'Pune', orders: 1, spent: 42990, joined: 'Oct 2026' },
  { name: 'Aditi Sharma', email: 'aditi@example.com', city: 'Jaipur', orders: 5, spent: 22450, joined: 'Jun 2025' },
]

export const SALES_LAST_12 = [
  { m: 'Nov', v: 4.2 }, { m: 'Dec', v: 6.8 }, { m: 'Jan', v: 3.9 }, { m: 'Feb', v: 5.6 },
  { m: 'Mar', v: 4.8 }, { m: 'Apr', v: 5.1 }, { m: 'May', v: 6.2 }, { m: 'Jun', v: 5.4 },
  { m: 'Jul', v: 5.9 }, { m: 'Aug', v: 7.1 }, { m: 'Sep', v: 6.6 }, { m: 'Oct', v: 8.9 },
] // ₹ lakh

export const DEMO_COUPONS = [
  { code: 'CARESA10', type: '10% off', min: 2000, uses: 342, status: 'Active', expires: '31 Dec 2026' },
  { code: 'FIRSTLOVE', type: '15% off', min: 0, uses: 128, status: 'Active', expires: 'No expiry' },
  { code: 'DIWALI26', type: '₹1,500 off', min: 15000, uses: 611, status: 'Active', expires: '05 Nov 2026' },
  { code: 'TEEJ25', type: '₹1,000 off', min: 10000, uses: 207, status: 'Expired', expires: '30 Aug 2026' },
]
