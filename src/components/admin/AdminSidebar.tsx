import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    UserCog,
    FolderOpen,
    ShoppingBag,
    Package,
    Ticket,
    Star,
} from 'lucide-react'

const ADMIN_MENU = [
    { to: '/admin/tong-quan', label: 'Tổng quan', icon: <LayoutDashboard size={20} /> },
    { to: '/admin/khach-hang', label: 'Khách hàng', icon: <Users size={20} /> },
    { to: '/admin/nhan-vien', label: 'Nhân viên', icon: <UserCog size={20} /> },
    { to: '/admin/danh-muc', label: 'Danh mục', icon: <FolderOpen size={20} /> },
    { to: '/admin/san-pham', label: 'Sản phẩm', icon: <ShoppingBag size={20} /> },
    { to: '/admin/don-hang', label: 'Đơn hàng', icon: <Package size={20} /> },
    { to: '/admin/voucher', label: 'Voucher', icon: <Ticket size={20} /> },
    { to: '/admin/danh-gia', label: 'Đánh giá', icon: <Star size={20} /> },
]

interface AdminSidebarProps {
    isOpen: boolean
    onClose: () => void
}

const AdminSidebar = ({ isOpen, onClose }: AdminSidebarProps) => {
    return (
        <>
            {/* Overlay — mobile only */}
            <div
                className={`fixed inset-0 bg-black z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 z-50 lg:z-0 lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                style={{ backgroundColor: '#1e293b' }}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-center px-6 border-b border-slate-700">
                    <span className="text-2xl font-bold text-white tracking-wide">MAVELA</span>
                </div>

                {/* Menu */}
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {ADMIN_MENU.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-[#409EFF] text-white'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default AdminSidebar
