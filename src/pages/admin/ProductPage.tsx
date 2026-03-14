import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import productService from '../../services/productService'
import type { ProductListItem } from '../../types/product'
import { formatPrice, formatDate } from '../../utils/format'
import Pagination from '../../components/ui/Pagination'
import StatusBadge from '../../components/ui/StatusBadge'
import ProductModal from '../../components/admin/product/ProductModal'

const ProductPage = () => {
    const [products, setProducts] = useState<ProductListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')

    // Phân trang
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 10

    // Modal thêm sản phẩm
    const [showCreateModal, setShowCreateModal] = useState(false)

    // Lấy danh sách sản phẩm
    const fetchProducts = async (page = currentPage) => {
        try {
            setLoading(true)
            setApiError('')
            const res = await productService.getAll(page, pageSize)
            if (res.success) {
                setProducts(res.data.content)
                setTotalPages(res.data.totalPages)
                setCurrentPage(res.data.number)
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
        fetchProducts(0)
    }, [])

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div />
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#409EFF] text-white text-sm font-medium rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                >
                    + Thêm sản phẩm
                </button>
            </div>

            {/* Lỗi từ API */}
            {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {apiError}
                </div>
            )}

            {/* Bảng sản phẩm */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap w-12">STT</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap w-16">Ảnh</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Tên sản phẩm</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Danh mục</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Giá</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Tồn kho</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Ngày tạo</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-400 text-sm">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-8 text-gray-400 text-sm">
                                    Chưa có sản phẩm nào
                                </td>
                            </tr>
                        ) : (
                            products.map((p, index) => (
                                <tr key={p.productId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {currentPage * pageSize + index + 1}
                                    </td>
                                    <td className="px-4 py-3">
                                        {p.mainImageUrl ? (
                                            <img
                                                src={p.mainImageUrl}
                                                alt={p.productName}
                                                className="w-10 h-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">
                                                N/A
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800 max-w-[200px] truncate">
                                        {p.productName}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{p.categoryName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{formatPrice(p.unitPrice)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{p.totalStock}</td>
                                    <td className="px-4 py-3">
                                        <StatusBadge status={p.status} />
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(p.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/admin/san-pham/${p.productId}`}
                                            className="p-1.5 text-gray-400 hover:text-[#409EFF] hover:bg-blue-50 rounded transition-colors"
                                            title="Xem chi tiết"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchProducts}
            />

            {/* Modal thêm sản phẩm */}
            <ProductModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </div>
    )
}

export default ProductPage
