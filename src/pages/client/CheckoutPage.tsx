import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tag, X } from 'lucide-react'
import type { CartItem } from '../../types/cart'
import { formatPrice } from '../../utils/format'

const CheckoutPage = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [cartItems, setCartItems] = useState<CartItem[]>([])

    // Form fields
    const [fullName, setFullName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [note, setNote] = useState('')
    const [paymentMethod, setPaymentMethod] = useState(0) // 0: COD, 1: VNPay

    // Voucher
    const [voucherCode, setVoucherCode] = useState('')
    const [appliedVoucher, setAppliedVoucher] = useState<{ code: string; discount: number } | null>(null)
    const [voucherError, setVoucherError] = useState('')

    // Fetch checkout data (mock)
    useEffect(() => {
        fetch('/mocks/checkout.json')
            .then((res) => res.json())
            .then((data) => {
                // Auto fill thông tin user
                setFullName(data.user.full_name || '')
                setPhone(data.user.phone || '')
                setAddress(data.user.address || '')
                // Set cart items
                setCartItems(data.items)
                setIsLoading(false)
            })
    }, [])

    // Áp dụng voucher (mock)
    const applyVoucher = () => {
        const trimmedCode = voucherCode.trim().toUpperCase()
        if (!trimmedCode) return

        // Mock: chỉ chấp nhận mã "GIAM50K"
        if (trimmedCode === 'GIAM50K') {
            setAppliedVoucher({ code: trimmedCode, discount: 50000 })
            setVoucherError('')
            setVoucherCode('')
        } else {
            setVoucherError('Mã giảm giá không hợp lệ')
            setAppliedVoucher(null)
        }
    }

    // Hủy voucher
    const removeVoucher = () => {
        setAppliedVoucher(null)
        setVoucherError('')
    }

    // Tính tổng
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
    const discount = appliedVoucher?.discount || 0
    const total = Math.max(subtotal - discount, 0)

    // Loading
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <p className="text-center text-gray-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Tiêu đề */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    Thanh toán
                </h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* ====== Cột trái: Form ====== */}
                    <div className="flex-1 space-y-6">
                        {/* Thông tin giao hàng */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Thông tin giao hàng
                            </h2>

                            <div className="space-y-4">
                                {/* Họ tên */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Nhập họ và tên"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                                    />
                                </div>

                                {/* Số điện thoại */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Nhập số điện thoại"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                                    />
                                </div>

                                {/* Địa chỉ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Địa chỉ giao hàng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ giao hàng"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                                    />
                                </div>

                                {/* Ghi chú */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ghi chú
                                    </label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Ghi chú cho đơn hàng (không bắt buộc)"
                                        rows={3}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mã giảm giá */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Mã giảm giá
                            </h2>

                            {appliedVoucher ? (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Tag size={16} />
                                        <span className="font-medium">{appliedVoucher.code}</span>
                                        <span className="text-sm">(-{formatPrice(appliedVoucher.discount)})</span>
                                    </div>
                                    <button
                                        onClick={removeVoucher}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Hủy mã giảm giá"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={voucherCode}
                                            onChange={(e) => {
                                                setVoucherCode(e.target.value)
                                                setVoucherError('')
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') applyVoucher()
                                            }}
                                            placeholder="Nhập mã giảm giá"
                                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                                        />
                                        <button
                                            onClick={applyVoucher}
                                            className="px-6 py-3 bg-[#111111] text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Áp dụng
                                        </button>
                                    </div>
                                    {voucherError && (
                                        <p className="text-red-500 text-sm mt-2">{voucherError}</p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Phương thức thanh toán */}
                        <div className="bg-white rounded-lg p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Phương thức thanh toán
                            </h2>

                            <div className="space-y-3">
                                {/* COD */}
                                <label
                                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 0
                                        ? 'border-[#111111] bg-gray-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 0}
                                        onChange={() => setPaymentMethod(0)}
                                        className="w-5 h-5 accent-[#111111]"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Thanh toán khi nhận hàng (COD)
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            Thanh toán bằng tiền mặt khi nhận được hàng
                                        </p>
                                    </div>
                                </label>

                                {/* VNPay */}
                                <label
                                    className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 1
                                        ? 'border-[#111111] bg-gray-50'
                                        : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        checked={paymentMethod === 1}
                                        onChange={() => setPaymentMethod(1)}
                                        className="w-5 h-5 accent-[#111111]"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            Thanh toán qua VNPay
                                        </p>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            ATM, Visa/Mastercard, QR Code, Ví VNPay
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* ====== Cột phải: Tóm tắt đơn hàng (sticky) ====== */}
                    <div className="lg:w-[420px] flex-shrink-0">
                        <div className="bg-white rounded-lg p-6 lg:sticky lg:top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Đơn hàng của bạn
                            </h2>

                            {/* Danh sách sản phẩm */}
                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.cart_item_id} className="flex gap-3">
                                        {/* Ảnh nhỏ */}
                                        <div className="relative flex-shrink-0">
                                            <img
                                                src={item.image_url}
                                                alt={item.product_name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            {/* Badge số lượng */}
                                            <span className="absolute -top-2 -right-2 bg-[#111111] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        {/* Thông tin */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                {item.product_name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {item.color} / {item.size}
                                            </p>
                                        </div>

                                        {/* Giá */}
                                        <p className="text-sm font-medium text-gray-900 flex-shrink-0">
                                            {formatPrice(item.unit_price * item.quantity)}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Đường kẻ */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Tổng tiền hàng */}
                            <div className="flex justify-between text-gray-700">
                                <span>Tổng tiền hàng ({totalQuantity} sản phẩm)</span>
                                <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>

                            {/* Giảm giá */}
                            {appliedVoucher && (
                                <div className="flex justify-between text-green-600 mt-2">
                                    <span>Giảm giá</span>
                                    <span className="font-medium">-{formatPrice(discount)}</span>
                                </div>
                            )}

                            {/* Đường kẻ + Tổng cộng */}
                            <div className="border-t border-gray-200 my-4"></div>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                <span className="text-xl font-bold text-[#111111]">
                                    {formatPrice(total)}
                                </span>
                            </div>

                            {/* Nút đặt hàng */}
                            <button className="w-full mt-6 bg-[#111111] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                Đặt hàng
                            </button>

                            {/* Link quay lại giỏ hàng */}
                            <Link
                                to="/gio-hang"
                                className="block text-center mt-4 text-gray-600 hover:text-[#111111] text-sm font-medium transition-colors"
                            >
                                ← Quay lại giỏ hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage
