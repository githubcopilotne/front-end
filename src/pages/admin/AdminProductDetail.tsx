import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import productService from '../../services/productService'
import ProductInfoSection from '../../components/admin/product/ProductInfoSection'
import ProductVariantSection from '../../components/admin/product/ProductVariantSection'
import ProductImageSection from '../../components/admin/product/ProductImageSection'

const AdminProductDetail = () => {
    const { id } = useParams<{ id: string }>()

    const [product, setProduct] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')

    const fetchProduct = async () => {
        try {
            setLoading(true)
            setApiError('')
            const res = await productService.getById(Number(id))
            if (res.success) {
                setProduct(res.data)
            } else {
                setApiError(res.message)
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [id])

    if (loading) {
        return (
            <div className="text-center py-12 text-gray-400 text-sm">Đang tải...</div>
        )
    }

    if (apiError) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                {apiError}
            </div>
        )
    }

    if (!product) return null

    return (
        <div>
            {/* Quay lại */}
            <div className="mb-4">
                <Link
                    to="/admin/san-pham"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <ArrowLeft size={16} />
                    Quay lại danh sách
                </Link>
            </div>

            {/* Section 1: Thông tin chung */}
            <ProductInfoSection product={product} onRefresh={fetchProduct} />

            {/* Section 2: Biến thể */}
            <ProductVariantSection product={product} onRefresh={fetchProduct} />

            {/* Section 3: Hình ảnh */}
            <ProductImageSection product={product} onRefresh={fetchProduct} />
        </div>
    )
}

export default AdminProductDetail
