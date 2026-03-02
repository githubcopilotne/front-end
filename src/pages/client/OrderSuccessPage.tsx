import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CircleCheckBig } from 'lucide-react'
import { formatPrice } from '../../utils/format'
import confetti from 'canvas-confetti'

// Mock data — khi có BE sẽ nhận từ checkout page qua state/params
const mockOrder = {
    orderId: 1,
    orderDate: '02/03/2026',
    totalMoney: 700000,
    paymentMethod: 0, // 0: COD, 1: VNPay
}

const PAYMENT_METHODS: Record<number, string> = {
    0: 'Thanh toán khi nhận hàng (COD)',
    1: 'Thanh toán qua VNPay',
}

const OrderSuccessPage = () => {
    const order = mockOrder

    // Combo confetti: bắn 2 bên → mưa từ trên
    useEffect(() => {
        // Bắn từ 2 bên
        confetti({ particleCount: 60, spread: 70, origin: { x: 0.2, y: 0.6 } })
        confetti({ particleCount: 60, spread: 70, origin: { x: 0.8, y: 0.6 } })

        // Mưa từ trên xuống sau 0.5s (cùng lúc)
        setTimeout(() => {
            [0.2, 0.4, 0.6, 0.8].forEach((x) => {
                confetti({
                    particleCount: 30,
                    spread: 100,
                    angle: -90,
                    gravity: 0.8,
                    origin: { x, y: 0 },
                    startVelocity: 25,
                })
            })
        }, 500)
    }, [])

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-lg mx-auto text-center">
                    {/* Icon + Tiêu đề */}
                    <div className="flex justify-center mb-6">
                        <CircleCheckBig size={72} className="text-green-500" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Đặt hàng thành công!
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Cảm ơn bạn đã mua hàng tại MAVELA
                    </p>

                    {/* Thông tin đơn hàng */}
                    <div className="bg-white rounded-lg p-6 mt-8 text-left">
                        <div className="space-y-4">
                            {/* Mã đơn hàng */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Mã đơn hàng</span>
                                <span className="font-bold text-[#111111]">
                                    #DH{String(order.orderId).padStart(5, '0')}
                                </span>
                            </div>

                            {/* Ngày đặt */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Ngày đặt</span>
                                <span className="font-medium text-gray-900">
                                    {order.orderDate}
                                </span>
                            </div>

                            {/* Phương thức thanh toán */}
                            <div className="flex justify-between">
                                <span className="text-gray-500">Thanh toán</span>
                                <span className="font-medium text-gray-900">
                                    {PAYMENT_METHODS[order.paymentMethod]}
                                </span>
                            </div>

                            {/* Đường kẻ */}
                            <div className="border-t border-gray-200"></div>

                            {/* Tổng tiền */}
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                                <span className="text-xl font-bold text-[#111111]">
                                    {formatPrice(order.totalMoney)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Nút điều hướng */}
                    <div className="mt-8 space-y-3">
                        <Link
                            to="/tai-khoan/don-hang"
                            className="block w-full bg-[#111111] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Xem đơn hàng
                        </Link>
                        <Link
                            to="/san-pham"
                            className="block w-full border border-gray-300 text-gray-700 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderSuccessPage
