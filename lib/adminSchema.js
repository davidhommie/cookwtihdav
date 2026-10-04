// What the admin page can edit. p = path inside the settings object, t = field type.
const T = (p, l, t = 'text') => ({ p, l, t });

export const SETTINGS_TABS = {
  General: {
    fields: [
      T('brand.name', 'Site name'), T('brand.logo_url', 'Logo (use a red PNG or WebP)', 'logo'),
      T('contact.phone', 'Phone number'), T('contact.email', 'Email address'), T('contact.address', 'Address'), T('contact.hours', 'Opening hours'),
      T('cta.primary', 'Main button text'), T('cta.secondary', 'Second button text'),
      T('footer.about', 'Footer text', 'area'), T('footer.credit', 'Footer credit line'),
    ],
    lists: [{ p: 'nav', l: 'Menu links', f: [['label', 'Label'], ['href', 'Link, like /menu']] }],
  },
  Home: {
    fields: [
      T('hero.badge', 'Hero small badge'), T('hero.headline', 'Hero headline (animated)'), T('hero.sub', 'Hero sub text', 'area'),
      T('stats.years', 'Years of experience', 'number'), T('stats.staff', 'Staff members', 'number'), T('stats.locations', 'Locations', 'number'), T('stats.customers', 'Happy customers', 'number'),
      T('popular.title', 'Popular menu title'), T('popular.sub', 'Popular menu text'),
      T('why.title', 'Why choose us title'), T('why.sub', 'Why choose us text'),
      T('cta_band.title', 'Bottom banner title'), T('cta_band.sub', 'Bottom banner text'),
    ],
    lists: [{ p: 'why.items', l: 'Why choose us cards', f: [['icon', 'Icon: plate, leaf, bolt, shield, truck, heart'], ['title', 'Title'], ['text', 'Text', 'area']] }],
  },
  About: {
    fields: [T('about.badge', 'Badge'), T('about.title', 'Page title'), T('about.sub', 'Intro text', 'area'), T('about.mission', 'Mission', 'area'), T('about.vision', 'Vision', 'area')],
    lists: [{ p: 'about.values', l: 'Core values', f: [['icon', 'Icon: plate, leaf, bolt, shield, truck, heart'], ['title', 'Title'], ['text', 'Text', 'area']] }],
  },
  'Policies & FAQ': {
    fields: [],
    lists: [
      { p: 'policies', l: 'Policies (id must be one word, like refund)', f: [['id', 'Id'], ['title', 'Title'], ['body', 'Text', 'area']] },
      { p: 'faq', l: 'FAQ', f: [['q', 'Question'], ['a', 'Answer', 'area']] },
    ],
  },
  Payments: {
    fields: [
      T('payments.paystack.active', 'Accept Paystack', 'bool'), T('payments.paystack.label', 'Paystack label'),
      T('payments.paystack.public_key', 'Paystack PUBLIC key (starts pk_)'),
      T('payments.manual.active', 'Accept direct send', 'bool'), T('payments.manual.label', 'Direct send label'),
      T('payments.manual.instructions', 'Direct send instructions (number, account name)', 'area'),
    ],
    lists: [],
  },
};

const C = (k, l, t = 'text') => ({ k, l, t });
export const TABLES = {
  Menu: { table: 'menu_items', title: 'title', manualId: true, cols: [C('title', 'Dish name'), C('description', 'Description', 'area'), C('price', 'Price (GHS)', 'number'), C('category', 'Category (Rice, Chicken, Burgers...)'), C('images', 'Images', 'images'), C('popular', 'Show as Popular', 'bool'), C('rating', 'Rating (1 to 5)', 'number'), C('active', 'Visible on site', 'bool'), C('sort', 'Order (small number first)', 'number')], blank: { popular: false, rating: 5, active: true, sort: 0, images: [] } },
  Branches: { table: 'branches', title: 'name', cols: [C('name', 'Branch name'), C('address', 'Address'), C('phone', 'Phone'), C('hours', 'Opening hours'), C('map_embed', 'Google Maps embed link (optional)'), C('featured', 'Featured', 'bool'), C('active', 'Visible on site', 'bool'), C('sort', 'Order', 'number')], blank: { featured: false, active: true, sort: 0 } },
  Team: { table: 'team_members', title: 'name', cols: [C('name', 'Name'), C('role', 'Role'), C('image', 'Photo', 'image'), C('active', 'Visible on site', 'bool'), C('sort', 'Order', 'number')], blank: { active: true, sort: 0 } },
  Journey: { table: 'journey', title: 'title', cols: [C('year', 'Year or label'), C('title', 'Title'), C('body', 'Story', 'area'), C('active', 'Visible on site', 'bool'), C('sort', 'Order', 'number')], blank: { active: true, sort: 0 } },
};
