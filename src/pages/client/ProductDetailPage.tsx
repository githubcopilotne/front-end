import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Heart, ShoppingCart, Minus, Plus } from 'lucide-react'
import type { ProductDetail, Product } from '../../types/product'
import { formatPrice } from '../../utils/format'
import ProductCard from '../../components/common/ProductCard'

// Map màu tiếng Việt sang mã màu
const COLOR_MAP: Record<string, string> = {
  'Đen': '#000000',
  'Trắng': '#FFFFFF',
  'Xám': '#808080',
  'Đỏ': '#EF4444',
  'Xanh dương': '#3B82F6',
  'Xanh lá': '#22C55E',
  'Vàng': '#EAB308',
  'Hồng': '#EC4899',
  'Tím': '#8B5CF6',
  'Cam': '#F97316',
  'Nâu': '#78350F',
  'Be': '#D4C4A8',
}

const ProductDetailPage = () => {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)

  // Fetch product detail
  useEffect(() => {
    fetch('/mocks/productDetail.json')
      .then((res) => res.json())
      .then((data) => {
        setProduct(data)
        // Set default color từ variant đầu tiên
        if (data.variants.length > 0) {
          setSelectedColor(data.variants[0].color)
        }
        setIsLoading(false)
      })
  }, [])

  // Fetch related products
  useEffect(() => {
    fetch('/mocks/products.json')
      .then((res) => res.json())
      .then((data) => {
        // Lấy 4 sản phẩm đầu làm sản phẩm liên quan
        setRelatedProducts(data.slice(0, 4))
      })
  }, [])

  // Lấy danh sách màu unique
  const colors = product
    ? [...new Set(product.variants.map((v) => v.color))]
    : []

  // Lấy danh sách size theo màu đã chọn
  const sizesForColor = product
    ? product.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => ({ size: v.size, stock: v.stock_quantity }))
    : []

  // Kiểm tra stock của variant đã chọn
  const selectedVariant = product?.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  )
  const isOutOfStock = selectedVariant?.stock_quantity === 0

  // Xử lý tăng/giảm số lượng
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }

  const increaseQuantity = () => {
    const maxStock = selectedVariant?.stock_quantity || 10
    if (quantity < maxStock) setQuantity(quantity + 1)
  }

  // Loading state
  if (isLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Đang tải...</p>
      </div>
    )
  }

  // Tìm ảnh chính
  const mainImage = product.images[selectedImage]?.image_url || product.images[0]?.image_url

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Phần trên: Ảnh + Thông tin */}
        <div className="bg-white rounded-lg p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cột trái: Gallery ảnh */}
            <div>
              {/* Ảnh lớn */}
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={mainImage}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4">
                {product.images.map((image, index) => (
                  <button
                    key={image.image_id}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[#111111]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={image.image_url}
                      alt={`${product.product_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Cột phải: Thông tin sản phẩm */}
            <div>
              {/* Tên sản phẩm */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {product.product_name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      className={
                        star <= Math.round(product.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.review_count} đánh giá)
                </span>
              </div>

              {/* Giá */}
              <p className="text-3xl font-bold text-[#111111] mt-4">
                {formatPrice(product.unit_price)}
              </p>

              {/* Chọn màu */}
              <div className="mt-6">
                <p className="font-medium text-gray-900 mb-2">
                  Màu sắc: <span className="font-normal">{selectedColor}</span>
                </p>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color)
                        setSelectedSize('') // Reset size khi đổi màu
                        setQuantity(1)
                      }}
                      title={color}
                      className={`w-10 h-10 rounded-full border-2 transition-colors ${
                        selectedColor === color
                          ? 'border-[#111111]'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: COLOR_MAP[color] || '#CCCCCC' }}
                    />
                  ))}
                </div>
              </div>

              {/* Chọn size */}
              <div className="mt-6">
                <p className="font-medium text-gray-900 mb-2">Kích thước:</p>
                <div className="flex flex-wrap gap-2">
                  {sizesForColor.map(({ size, stock }) => (
                    <button
                      key={size}
                      onClick={() => {
                        if (stock > 0) {
                          setSelectedSize(size)
                          setQuantity(1)
                        }
                      }}
                      disabled={stock === 0}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-[#111111] bg-[#111111] text-white'
                          : stock === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed line-through'
                          : 'border-gray-300 hover:border-[#111111]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Số lượng */}
              <div className="mt-6">
                <p className="font-medium text-gray-900 mb-2">Số lượng:</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-medium text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    disabled={!selectedVariant || quantity >= selectedVariant.stock_quantity}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={18} />
                  </button>
                  {selectedVariant && (
                    <span className="text-sm text-gray-500">
                      ({selectedVariant.stock_quantity} sản phẩm có sẵn)
                    </span>
                  )}
                </div>
              </div>

              {/* Nút thêm giỏ hàng + yêu thích */}
              <div className="flex gap-3 mt-8">
                <button
                  disabled={!selectedSize || isOutOfStock}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#111111] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={20} />
                  {!selectedSize
                    ? 'Vui lòng chọn size'
                    : isOutOfStock
                    ? 'Hết hàng'
                    : 'Thêm vào giỏ hàng'}
                </button>
                <button className="flex items-center justify-center gap-2 px-6 py-4 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors">
                  <Heart size={20} />
                  <span className="font-medium">Yêu thích</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="bg-white rounded-lg p-4 md:p-8 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h2>
          <p className="text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Đánh giá */}
        <div className="bg-white rounded-lg p-4 md:p-8 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Đánh giá ({product.review_count})
          </h2>

          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                >
                  {/* Tên + Rating */}
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{review.user_name}</p>
                    <span className="text-sm text-gray-500">{review.created_at}</span>
                  </div>

                  {/* Stars */}
                  <div className="flex mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={14}
                        className={
                          star <= review.rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-600 mt-2">{review.comment}</p>

                  {/* Ảnh review */}
                  {review.image_url && (
                    <div className="mt-3">
                      <img
                        src={review.image_url}
                        alt="Review"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Chưa có đánh giá nào.</p>
          )}
        </div>

        {/* Sản phẩm liên quan */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan</h2>
            <Link
              to="/san-pham"
              className="text-[#111111] font-medium hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((item) => (
              <ProductCard key={item.product_id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
