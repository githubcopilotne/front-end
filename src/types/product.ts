export interface Product {
  product_id: number
  product_name: string
  unit_price: number
  image_url: string
  rating: number
  review_count: number
  slug: string
}

export interface ProductImage {
  image_id: number
  image_url: string
  is_main: number
}

export interface ProductVariant {
  variant_id: number
  color: string
  size: string
  stock_quantity: number
}

export interface ProductReview {
  user_name: string
  rating: number
  comment: string
  image_url?: string
  created_at: string
}

export interface ProductDetail {
  product_id: number
  product_name: string
  slug: string
  unit_price: number
  description: string
  rating: number
  review_count: number

  images: ProductImage[]
  variants: ProductVariant[]
  reviews: ProductReview[]
}
