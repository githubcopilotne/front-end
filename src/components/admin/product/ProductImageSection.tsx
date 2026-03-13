import { useState, useRef } from 'react'
import { Star, Upload, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import productService from '../../../services/productService'

interface ProductImageSectionProps {
    product: any
    onRefresh: () => void
}

const ProductImageSection = ({ product, onRefresh }: ProductImageSectionProps) => {
    const images = product.images || []
    const hasMainImage = images.some((img: any) => img.isMain)

    // Upload state
    const [pendingFiles, setPendingFiles] = useState<File[]>([])
    const [mainIndex, setMainIndex] = useState<number | null>(null)
    const [uploading, setUploading] = useState(false)
    const [settingMain, setSettingMain] = useState<number | null>(null)
    const [deleteImageId, setDeleteImageId] = useState<number | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Chọn file → thêm vào danh sách pending (cộng dồn)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const newFiles = Array.from(files)
        setPendingFiles(prev => [...prev, ...newFiles])
        // Nếu chưa có ảnh chính và chưa chọn mainIndex → mặc định ảnh đầu
        if (!hasMainImage && mainIndex === null) {
            setMainIndex(0)
        }
        // Reset input để chọn lại cùng file
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Xóa 1 ảnh khỏi danh sách pending
    const handleRemovePending = (index: number) => {
        const newFiles = pendingFiles.filter((_, i) => i !== index)
        setPendingFiles(newFiles)

        // Cập nhật mainIndex
        if (mainIndex === index) {
            setMainIndex(newFiles.length > 0 ? 0 : null)
        } else if (mainIndex !== null && mainIndex > index) {
            setMainIndex(mainIndex - 1)
        }

        // Nếu ko còn file nào → reset
        if (newFiles.length === 0) {
            setMainIndex(null)
        }
    }

    // Hủy — xóa hết pending
    const handleCancelUpload = () => {
        setPendingFiles([])
        setMainIndex(null)
    }

    // Lưu — gọi API upload
    const handleSave = async () => {
        if (pendingFiles.length === 0) return

        // Nếu chưa có ảnh chính và chưa chọn → báo lỗi
        if (!hasMainImage && mainIndex === null) {
            toast.error('Vui lòng chọn ảnh chính')
            return
        }

        try {
            setUploading(true)
            const res = await productService.addImages(
                product.productId,
                pendingFiles,
                !hasMainImage ? mainIndex! : undefined
            )

            if (res.success) {
                toast.success(`Đã upload ${pendingFiles.length} ảnh`)
                setPendingFiles([])
                setMainIndex(null)
                onRefresh()
            } else {
                toast.error(res.message)
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setUploading(false)
        }
    }

    // Đặt ảnh chính
    const handleSetMain = async (imageId: number) => {
        try {
            setSettingMain(imageId)
            const res = await productService.setMainImage(product.productId, imageId)

            if (res.success) {
                toast.success('Đã đổi ảnh chính')
                onRefresh()
            } else {
                toast.error(res.message)
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setSettingMain(null)
        }
    }

    // Xóa ảnh đã upload
    const handleDelete = async () => {
        if (!deleteImageId) return

        try {
            setDeleteLoading(true)
            const res = await productService.deleteImage(product.productId, deleteImageId)

            if (res.success) {
                toast.success('Đã xóa ảnh')
                setDeleteImageId(null)
                onRefresh()
            } else {
                toast.error(res.message)
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setDeleteLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-800">Hình ảnh</h3>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                >
                    <Upload size={16} />
                    Upload ảnh
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {/* Preview ảnh pending (chưa upload) */}
            {pendingFiles.length > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh chờ upload ({pendingFiles.length})
                        {!hasMainImage && <span className="text-red-500 ml-1">— Click chọn ảnh chính</span>}
                    </p>
                    <div className="grid grid-cols-6 gap-3 mb-3">
                        {pendingFiles.map((file, index) => (
                            <div
                                key={index}
                                onClick={() => { if (!hasMainImage) setMainIndex(index) }}
                                className={`relative rounded-lg overflow-hidden border-2 transition-colors ${!hasMainImage ? 'cursor-pointer' : ''
                                    } ${!hasMainImage && mainIndex === index
                                        ? 'border-amber-500'
                                        : 'border-gray-200'
                                    }`}
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Preview"
                                    className="w-full aspect-square object-cover"
                                />

                                {/* Badge ảnh chính được chọn */}
                                {!hasMainImage && mainIndex === index && (
                                    <div className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                        <Star size={10} fill="white" />
                                        Main
                                    </div>
                                )}

                                {/* Nút xóa */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRemovePending(index) }}
                                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Nút Hủy + Lưu */}
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={handleCancelUpload}
                            disabled={uploading}
                            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={uploading}
                            className="px-3 py-1.5 text-sm font-medium text-white bg-[#409EFF] rounded-lg hover:bg-[#3a8ee6] transition-colors cursor-pointer disabled:opacity-50"
                        >
                            {uploading ? 'Đang upload...' : `Lưu (${pendingFiles.length})`}
                        </button>
                    </div>
                </div>
            )}

            {/* Grid ảnh hiện tại */}
            {images.length === 0 && pendingFiles.length === 0 ? (
                <p className="text-sm text-gray-400 italic py-4 text-center">Chưa có hình ảnh nào</p>
            ) : images.length > 0 && (
                <div className="grid grid-cols-6 gap-3">
                    {images.map((img: any) => (
                        <div
                            key={img.imageId}
                            className="relative group rounded-lg overflow-hidden border-2 border-gray-200"
                        >
                            <img
                                src={img.imageUrl}
                                alt="Ảnh sản phẩm"
                                className="w-full aspect-square object-cover"
                            />
                            {img.isMain && (
                                <div className="absolute top-1 left-1 bg-amber-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                    <Star size={10} fill="white" />
                                    Main
                                </div>
                            )}

                            {/* Overlay hover — nút đặt ảnh chính + xóa */}
                            {!img.isMain && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleSetMain(img.imageId)}
                                        disabled={settingMain === img.imageId}
                                        className="px-2 py-1 text-xs font-medium text-white bg-amber-500 rounded hover:bg-amber-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1"
                                    >
                                        <Star size={12} fill="white" />
                                        Đặt ảnh chính
                                    </button>
                                    <button
                                        onClick={() => setDeleteImageId(img.imageId)}
                                        className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Dialog xác nhận xóa ảnh */}
            {deleteImageId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteImageId(null)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Xác nhận xóa</h3>
                        <p className="text-sm text-gray-600 mb-4">Bạn có chắc muốn xóa ảnh này?</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteImageId(null)}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={deleteLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50"
                            >
                                {deleteLoading ? 'Đang xóa...' : 'Xóa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductImageSection
