// Sample data so the site looks complete before Supabase has content.
const m = (id, title, description, price, category, popular) => ({ id, slug: 'demo-' + id, title, description, price, category, images: [], popular, rating: 5 });
export const DEMO_MENU = [
  m(1, 'Jollof Rice with Chicken', 'Smoky party jollof served with fried chicken and fresh coleslaw.', 75, 'Rice', true),
  m(2, 'Fried Rice with Fish', 'Fried rice with crispy fish, pepper and coleslaw.', 88, 'Rice', true),
  m(3, 'Grilled Chicken and Chips', 'Charcoal grilled chicken with golden chips and pepper.', 80, 'Chicken', true),
  m(4, 'Full Roasted Chicken', 'A whole roasted chicken with pepper and vegetables.', 135, 'Chicken', true),
  m(5, 'Cheese Burger', 'Burger bread, cheese, beef patty, lettuce, onion and tomatoes.', 65, 'Burgers', false),
  m(6, 'Egg Burger', 'Burger with egg, beef patty, lettuce, onion and tomatoes.', 70, 'Burgers', false),
  m(7, 'French Fries', 'Crispy golden fries, perfectly salted.', 20, 'Extras', false),
  m(8, 'Fresh Juice', 'Fresh juice in orange, pineapple or tangerine.', 17, 'Drinks', false),
];
export const DEMO_BRANCHES = [
  { id: 1, name: 'Accra', address: 'Accra, Ghana', phone: '+233 000 000 000', hours: '8:00 AM - 10:00 PM', map_embed: '', featured: true },
];
export const DEMO_JOURNEY = [
  { id: 1, year: 'Year 1', title: 'The first pot', body: 'Sample story: it started in a small kitchen with one recipe and a few loyal customers.' },
  { id: 2, year: 'Year 2', title: 'Word spreads', body: 'Sample story: orders grew by word of mouth, and the menu grew with them.' },
  { id: 3, year: 'Today', title: 'Cooking online', body: 'Sample story: now you can order from anywhere in Accra, for delivery or pickup.' },
];
export const DEMO_TEAM = [];
