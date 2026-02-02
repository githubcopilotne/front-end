import { useState } from 'react'
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/san-pham' },
    { label: 'Giới thiệu', href: '/gioi-thieu' },
    { label: 'Liên hệ', href: '/lien-he' },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-[#111111]">
            MAVELA
          </a>

          {/* Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-800 hover:text-[#111111] font-medium transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-800 hover:text-[#111111] transition-colors">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-800 hover:text-[#111111] transition-colors">
              <Heart size={20} />
            </button>
            <button className="p-2 text-gray-800 hover:text-[#111111] transition-colors relative">
              <ShoppingBag size={20} />
              {/* Badge số lượng giỏ hàng */}
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </button>
            <button className="p-2 text-gray-800 hover:text-[#111111] transition-colors">
              <User size={20} />
            </button>
          </div>

          {/* Mobile - Icons & Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            
             <button className="p-2 text-gray-800">
                <Search size={20} />
              </button>
              <button className="p-2 text-gray-800">
                <Heart size={20} />
              </button>
              <button className="p-2 text-gray-800">
              <ShoppingBag  size={20} />
              </button>
              <button className="p-2 text-gray-800">
                <User size={20} />
              </button>
            <button
              className="p-2 text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu - Slide from right */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
            isMobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close button */}
          <div className="flex justify-start p-4 border-b border-gray-200">
            <button
              className="p-2 text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex flex-col p-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-3 text-gray-800 hover:text-[#111111] font-medium transition-colors border-b border-gray-100"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
