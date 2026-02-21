import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    User as UserIcon,
    Package,
    Heart,
    Lock,
    LogOut,
} from 'lucide-react'
import type { User } from '../../types/user'
import ProfileSection from '../../components/profile/ProfileSection'
import OrdersSection from '../../components/profile/OrdersSection'
import WishlistSection from '../../components/profile/WishlistSection'
import PasswordSection from '../../components/profile/PasswordSection'

type TabKey = 'profile' | 'orders' | 'wishlist' | 'password'

const MENU_ITEMS: { key: TabKey | 'logout'; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'Thông tin cá nhân', icon: <UserIcon size={20} /> },
    { key: 'orders', label: 'Đơn hàng của tôi', icon: <Package size={20} /> },
    { key: 'wishlist', label: 'Yêu thích', icon: <Heart size={20} /> },
    { key: 'password', label: 'Đổi mật khẩu', icon: <Lock size={20} /> },
    { key: 'logout', label: 'Đăng xuất', icon: <LogOut size={20} /> },
]

const ProfilePage = () => {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState<TabKey>('profile')
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch user data
    useEffect(() => {
        fetch('/mocks/user.json')
            .then((res) => res.json())
            .then((data) => {
                setUser(data)
                setIsLoading(false)
            })
    }, [])

    const handleLogout = () => {
        if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
            // TODO: Clear auth state
            navigate('/')
        }
    }

    const handleMenuClick = (key: TabKey | 'logout') => {
        if (key === 'logout') {
            handleLogout()
        } else {
            setActiveTab(key)
        }
    }

    if (isLoading || !user) {
        return (
            <div className="container mx-auto px-4 py-12">
                <p className="text-center text-gray-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar - Desktop */}
                    <aside className="hidden lg:block w-72 shrink-0">
                        <div className="bg-white rounded-lg overflow-hidden">
                            {/* Menu */}
                            <nav className="p-2">
                                {MENU_ITEMS.map((item) => (
                                    <button
                                        key={item.key}
                                        onClick={() => handleMenuClick(item.key)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${item.key === 'logout'
                                            ? 'text-red-600 hover:bg-red-50 mt-2'
                                            : activeTab === item.key
                                                ? 'bg-[#111111] text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Mobile tabs */}
                    <div className="lg:hidden overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2 min-w-max">
                            {MENU_ITEMS.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => handleMenuClick(item.key)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${item.key === 'logout'
                                        ? 'text-red-600 border border-red-200 hover:bg-red-50'
                                        : activeTab === item.key
                                            ? 'bg-[#111111] text-white'
                                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                                        }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">
                        <div className="bg-white rounded-lg p-6 md:p-8">
                            {activeTab === 'profile' && <ProfileSection user={user} setUser={setUser} />}
                            {activeTab === 'orders' && <OrdersSection />}
                            {activeTab === 'wishlist' && <WishlistSection />}
                            {activeTab === 'password' && <PasswordSection />}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
