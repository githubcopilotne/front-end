import { Link, useLocation } from 'react-router-dom'
import { Menu, Store, LogOut, CircleUserRound } from 'lucide-react'
import useAuthStore from '../../stores/authStore'

const PAGE_TITLES: Record<string, string> = {
    'tong-quan': 'Tổng quan',
    'khach-hang': 'Quản lý khách hàng',
    'nhan-vien': 'Quản lý nhân viên',
    'danh-muc': 'Quản lý danh mục',
    'san-pham': 'Quản lý sản phẩm',
    'don-hang': 'Quản lý đơn hàng',
    'voucher': 'Quản lý voucher',
    'danh-gia': 'Quản lý đánh giá',
}

interface AdminTopbarProps {
    onToggleSidebar: () => void
}

const AdminTopbar = ({ onToggleSidebar }: AdminTopbarProps) => {
    const { user, logout } = useAuthStore()
    const location = useLocation()

    // Lấy segment cuối của URL → map ra tên trang
    const currentPage = location.pathname.split('/').pop() || ''
    const pageTitle = PAGE_TITLES[currentPage] || 'Tổng quan'

    const handleLogout = () => {
        logout()
        window.location.href = '/'
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            {/* Left — Hamburger (mobile) + Page title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onToggleSidebar}
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <h1 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{pageTitle}</h1>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-4">
                {/* Xem cửa hàng */}
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#409EFF] transition-colors"
                >
                    <Store size={20} />
                    <span className="hidden sm:inline">Xem cửa hàng</span>
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300" />

                {/* Tên + Role */}
                <div className="flex items-center gap-1.5">
                    <CircleUserRound size={20} className="text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">{user?.fullName}</span>
                    <span className="text-xs text-gray-500">({user?.role})</span>
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-300" />

                {/* Đăng xuất */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors cursor-pointer"
                >
                    <LogOut size={20} />
                    <span className="hidden sm:inline">Đăng xuất</span>
                </button>
            </div>
        </header>
    )
}

export default AdminTopbar
