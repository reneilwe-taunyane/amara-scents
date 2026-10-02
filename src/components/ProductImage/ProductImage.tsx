import { useState } from 'react'
import './ProductImage.css'

type ProductImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
}

export function ProductImage({
  src,
  alt,
  className = '',
  sizes,
  priority = false,
}: ProductImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  )

  return (
    <div
      className={`product-image product-image--${status}${className ? ` ${className}` : ''}`}
    >
      {status === 'loading' && (
        <span className="product-image__placeholder" aria-hidden="true" />
      )}

      {status === 'error' ? (
        <span className="product-image__error" role="img" aria-label={alt}>
          {alt}
        </span>
      ) : (
        <img
          className="product-image__img"
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      )}
    </div>
  )
}
