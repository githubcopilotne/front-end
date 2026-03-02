import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import type { CartItem } from '../../types/cart'
import { formatPrice } from '../../utils/format'

const CartPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Fetch cart items (mock)
    useEffect(() => {
        fetch('/mocks/cart.json')
            .then((res) => res.json())
            .then((data) => {
                setCartItems(data)
                setIsLoading(false)
            })
    }, [])

    // Tăng số lượng
    const increaseQuantity = (cartItemId: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.cart_item_id === cartItemId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        )
    }

    // Giảm số lượng
    const decreaseQuantity = (cartItemId: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.cart_item_id === cartItemId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        )
    }

    // Xóa sản phẩm
    const removeItem = (cartItemId: number) => {
        setCartItems((prev) => prev.filter((item) => item.cart_item_id !== cartItemId))
    }

    // Tính tổng
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)

    // Loading
    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <p className="text-center text-gray-500">Đang tải...</p>
            </div>
        )
    }

    // Giỏ hàng trống
    if (cartItems.length === 0) {
        return (
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <ShoppingBag size={40} className="text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Giỏ hàng trống
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Bạn chưa có sản phẩm nào trong giỏ hàng
                        </p>
                        <Link
                            to="/san-pham"
                            className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Tiêu đề */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    Giỏ hàng ({cartItems.length} sản phẩm)
                </h1>

                <div className="flex flex-col-reverse lg:flex-row gap-8">
                    {/* ====== Cột trái: Danh sách sản phẩm ====== */}
                    <div className="flex-1">
                        <div className="space-y-4">
                            {cartItems.map((item) => (
                                <div
                                    key={item.cart_item_id}
                                    className="bg-white rounded-lg p-4 md:p-6"
                                >
                                    <div className="flex gap-4">
                                        {/* Ảnh sản phẩm */}
                                        <Link
                                            to={`/san-pham/${item.slug}`}
                                            className="flex-shrink-0"
                                        >
                                            <img
                                                src={item.image_url}
                                                alt={item.product_name}
                                                className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-lg"
                                            />
                                        </Link>

                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-1 min-w-0">
                                            {/* Tên + Nút xóa */}
                                            <div className="flex items-start justify-between gap-2">
                                                <Link
                                                    to={`/san-pham/${item.slug}`}
                                                    className="text-gray-900 font-medium hover:text-[#111111] transition-colors line-clamp-2"
                                                >
                                                    {item.product_name}
                                                </Link>
                                                <button
                                                    onClick={() => removeItem(item.cart_item_id)}
                                                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Xóa sản phẩm"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            {/* Phân loại */}
                                            <p className="text-sm text-gray-500 mt-1">
                                                {item.color} / {item.size}
                                            </p>

                                            {/* Đơn giá */}
                                            <p className="text-[#111111] font-semibold mt-2">
                                                {formatPrice(item.unit_price)}
                                            </p>

                                            {/* Số lượng + Thành tiền */}
                                            <div className="flex items-center justify-between mt-3">
                                                {/* Bộ +/- số lượng */}
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.cart_item_id)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-10 text-center font-medium">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => increaseQuantity(item.cart_item_id)}
                                                        className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                {/* Thành tiền */}
                                                <p className="text-[#111111] font-bold">
                                                    {formatPrice(item.unit_price * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ====== Cột phải: Tóm tắt đơn hàng (sticky) ====== */}
                    <div className="lg:w-[380px] flex-shrink-0">
                        <div className="bg-white rounded-lg p-6 lg:sticky lg:top-24">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                Thanh toán
                            </h2>

                            {/* Tổng tiền hàng */}
                            <div className="flex justify-between text-gray-700">
                                <span>Tổng tiền hàng ({totalQuantity} sản phẩm)</span>
                                <span className="font-medium">{formatPrice(subtotal)}</span>
                            </div>

                            {/* Nút đặt hàng */}
                            <button className="w-full mt-4 bg-[#111111] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                                Tiến hành đặt hàng
                            </button>

                            {/* Link tiếp tục mua sắm */}
                            <Link
                                to="/san-pham"
                                className="block text-center mt-4 text-gray-600 hover:text-[#111111] text-sm font-medium transition-colors"
                            >
                                ← Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage
