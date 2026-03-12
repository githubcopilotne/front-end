import { NavLink, Outlet, Link } from 'react-router-dom'
import {
    User as UserIcon,
    Package,
    Heart,
    Lock,
    LogOut,
    LayoutDashboard,
} from 'lucide-react'
import useAuthStore from '../../stores/authStore'

const MENU_ITEMS: { to: string; label: string; icon: React.ReactNode }[] = [
    { to: 'thong-tin', label: 'Thông tin cá nhân', icon: <UserIcon size={20} /> },
    { to: 'don-hang', label: 'Đơn hàng của tôi', icon: <Package size={20} /> },
    { to: 'yeu-thich', label: 'Yêu thích', icon: <Heart size={20} /> },
    { to: 'doi-mat-khau', label: 'Đổi mật khẩu', icon: <Lock size={20} /> },
]

const ProfilePage = () => {
    const { user, logout } = useAuthStore()

    const isAdmin = user?.role === 'Admin'

    const handleLogout = () => {
        logout()
        window.location.href = '/'
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="bg-white rounded-lg overflow-hidden">
                            <nav className="p-2">
                                {/* Nút Quản trị — chỉ hiện cho admin */}
                                {isAdmin && (
                                    <>
                                        <Link
                                            to="/admin"
                                            className="admin-btn w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium cursor-pointer"
                                        >
                                            <LayoutDashboard size={20} />
                                            <span>Quản trị Admin</span>
                                            <span className="admin-dot ml-auto rounded-full bg-current" style={{ width: 6, height: 6 }} />
                                        </Link>
                                        <hr className="my-2 border-gray-200" />
                                    </>
                                )}

                                {MENU_ITEMS.map((item) => (
                                    <NavLink
                                        key={item.to}
                                        to={item.to}
                                        className={({ isActive }) =>
                                            `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${isActive
                                                ? 'bg-[#111111] text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`
                                        }
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </NavLink>
                                ))}
                                {/* Divider + Logout button */}
                                <hr className="my-2 border-gray-200" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-red-600 hover:bg-red-50"
                                >
                                    <LogOut size={20} />
                                    <span className="font-medium">Đăng xuất</span>
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Mobile tabs */}
                    <div className="lg:hidden overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2 min-w-max">
                            {/* Nút Quản trị mobile — chỉ hiện cho admin */}
                            {isAdmin && (
                                <>
                                    <Link
                                        to="/admin"
                                        className="admin-btn flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium cursor-pointer"
                                    >
                                        <LayoutDashboard size={20} />
                                        Quản trị Admin
                                        <span className="admin-dot rounded-full bg-current" style={{ width: 6, height: 6 }} />
                                    </Link>
                                    <div className="w-px h-8 bg-gray-300 mx-1" />
                                </>
                            )}

                            {MENU_ITEMS.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${isActive
                                            ? 'bg-[#111111] text-white'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                                        }`
                                    }
                                >
                                    {item.icon}
                                    {item.label}
                                </NavLink>
                            ))}
                            {/* Divider + Logout button */}
                            <div className="w-px h-8 bg-gray-300 mx-1" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors text-red-600 border border-red-200 hover:bg-red-50"
                            >
                                <LogOut size={20} />
                                Đăng xuất
                            </button>
                        </div>
                    </div>

                    {/* Main content - Outlet renders the matched child route */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg p-6 md:p-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
