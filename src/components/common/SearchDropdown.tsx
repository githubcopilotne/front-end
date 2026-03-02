import { useRef, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchDropdownProps {
    isOpen: boolean
    onClose: () => void
}

const SearchDropdown = ({ isOpen, onClose }: SearchDropdownProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Auto focus khi mở
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Click bên ngoài → đóng (trừ nút search toggle trên Header)
    useEffect(() => {
        if (!isOpen) return

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            // Bỏ qua click vào nút search toggle trên Header
            if (target.closest('[data-search-toggle]')) return
            if (dropdownRef.current && !dropdownRef.current.contains(target)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen, onClose])

    return (
        <div
            ref={dropdownRef}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                }`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        ref={inputRef}
                        type="search"
                        placeholder="Tìm kiếm sản phẩm..."
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors [&::-webkit-search-cancel-button]:cursor-pointer"
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchDropdown
