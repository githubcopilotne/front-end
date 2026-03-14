import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import VariantCreateModal from './VariantCreateModal'
import VariantStockModal from './VariantStockModal'
import VariantDeleteDialog from './VariantDeleteDialog'
import useAuthStore from '../../../stores/authStore'

interface ProductVariantSectionProps {
    product: any
    onRefresh: () => void
}

const ProductVariantSection = ({ product, onRefresh }: ProductVariantSectionProps) => {
    const user = useAuthStore(state => state.user)
    const isAdmin = user?.role === 'Admin'

    const variants = product.variants || []
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [stockVariant, setStockVariant] = useState<any>(null)
    const [deleteVariant, setDeleteVariant] = useState<any>(null)

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Biến thể</h3>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                >
                    <Plus size={16} />
                    Thêm biến thể
                </button>
            </div>

            {/* Bảng biến thể */}
            {variants.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-4 text-center">Chưa có biến thể nào</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left text-gray-500">
                                <th className="px-4 py-3 font-medium w-16">STT</th>
                                <th className="px-4 py-3 font-medium">Màu sắc</th>
                                <th className="px-4 py-3 font-medium">Kích cỡ</th>
                                <th className="px-4 py-3 font-medium">Tồn kho</th>
                                <th className="px-4 py-3 font-medium w-24 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {variants.map((v: any, index: number) => (
                                <tr key={v.variantId} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{v.color}</td>
                                    <td className="px-4 py-3 text-gray-800">{v.size}</td>
                                    <td className="px-4 py-3 text-gray-800">{v.stockQuantity}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setStockVariant(v)}
                                            className="text-gray-400 hover:text-[#409EFF] transition-colors cursor-pointer"
                                            title="Sửa tồn kho"
                                        >
                                            <Pencil size={15} />
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => setDeleteVariant(v)}
                                                className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer ml-2"
                                                title="Xóa biến thể"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal thêm biến thể */}
            <VariantCreateModal
                isOpen={showCreateModal}
                productId={product.productId}
                onClose={() => setShowCreateModal(false)}
                onSuccess={onRefresh}
            />

            {/* Modal sửa tồn kho */}
            <VariantStockModal
                isOpen={!!stockVariant}
                productId={product.productId}
                variant={stockVariant}
                onClose={() => setStockVariant(null)}
                onSuccess={onRefresh}
            />

            {/* Dialog xác nhận xóa biến thể */}
            <VariantDeleteDialog
                isOpen={!!deleteVariant}
                productId={product.productId}
                variant={deleteVariant}
                onClose={() => setDeleteVariant(null)}
                onSuccess={onRefresh}
            />
        </div>
    )
}

export default ProductVariantSection
