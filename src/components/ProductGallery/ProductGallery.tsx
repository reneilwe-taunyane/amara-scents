import { useState } from 'react'
import { ProductImage } from '../ProductImage/ProductImage'
import './ProductGallery.css'

export type GalleryImage = {
  src: string
  alt: string
}

type ProductGalleryProps = {
  images: GalleryImage[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? images[0]

  if (!activeImage) {
    return null
  }

  return (
    <div className="product-gallery">
      <ProductImage
        className="product-gallery__main"
        src={activeImage.src}
        alt={activeImage.alt}
        priority
        sizes="(min-width: 768px) 45vw, 92vw"
      />

      {images.length > 1 && (
        <ul className="product-gallery__thumbnails">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                className={`product-gallery__thumbnail${
                  index === activeIndex
                    ? ' product-gallery__thumbnail--active'
                    : ''
                }`}
                aria-label={`Show image ${index + 1} of ${name}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
              >
                <ProductImage src={image.src} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
