import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Heart, ShoppingBag, CircleUserRound, Menu, X, ChevronDown } from 'lucide-react'
import type { Category } from '../../types/category'
import useAuthStore from '../../stores/authStore'
import SearchDropdown from './SearchDropdown'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user } = useAuthStore()

  useEffect(() => {
    fetch('/mocks/categories.json')
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-[#111111]">
            MAVELA
          </Link>

          {/* Menu - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-800 hover:text-[#111111] font-medium transition-colors"
            >
              Trang chủ
            </Link>

            {/* Sản phẩm với dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsProductDropdownOpen(true)}
              onMouseLeave={() => setIsProductDropdownOpen(false)}
            >
              <Link
                to="/san-pham"
                className="flex items-center gap-1 text-gray-800 hover:text-[#111111] font-medium transition-colors"
              >
                Sản phẩm
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${isProductDropdownOpen ? 'rotate-180' : ''}`}
                />
              </Link>

              {/* Dropdown */}
              <div
                className={`absolute top-full left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out origin-top ${isProductDropdownOpen ? 'max-h-96 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'
                  }`}
              >
                <div className="py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.category_id}
                      to={`/san-pham/${category.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#111111] transition-colors"
                    >
                      {category.category_name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      to="/san-pham"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-[#111111] font-medium transition-colors"
                    >
                      Tất cả sản phẩm
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              to="/gioi-thieu"
              className="text-gray-800 hover:text-[#111111] font-medium transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              to="/lien-he"
              className="text-gray-800 hover:text-[#111111] font-medium transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              className="p-2 text-gray-800 hover:text-[#111111] transition-colors"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              data-search-toggle
            >
              <Search size={20} />
            </button>
            <Link to="/tai-khoan/yeu-thich" className="p-2 text-gray-800 hover:text-[#111111] transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/gio-hang" className="p-2 text-gray-800 hover:text-[#111111] transition-colors relative">
              <ShoppingBag size={20} />
              {/* Badge số lượng giỏ hàng */}
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                0
              </span>
            </Link>
            {/* Nút đăng nhập / Tên user - Desktop */}
            {user ? (
              <Link to="/tai-khoan" className="hidden lg:flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                <CircleUserRound size={20} className='mt-0.5' />
                <span className="text-sm mt-0.5">{user.fullName}</span>
              </Link>
            ) : (
              <Link to="/dang-nhap" className="hidden lg:flex items-center gap-2 bg-[#111111] text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                <CircleUserRound size={20} className='mt-0.5' />
                <span className="text-sm mt-0.5">Đăng nhập</span>
              </Link>
            )}
            {/* Nút đăng nhập / Tên user - Tablet */}
            <Link to={user ? '/tai-khoan' : '/dang-nhap'} className="lg:hidden p-2 text-gray-800 hover:text-[#111111] transition-colors">
              <CircleUserRound size={20} />
            </Link>
          </div>

          {/* Mobile - Icons & Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button className="p-2 text-gray-800" onClick={() => setIsSearchOpen(!isSearchOpen)} data-search-toggle>
              <Search size={20} />
            </button>
            <Link to="/tai-khoan/yeu-thich" className="p-2 text-gray-800">
              <Heart size={20} />
            </Link>
            <Link to="/gio-hang" className="p-2 text-gray-800">
              <ShoppingBag size={20} />
            </Link>
            <Link to={user ? '/tai-khoan' : '/dang-nhap'} className="p-2 text-gray-800">
              <CircleUserRound size={20} />
            </Link>
            <button
              className="p-2 text-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Search Dropdown */}
      <SearchDropdown isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu - Slide from right */}
      <div className="md:hidden">
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${isMobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
            }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
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
            <Link
              to="/"
              className="py-3 text-gray-800 hover:text-[#111111] font-medium transition-colors border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang chủ
            </Link>

            {/* Sản phẩm với accordion - giống style Footer */}
            <div className="border-b border-gray-100">
              <button
                className="w-full py-3 flex items-center justify-between text-gray-800 hover:text-[#111111] font-medium transition-colors"
                onClick={() => toggleSection('product')}
              >
                Sản phẩm
                <ChevronDown
                  size={20}
                  className={`transition-transform duration-300 ${openSection === 'product' ? 'rotate-180' : ''}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out origin-top ${openSection === 'product' ? 'max-h-60 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0'
                  }`}
              >
                <div className="pl-4 pb-2 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.category_id}
                      to={`/san-pham/${category.slug}`}
                      className="block py-2 text-gray-600 hover:text-[#111111] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.category_name}
                    </Link>
                  ))}
                  <Link
                    to="/san-pham"
                    className="block py-2 text-gray-800 hover:text-[#111111] font-medium transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Tất cả sản phẩm
                  </Link>
                </div>
              </div>
            </div>

            <Link
              to="/gioi-thieu"
              className="py-3 text-gray-800 hover:text-[#111111] font-medium transition-colors border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              to="/lien-he"
              className="py-3 text-gray-800 hover:text-[#111111] font-medium transition-colors border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
