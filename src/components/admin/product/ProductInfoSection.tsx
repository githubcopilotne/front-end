import { useState } from 'react'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import productService from '../../../services/productService'
import { formatPrice, formatDate } from '../../../utils/format'
import StatusBadge from '../../ui/StatusBadge'
import ProductDeleteDialog from './ProductDeleteDialog'
import ProductModal from './ProductModal'
import useAuthStore from '../../../stores/authStore'

interface ProductInfoSectionProps {
    product: any
    onRefresh: () => void
}

const ProductInfoSection = ({ product, onRefresh }: ProductInfoSectionProps) => {
    const user = useAuthStore(state => state.user)
    const isAdmin = user?.role === 'Admin'

    const [toggling, setToggling] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)

    // Toggle ẩn/hiện sản phẩm
    const handleToggleStatus = async () => {
        try {
            setToggling(true)
            const res = await productService.toggleStatus(product.productId)
            if (res.success) {
                toast.success(res.message)
                onRefresh()
            } else {
                toast.error(res.message)
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setToggling(false)
        }
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
            {/* Header: tiêu đề + nút hành động */}
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-gray-800">Thông tin chung</h3>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-[#409EFF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Sửa thông tin"
                    >
                        <Pencil size={14} />
                        Sửa
                    </button>
                    {isAdmin && (
                        <>
                            <button
                                onClick={handleToggleStatus}
                                disabled={toggling}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {toggling ? 'Đang xử lý...' : product.status === 1 ? (<><EyeOff size={14} /> Ngừng bán</>) : (<><Eye size={14} /> Đăng bán</>)}
                            </button>
                            <button
                                onClick={() => setShowDeleteDialog(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Xóa sản phẩm"
                            >
                                <Trash2 size={14} />
                                Xóa
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Grid thông tin — mỗi hàng có border-bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Tên sản phẩm</span>
                    <span className="text-sm font-medium text-gray-800">{product.productName}</span>
                </div>
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Danh mục</span>
                    <span className="text-sm text-gray-800">{product.category?.categoryName || '—'}</span>
                </div>
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Giá</span>
                    <span className="text-sm font-medium text-gray-800">{formatPrice(product.unitPrice)}</span>
                </div>
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Trạng thái</span>
                    <StatusBadge status={product.status} />
                </div>
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Ngày tạo</span>
                    <span className="text-sm text-gray-600">{product.createdAt ? formatDate(product.createdAt) : '—'}</span>
                </div>
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Ngày cập nhật</span>
                    <span className="text-sm text-gray-600">{product.updatedAt ? formatDate(product.updatedAt) : '—'}</span>
                </div>
                <div className="py-3 border-b border-gray-100">
                    <span className="block text-sm text-gray-500 mb-1">Slug</span>
                    <span className="text-sm text-gray-600 font-mono">{product.slug || '—'}</span>
                </div>
                <div className="py-3 border-b border-gray-100" />
                <div className="py-3 md:col-span-2">
                    <span className="block text-sm text-gray-500 mb-1">Mô tả</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.description || '—'}</p>
                </div>
            </div>

            {/* Dialog xác nhận xóa */}
            <ProductDeleteDialog
                isOpen={showDeleteDialog}
                productId={product.productId}
                productName={product.productName}
                onClose={() => setShowDeleteDialog(false)}
            />

            {/* Modal sửa thông tin */}
            <ProductModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                product={product}
                onEditSuccess={onRefresh}
            />
        </div>
    )
}

export default ProductInfoSection
