import { useState } from 'react'
import { Facebook, Instagram, Youtube, ChevronDown } from 'lucide-react'

const Footer = () => {
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="bg-[#111111] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {/* Cột 1: Logo + Mô tả */}
          <div>
            <a href="/" className="text-2xl font-bold">
              MAVELA
            </a>
            <p className="mt-4 text-gray-400 text-sm">
              Thời trang chất lượng cao dành cho tất cả mọi người.
              Phong cách hiện đại, giá cả hợp lý.
            </p>
          </div>

          {/* Cột 2: Hỗ trợ khách hàng */}
          <div>
            {/* Desktop: hiện bình thường */}
            <h3 className="hidden md:block font-semibold text-lg mb-4">Hỗ trợ khách hàng</h3>

            {/* Mobile: accordion */}
            <button
              className="md:hidden flex items-center justify-between w-full font-semibold text-lg py-2"
              onClick={() => toggleSection('support')}
            >
              Hỗ trợ khách hàng 
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${openSection === 'support' ? 'rotate-180' : ''}`}
              />
            </button>

            <ul className={`space-y-2 text-gray-400 text-sm overflow-hidden transition-all duration-300 ease-in-out origin-top md:max-h-none md:opacity-100 md:scale-y-100 ${openSection === 'support' ? 'max-h-40 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0 md:max-h-none md:opacity-100 md:scale-y-100'}`}>
              <li>
                <a href="/huong-dan-mua-hang" className="hover:text-white transition-colors">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="/chinh-sach-doi-tra" className="hover:text-white transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="/chinh-sach-van-chuyen" className="hover:text-white transition-colors">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="/faq" className="hover:text-white transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 3: Về chúng tôi */}
          <div>
            {/* Desktop: hiện bình thường */}
            <h3 className="hidden md:block font-semibold text-lg mb-4">Về chúng tôi</h3>

            {/* Mobile: accordion */}
            <button
              className="md:hidden flex items-center justify-between w-full font-semibold text-lg py-2"
              onClick={() => toggleSection('about')}
            >
              Về chúng tôi
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${openSection === 'about' ? 'rotate-180' : ''}`}
              />
            </button>

            <ul className={`space-y-2 text-gray-400 text-sm overflow-hidden transition-all duration-300 ease-in-out origin-top md:max-h-none md:opacity-100 md:scale-y-100 ${openSection === 'about' ? 'max-h-40 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0 md:max-h-none md:opacity-100 md:scale-y-100'}`}>
              <li>
                <a href="/gioi-thieu" className="hover:text-white transition-colors">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="/lien-he" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="/tuyen-dung" className="hover:text-white transition-colors">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            {/* Desktop: hiện bình thường */}
            <h3 className="hidden md:block font-semibold text-lg mb-4">Liên hệ</h3>

            {/* Mobile: accordion */}
            <button
              className="md:hidden flex items-center justify-between w-full font-semibold text-lg py-2"
              onClick={() => toggleSection('contact')}
            >
              Liên hệ
              <ChevronDown
                size={20}
                className={`transition-transform duration-300 ${openSection === 'contact' ? 'rotate-180' : ''}`}
              />
            </button>

            <div className={`overflow-hidden transition-all duration-300 ease-in-out origin-top md:max-h-none md:opacity-100 md:scale-y-100 ${openSection === 'contact' ? 'max-h-40 opacity-100 scale-y-100' : 'max-h-0 opacity-0 scale-y-0 md:max-h-none md:opacity-100 md:scale-y-100'}`}>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</li>
                <li>Điện thoại: 0123 456 789</li>
                <li>Email: contact@mavela.vn</li>
              </ul>

              {/* Mạng xã hội */}
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          © 2025 MAVELA. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  )
}

export default Footer
