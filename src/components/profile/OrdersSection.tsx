import { Package } from 'lucide-react'
import { Link } from 'react-router-dom'

const OrdersSection = () => {
    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h2>
            <div className="text-center py-16">
                <Package size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Bạn chưa có đơn hàng nào</p>
                <Link
                    to="/san-pham"
                    className="inline-block mt-4 px-6 py-3 bg-[#111111] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Mua sắm ngay
                </Link>
            </div>
        </div>
    )
}

export default OrdersSection
