import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { Category } from '../../types/category'

// Dữ liệu tạm cho filter (sau này lấy từ API)
const PRICE_RANGES = [
  { value: '0-200000', label: 'Dưới 200.000đ' },
  { value: '200000-500000', label: '200.000đ - 500.000đ' },
  { value: '500000-1000000', label: '500.000đ - 1.000.000đ' },
  { value: '1000000-up', label: 'Trên 1.000.000đ' },
]

const COLORS = [
  { value: 'den', label: 'Đen', hex: '#000000' },
  { value: 'trang', label: 'Trắng', hex: '#FFFFFF' },
  { value: 'xam', label: 'Xám', hex: '#808080' },
  { value: 'do', label: 'Đỏ', hex: '#EF4444' },
  { value: 'xanh-duong', label: 'Xanh dương', hex: '#3B82F6' },
  { value: 'xanh-la', label: 'Xanh lá', hex: '#22C55E' },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [openSections, setOpenSections] = useState(['category', 'price', 'color', 'size'])

  // Lấy giá trị filter từ URL
  const selectedCategories = searchParams.get('category')?.split(',') || []
  const selectedPrice = searchParams.get('price') || ''
  const selectedColors = searchParams.get('color')?.split(',') || []
  const selectedSizes = searchParams.get('size')?.split(',') || []

  // Hàm update URL params
  const updateParams = (key: string, value: string[]) => {
    const newParams = new URLSearchParams(searchParams)
    if (value.length > 0) {
      newParams.set(key, value.join(','))
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  // Hàm update single param (cho radio)
  const updateSingleParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, value)
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  // Toggle category
  const toggleCategory = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug]
    updateParams('category', newCategories)
  }

  // Toggle color
  const toggleColor = (value: string) => {
    const newColors = selectedColors.includes(value)
      ? selectedColors.filter((c) => c !== value)
      : [...selectedColors, value]
    updateParams('color', newColors)
  }

  // Toggle size
  const toggleSize = (value: string) => {
    const newSizes = selectedSizes.includes(value)
      ? selectedSizes.filter((s) => s !== value)
      : [...selectedSizes, value]
    updateParams('size', newSizes)
  }

  // Fetch categories
  useEffect(() => {
    fetch('/mocks/categories.json')
      .then((res) => res.json())
      .then((data) => setCategories(data))
  }, [])

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  // Kiểm tra có filter nào đang được chọn không
  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedPrice !== '' ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0

  // Xóa tất cả filter
  const clearAllFilters = () => {
    setSearchParams({})
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 -mx-4 px-4">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
          <SlidersHorizontal size={18} />
          Bộ lọc
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-[#111111]"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Danh mục */}
      <div className="border-b border-gray-200 py-4">
        <button
          className="w-full flex items-center justify-between text-left font-medium text-gray-900"
          onClick={() => toggleSection('category')}
        >
          Danh mục
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${openSections.includes('category') ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.includes('category') && (
          <div className="mt-3 space-y-2">
            {categories.map((item) => (
              <label key={item.category_id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(item.slug)}
                  onChange={() => toggleCategory(item.slug)}
                  className="w-4 h-4 rounded border-gray-300 text-[#111111] focus:ring-[#111111]"
                />
                <span className="text-sm text-gray-700">{item.category_name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Khoảng giá */}
      <div className="border-b border-gray-200 py-4">
        <button
          className="w-full flex items-center justify-between text-left font-medium text-gray-900"
          onClick={() => toggleSection('price')}
        >
          Khoảng giá
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${openSections.includes('price') ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.includes('price') && (
          <div className="mt-3 space-y-2">
            {PRICE_RANGES.map((item) => (
              <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === item.value}
                  onChange={() => updateSingleParam('price', item.value)}
                  className="w-4 h-4 border-gray-300 text-[#111111] focus:ring-[#111111]"
                />
                <span className="text-sm text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Màu sắc */}
      <div className="border-b border-gray-200 py-4">
        <button
          className="w-full flex items-center justify-between text-left font-medium text-gray-900"
          onClick={() => toggleSection('color')}
        >
          Màu sắc
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${openSections.includes('color') ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.includes('color') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                title={color.label}
                onClick={() => toggleColor(color.value)}
                className={`w-8 h-8 rounded-full border-2 transition-colors ${
                  selectedColors.includes(color.value)
                    ? 'border-[#111111]'
                    : 'border-gray-300 hover:border-[#111111]'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Size */}
      <div className="py-4">
        <button
          className="w-full flex items-center justify-between text-left font-medium text-gray-900"
          onClick={() => toggleSection('size')}
        >
          Kích thước
          <ChevronDown
            size={18}
            className={`transition-transform duration-200 ${openSections.includes('size') ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.includes('size') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 py-1.5 text-sm border rounded transition-colors ${
                  selectedSizes.includes(size)
                    ? 'border-[#111111] bg-[#111111] text-white'
                    : 'border-gray-300 hover:border-[#111111]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFilter
