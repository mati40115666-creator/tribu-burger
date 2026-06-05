export const defaultConfig = {
  name: 'TRIBU BURGER',
  tagline: 'SABORES ANCESTRALES · FUEGO · IDENTIDAD',
  whatsapp: '5493426516104',
  schedule: 'Miércoles a Domingos · 19 a 00hs',
  address: 'Santa Fe, Zona Norte',
  instagram: '@tribu.burger_',
  bank_alias: 'tribuburger',
  surcharge_doble: 1500,
  surcharge_triple: 3000
}

export const defaultCategories = [
  { id: 'burgers', name: 'HAMBURGUESAS',    banner_color: 'amber', sort_order: 1, active: true },
  { id: 'sides',   name: 'ACOMPAÑAMIENTOS', banner_color: 'red',   sort_order: 2, active: true },
  { id: 'drinks',  name: 'BEBIDAS',          banner_color: 'green', sort_order: 3, active: true }
]

const PAPAS = '· Incluye papas'

export const defaultProducts = [
  { id: 'totem',     category_id: 'burgers', name: 'TÓTEM BURGER',     subtitle: null,            description: `Blend de carne · Barbacoa ahumada · Bacon · Cheddar fundido`,                              base_price: 7500, has_medallon: true,  theme: 'totem',     mask_type: 'totem',     sort_order: 1, active: true },
  { id: 'azteca',    category_id: 'burgers', name: 'AZTECA',           subtitle: null,            description: `Blend de carne · Barbacoa ahumada · Bacon · Cebolla crispy · Cheddar fundido`,             base_price: 7500, has_medallon: true,  theme: 'azteca',    mask_type: 'azteca',    sort_order: 2, active: true },
  { id: 'maya',      category_id: 'burgers', name: 'MAYA BURGER',      subtitle: null,            description: `Blend de carne · Salsa alioli · Tomates asados · Rúcula · Queso tybo`,                    base_price: 7500, has_medallon: true,  theme: 'maya',      mask_type: 'maya',      sort_order: 3, active: true },
  { id: 'inca-gold', category_id: 'burgers', name: 'INCA GOLD',        subtitle: null,            description: `Blend de carne · Volcán de cheddar y panceta · Barbacoa ahumada · Bacon`,                 base_price: 7500, has_medallon: true,  theme: 'inca',      mask_type: 'inca',      sort_order: 4, active: true },
  { id: 'ancestral', category_id: 'burgers', name: 'ANCESTRAL BURGER', subtitle: null,            description: `Blend de carne · Salsa tasty · Pepinillos · Bacon · Cheddar`,                             base_price: 7500, has_medallon: true,  theme: 'ancestral', mask_type: 'ancestral', sort_order: 5, active: true },
  { id: 'tribu',     category_id: 'burgers', name: 'TRIBU BURGER',     subtitle: 'LA DE LA CASA', description: `Blend de carne · Mayonesa de chimichurri · Lechuga · Tomate · Queso tybo · Jamón · Huevo`, base_price: 7500, has_medallon: true,  theme: 'tribu',     mask_type: 'tribu',     sort_order: 6, active: true },

  { id: 'papas-comunes',       category_id: 'sides', name: 'PAPAS COMUNES',             subtitle: null, description: 'Papas fritas crocantes',                                  base_price: 6000, has_medallon: false, theme: 'totem',     mask_type: 'fries', sort_order: 1, active: true },
  { id: 'papas-cheddar',       category_id: 'sides', name: 'PAPAS CON CHEDDAR',         subtitle: null, description: 'Papas fritas con cheddar fundido',                        base_price: 6000, has_medallon: false, theme: 'inca',      mask_type: 'fries', sort_order: 2, active: true },
  { id: 'papas-cheddar-bacon', category_id: 'sides', name: 'PAPAS CON CHEDDAR Y BACON', subtitle: null, description: 'Papas fritas con cheddar fundido y bacon crocante',       base_price: 6000, has_medallon: false, theme: 'ancestral', mask_type: 'fries', sort_order: 3, active: true },
  { id: 'papas-tasty',         category_id: 'sides', name: 'PAPAS CON SALSA TASTY',     subtitle: null, description: 'Papas fritas con salsa tasty',                            base_price: 6000, has_medallon: false, theme: 'maya',      mask_type: 'fries', sort_order: 4, active: true },
  { id: 'dips',                category_id: 'sides', name: 'DIPS',                      subtitle: null, description: 'Mayonesa · Barbacoa · Ketchup · Sabora · Salsa Tasty · Alioli · Mayo Chimichurri · Cheddar', base_price: 700, has_medallon: false, theme: 'azteca', mask_type: 'drink', sort_order: 5, active: true },

  { id: 'cervezas',   category_id: 'drinks', name: 'LATAS DE CERVEZA',  subtitle: null,        description: 'Budweiser · Heineken',       base_price: 2500, has_medallon: false, theme: 'inca',   mask_type: 'beer',  sort_order: 1, active: true },
  { id: 'gaseosas',   category_id: 'drinks', name: 'LATAS DE GASEOSA',  subtitle: null,        description: 'Coca-Cola · Sprite · Pepsi', base_price: 1500, has_medallon: false, theme: 'azteca', mask_type: 'drink', sort_order: 2, active: true },
  { id: 'agua-500',   category_id: 'drinks', name: 'AGUA MINERAL',      subtitle: '500ml',     description: 'Agua mineral sin gas',       base_price: 700,  has_medallon: false, theme: 'maya',   mask_type: 'drink', sort_order: 3, active: true },
  { id: 'agua-sabor', category_id: 'drinks', name: 'AGUA SABORIZADA',   subtitle: '1.5L',      description: 'Agua saborizada Fresh Baggio', base_price: 2000, has_medallon: false, theme: 'maya', mask_type: 'drink', sort_order: 4, active: true }
]

export const defaultExtras = [
  { id: 'extra-cheddar', name: 'EXTRA CHEDDAR', price: 500, active: true }
]

export const defaultZones = [
  { id: 'norte',  name: 'Zona Norte', price: 2500, active: true },
  { id: 'ciudad', name: 'Toda la ciudad', price: 3500, active: true }
]

export function buildMenu(categories, products) {
  return categories
    .filter(c => c.active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(cat => ({
      id: cat.id,
      name: cat.name,
      bannerColor: cat.banner_color,
      products: products
        .filter(p => p.category_id === cat.id && p.active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(p => ({
          id: p.id,
          name: p.name,
          subtitle: p.subtitle,
          description: p.description,
          basePrice: p.base_price,
          hasMedallon: p.has_medallon,
          theme: p.theme,
          maskType: p.mask_type,
          image_url: p.image_url || null
        }))
    }))
}

export function buildConfig(raw) {
  return {
    name: raw.name,
    tagline: raw.tagline,
    whatsapp: raw.whatsapp,
    schedule: raw.schedule,
    address: raw.address,
    instagram: raw.instagram,
    bank_alias: raw.bank_alias,
    surcharge_doble: raw.surcharge_doble ?? 1500,
    surcharge_triple: raw.surcharge_triple ?? 3000
  }
}
