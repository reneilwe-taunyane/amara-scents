import { PRODUCTS } from './products'
import type { Product } from './products'

export type MoodId = 'sensual' | 'playful' | 'warm' | 'fresh'

export type Mood = {
  id: MoodId
  label: string
  productIds: string[]
}

export const MOODS: Mood[] = [
  {
    id: 'sensual',
    label: 'Sensual',
    productIds: ['velvet-hour', 'nocturne', 'fig-and-honey'],
  },
  {
    id: 'playful',
    label: 'Playful',
    productIds: ['sweet-talk', 'soleil'],
  },
  {
    id: 'warm',
    label: 'Warm',
    productIds: ['afterglow', 'ember', 'sahara'],
  },
  {
    id: 'fresh',
    label: 'Fresh',
    productIds: ['sea-talk', 'soleil'],
  },
]

export function getProductsForMood(mood: Mood): Product[] {
  return mood.productIds
    .map((id) => PRODUCTS.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined)
}
