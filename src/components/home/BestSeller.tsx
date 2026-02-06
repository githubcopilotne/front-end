import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import ProductCard from '../common/ProductCard'

const BestSeller = () => {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/mocks/bestSellers.json')
      .then((res) => res.json())
      .then((json) => setProducts(json))
  }, [])

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111111]">
            Sản phẩm bán chạy
          </h2>
          <p className="mt-2 text-gray-500">
            Những sản phẩm được yêu thích nhất
          </p>
        </div>

        {/* Grid sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((items) => (
            <ProductCard key={items.product_id} product={items} />
          ))}
        </div>

        {/* Nút xem tất cả */}
        <div className="text-center mt-8">
          <Link
            to="/san-pham?sort=ban-chay"
            className="inline-flex items-center gap-2 text-[#111111] font-medium hover:underline"
          >
            Xem tất cả
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BestSeller
