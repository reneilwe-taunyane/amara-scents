import afterglowImage from '../../product-images/AFTERGLOW.png'
import emberImage from '../../product-images/EMBER.png'
import figAndHoneyImage from '../../product-images/Fig & Honey.png'
import nocturneImage from '../../product-images/NOCTURNE.png'
import saharaImage from '../../product-images/SAHARA.png'
import seaTimeImage from '../../product-images/Sea Time.png'
import soleilImage from '../../product-images/SOLEIL.png'
import sweetTalkImage from '../../product-images/Sweet Talk.png'
import velvetHourImage from '../../product-images/VELVET HOUR.png'

export type ProductSize = '50ml' | '100ml'

export type Product = {
  id: string
  name: string
  slug: string
  notes: string[]
  mood: string[]
  description: string
  imageUrl: string
  imageAlt: string
  featured: boolean
}

export const PRICE_BY_SIZE: Record<ProductSize, number> = {
  '50ml': 250,
  '100ml': 500,
}

export const SIZE_OPTIONS: { size: ProductSize; label: string }[] = [
  { size: '50ml', label: '50 ml' },
  { size: '100ml', label: '100 ml' },
]

export const MAX_QUANTITY_PER_LINE = 10

export const PRODUCTS: Product[] = [
  {
    id: 'velvet-hour',
    name: 'VELVET HOUR',
    slug: 'velvet-hour',
    notes: ['Vanilla', 'Cashmere', 'Musk'],
    mood: ['Soft', 'Sensual', 'Comforting'],
    description:
      'A soft-focus vanilla wrapped in cashmere warmth, finished with a clean musk that lingers close to the skin like a favourite dress.',
    imageUrl: velvetHourImage,
    imageAlt: 'Amara Scents Velvet Hour fragrance bottle',
    featured: true,
  },
  {
    id: 'afterglow',
    name: 'AFTERGLOW',
    slug: 'afterglow',
    notes: ['Amber', 'Tonka', 'Warm Woods'],
    mood: ['Warm', 'Magnetic', 'Sophisticated'],
    description:
      'Amber and tonka glow against warm woods, a slow-burn scent that stays with whoever walked into the room.',
    imageUrl: afterglowImage,
    imageAlt: 'Amara Scents Afterglow fragrance bottle',
    featured: true,
  },
  {
    id: 'sahara',
    name: 'SAHARA',
    slug: 'sahara',
    notes: ['Spiced Citrus', 'Saffron', 'Amber'],
    mood: ['Radiant', 'Exotic', 'Bold'],
    description:
      'Spiced citrus lifts into saffron and settles into amber. Bright at first, unmistakably confident all evening.',
    imageUrl: saharaImage,
    imageAlt: 'Amara Scents Sahara fragrance bottle',
    featured: true,
  },
  {
    id: 'nocturne',
    name: 'NOCTURNE',
    slug: 'nocturne',
    notes: ['Black Plum', 'Rose', 'Incense'],
    mood: ['Dark', 'Mysterious', 'Seductive'],
    description:
      'Black plum and rose move through a haze of incense — the fragrance for the hours nobody else is awake for.',
    imageUrl: nocturneImage,
    imageAlt: 'Amara Scents Nocturne fragrance bottle',
    featured: true,
  },
  {
    id: 'sweet-talk',
    name: 'SWEET TALK',
    slug: 'sweet-talk',
    notes: ['Caramel', 'Jasmine', 'Vanilla'],
    mood: ['Playful', 'Sweet', 'Flirty'],
    description:
      'Caramel sweetness softened by jasmine and a vanilla base. Cheeky on purpose, and impossible to ignore.',
    imageUrl: sweetTalkImage,
    imageAlt: 'Amara Scents Sweet Talk fragrance bottle',
    featured: false,
  },
  {
    id: 'soleil',
    name: 'SOLÉIL',
    slug: 'soleil',
    notes: ['Bergamot', 'Neroli', 'White Musk'],
    mood: ['Fresh', 'Luminous', 'Effortless'],
    description:
      'Bergamot and neroli over white musk: a bright South African afternoon compressed into one spritz.',
    imageUrl: soleilImage,
    imageAlt: 'Amara Scents Soleil fragrance bottle',
    featured: true,
  },
  {
    id: 'ember',
    name: 'EMBER',
    slug: 'ember',
    notes: ['Smoked Vanilla', 'Cedar', 'Amber'],
    mood: ['Smoky', 'Warm', 'Intense'],
    description:
      'Smoked vanilla and cedar embers glowing under amber. Heavy, warm, and made for cold nights.',
    imageUrl: emberImage,
    imageAlt: 'Amara Scents Ember fragrance bottle',
    featured: false,
  },
  {
    id: 'fig-and-honey',
    name: 'FIG & HONEY',
    slug: 'fig-honey',
    notes: ['Fig', 'Honey', 'Sandalwood'],
    mood: ['Lush', 'Golden', 'Sensual'],
    description:
      'Ripe fig and golden honey over creamy sandalwood — lush without being loud, and quietly sensual.',
    imageUrl: figAndHoneyImage,
    imageAlt: 'Amara Scents Fig and Honey fragrance bottle',
    featured: false,
  },
  {
    id: 'sea-talk',
    name: 'SEA TALK',
    slug: 'sea-talk',
    notes: ['Bergamot', 'Sea Salt', 'Cedarwood'],
    mood: ['Fresh', 'Coastal', 'Serene'],
    description:
      'Bergamot, sea salt and cedarwood — cool, coastal and calm, like an empty shoreline at midday.',
    imageUrl: seaTimeImage,
    imageAlt: 'Amara Scents Sea Talk fragrance bottle',
    featured: false,
  },
]

export const FEATURED_PRODUCTS = PRODUCTS.filter(
  (product) => product.featured,
)

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((product) => product.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id)
}

export function getPriceForSize(size: ProductSize): number {
  return PRICE_BY_SIZE[size]
}

export function getSizeLabel(size: ProductSize): string {
  return SIZE_OPTIONS.find((option) => option.size === size)?.label ?? size
}
