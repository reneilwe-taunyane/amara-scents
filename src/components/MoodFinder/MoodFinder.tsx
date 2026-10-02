import { useState } from 'react'
import { MOODS, getProductsForMood } from '../../data/moods'
import type { MoodId } from '../../data/moods'
import { ProductGrid } from '../ProductGrid/ProductGrid'
import './MoodFinder.css'

export function MoodFinder() {
  const [selectedMoodId, setSelectedMoodId] = useState<MoodId | null>(null)

  const selectedMood = MOODS.find((mood) => mood.id === selectedMoodId)
  const matchedProducts = selectedMood ? getProductsForMood(selectedMood) : []

  return (
    <section className="mood-finder page__section">
      <p className="page__eyebrow">Mood finder</p>
      <h2 className="page__section-title">How do you want to feel?</h2>
      <p className="page__lede">
        Choose a mood and discover the scents that fit it.
      </p>

      <div className="mood-finder__options" role="group" aria-label="Choose a mood">
        {MOODS.map((mood) => {
          const isSelected = mood.id === selectedMoodId

          return (
            <label
              key={mood.id}
              className={`mood-option${isSelected ? ' mood-option--selected' : ''}`}
            >
              <input
                className="visually-hidden"
                type="radio"
                name="mood"
                value={mood.id}
                checked={isSelected}
                onChange={() => setSelectedMoodId(mood.id)}
              />
              <span className="mood-option__label">{mood.label}</span>
              <span className="mood-option__count">
                {mood.productIds.length} scents
              </span>
              {isSelected && (
                <span className="mood-option__marker" aria-hidden="true" />
              )}
            </label>
          )
        })}
      </div>

      <div className="mood-finder__results">
        {selectedMood ? (
          <>
            <p className="mood-finder__status" role="status">
              Showing {matchedProducts.length} fragrances for a{' '}
              {selectedMood.label.toLowerCase()} mood.
            </p>
            <ProductGrid products={matchedProducts} />
          </>
        ) : (
          <p className="mood-finder__invitation">
            Choose a <span className="script-accent">mood</span> to find your
            scent.
          </p>
        )}
      </div>
    </section>
  )
}
