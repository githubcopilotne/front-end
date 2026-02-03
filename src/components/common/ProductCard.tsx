import { Heart, ShoppingCart, Star } from 'lucide-react'
import type { Product } from '../../types/product'
import { formatPrice } from '../../utils/format'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="group">
      {/* Ảnh sản phẩm */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        <a href={`/san-pham/${product.product_id}`} className="block w-full h-full">
          <img
            src={product.image_url}
            alt={product.product_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </a>

        {/* Nút yêu thích + thêm giỏ hàng (hiện khi hover) */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100"
            onClick={() => {
              // TODO: Thêm vào yêu thích
            }}
          >
            <Heart size={18} className="text-gray-700" />
          </button>
          <button
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 "
            onClick={() => {
              // TODO: Thêm vào giỏ hàng
            }}
          >
            <ShoppingCart size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="mt-3">
          <h3 className="text-gray-800 font-medium group-hover:text-[#111111] transition-colors line-clamp-2">
            {product.product_name}
          </h3>
        <p className="mt-1 text-gray-800 font-semibold">
          {formatPrice(product.unit_price)}
        </p>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1">
          {/* 5 sao */}
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={
                  star <= Math.round(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          {/* Số rating và review */}
          <span className="text-sm text-gray-600">
            {product.rating} ({product.review_count} đánh giá)
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
