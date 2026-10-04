// Every value here can be overridden from the admin page (stored in the Supabase "settings" table).
// Text marked as sample is placeholder copy: edit it in the admin page.
export const DEFAULTS = {
  brand: { name: 'cookwithdavid', logo_url: '' },
  contact: { phone: '+233 000 000 000', email: 'hello@cookwithdavid.com', address: 'Accra, Ghana', hours: 'Mon - Sun: 8:00 AM - 10:00 PM' },
  cta: { primary: 'Order Now', secondary: 'Contact Us' },
  nav: [
    { label: 'Home', href: '/' }, { label: 'Menu', href: '/menu' }, { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }, { label: 'Branches', href: '/branches' },
  ],
  hero: {
    badge: 'Fresh. Hot. Made to order.',
    headline: 'Taste the best of Ghanaian cooking',
    sub: 'Hearty favourites and fast food classics, made fresh and delivered to your door.',
  },
  stats: { years: 5, staff: 20, locations: 1, customers: 1000 },
  popular: { title: 'Our Popular Menu', sub: 'Our most loved dishes, cooked fresh and served with care.' },
  why: {
    title: 'Why Choose Us',
    sub: 'Good food is the start. Here is what keeps people coming back.',
    items: [
      { icon: 'plate', title: 'Expert Cooks', text: 'Every dish is prepared by cooks who care about the details.' },
      { icon: 'leaf', title: 'Fresh Ingredients', text: 'We buy fresh and cook to order, never ahead of time.' },
      { icon: 'bolt', title: 'Fast Service', text: 'Quick preparation without cutting corners on taste.' },
      { icon: 'shield', title: 'Quality Assured', text: 'Consistent quality in every plate, every day.' },
      { icon: 'truck', title: 'Quick Delivery', text: 'Hot food at your door, or ready for pickup at a branch.' },
      { icon: 'heart', title: 'Made with Love', text: 'Every meal is made with care and a passion for good food.' },
    ],
  },
  cta_band: { title: 'Hungry? Order now', sub: 'Pick your favourites and we will get cooking.' },
  about: {
    badge: 'Our story', title: 'Food made with passion',
    sub: 'A kitchen built on fresh ingredients, honest prices and fast, friendly service.',
    mission: 'To serve affordable, quality food and great service to everyone, celebrating Ghana\u2019s food heritage with modern convenience.',
    vision: 'To be the most loved name in food and hospitality, known for quality and outstanding customer service.',
    values: [
      { icon: 'heart', title: 'Passion', text: 'We pour our hearts into every dish.' },
      { icon: 'shield', title: 'Quality', text: 'Only the finest ingredients make it to your plate.' },
      { icon: 'leaf', title: 'Community', text: 'Proud to be part of Ghana\u2019s food culture.' },
      { icon: 'bolt', title: 'Speed', text: 'Fast service without compromising taste.' },
    ],
  },
  footer: {
    about: 'Fresh, hot food made to order. Quality ingredients, fast service, great taste.',
    credit: 'Built by @devwithdav',
  },
  policies: [
    { id: 'privacy', title: 'Privacy Policy', body: 'Sample text: we only collect the details needed to prepare and deliver your order, and we never sell your information.' },
    { id: 'terms', title: 'Terms and Conditions', body: 'Sample text: by placing an order you agree to provide correct contact and delivery details and to pay in full before or on delivery.' },
    { id: 'refund', title: 'Refund Policy', body: 'Sample text: if something is wrong with your order, contact us within 24 hours with your order reference and we will make it right.' },
    { id: 'orders', title: 'Orders and Delivery', body: 'Sample text: delivery times depend on distance and demand. Pickup orders are ready at your chosen branch within the time shown at checkout.' },
  ],
  faq: [
    { q: 'Do you deliver?', a: 'Yes. Choose delivery at checkout and enter your address.' },
    { q: 'Can I order online?', a: 'Yes. Add dishes to your cart on the menu page and check out.' },
    { q: 'Can I pick up my order?', a: 'Yes. Choose pickup at checkout and select a branch.' },
    { q: 'Do you cater events?', a: 'Yes. Contact us with your event details and we will reply within 24 hours.' },
  ],
  payments: {
    paystack: { active: false, label: 'Mobile Money / Card (Paystack)', public_key: '' },
    manual: {
      active: true,
      label: 'Direct send (Mobile Money or bank transfer)',
      instructions: 'Sample: send the total to 0XX XXX XXXX (Account Name) and use your order reference as the payment reference. We confirm your payment and start cooking right away.',
    },
  },
  social: { facebook: '', instagram: '', tiktok: '' },
  whatsapp: { active: true, number: '', message: 'Hello! I would like to place an order.' },
  branches_section: { title: 'Find Us Near You', sub: 'Visit any of our branches for a great meal, or order online and we will bring it to you.' },
  testimonials: {
    title: 'What Our Customers Say',
    sub: 'Do not just take our word for it. Hear from our happy customers.',
    items: [
      { name: 'Customer name', role: 'Sample review', text: 'Sample review: replace this with a real customer review from the admin page, under Home.', rating: 5 },
      { name: 'Customer name', role: 'Sample review', text: 'Sample review: add the real words of your customers here, with their name and a short label.', rating: 5 },
      { name: 'Customer name', role: 'Sample review', text: 'Sample review: three to six reviews work well. You can edit or remove these any time.', rating: 5 },
    ],
  },
  payment_logos: {
    title: 'We accept',
    items: [
      { name: 'MTN MoMo', image: '' }, { name: 'Telecel Cash', image: '' }, { name: 'AirtelTigo Money', image: '' },
      { name: 'Visa', image: '' }, { name: 'Mastercard', image: '' },
    ],
  },
};
