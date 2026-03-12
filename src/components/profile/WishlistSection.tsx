import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import ProductCard from '../common/ProductCard'

const WishlistSection = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Chỉ fetch khi component được render (user click vào tab Yêu thích)
    useEffect(() => {
        fetch('/mocks/products.json')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.slice(0, 3))
                setIsLoading(false)
            })
    }, [])

    if (isLoading) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Yêu thích</h2>
                <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
            </div>

            {products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Heart size={64} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">Chưa có sản phẩm yêu thích</p>
                    <Link
                        to="/san-pham"
                        className="inline-block mt-4 px-6 py-3 bg-[#111111] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                    >
                        Khám phá sản phẩm
                    </Link>
                </div>
            )}
        </div>
    )
}

export default WishlistSection
