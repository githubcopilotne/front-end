import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react'
import type { Product } from '../../types/product'
import ProductCard from '../../components/common/ProductCard'
import ProductFilter from '../../components/product/ProductFilter'
import Pagination from '../../components/common/Pagination'

const SORT_OPTIONS = [
  { value: 'moi-nhat', label: 'Mới nhất' },
  { value: 'ban-chay', label: 'Bán chạy' },
  { value: 'gia-thap', label: 'Giá thấp đến cao' },
  { value: 'gia-cao', label: 'Giá cao đến thấp' },
]

const ITEMS_PER_PAGE = 9

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSortOpen, setIsSortOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Lấy sort và page từ URL
  const sort = searchParams.get('sort') || 'moi-nhat'
  const currentPage = Number(searchParams.get('page')) || 1

  // Hàm update search params (giữ lại các params hiện có)
  const updateSearchParams = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      newParams.set(key, value)
    })
    setSearchParams(newParams)
  }

  // Hàm update sort lên URL (reset về trang 1)
  const setSort = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('sort', value)
    newParams.delete('page') // Reset về trang 1 khi đổi sort
    setSearchParams(newParams)
  }

  // Hàm đổi trang
  const handlePageChange = (page: number) => {
    if (page === 1) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('page') // Không hiện ?page=1 trên URL
      setSearchParams(newParams)
    } else {
      updateSearchParams({ page: String(page) })
    }
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Fetch products khi component mount
  useEffect(() => {
    fetch('/mocks/products.json')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setIsLoading(false)
      })
  }, [])

  // Tính toán phân trang
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, products.length)
  const currentProducts = products.slice(startIndex, endIndex)

  // Lấy label của sort hiện tại
  const currentSortLabel = SORT_OPTIONS.find((s) => s.value === sort)?.label || 'Mới nhất'

  // Hiển thị loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-gray-500">Đang tải...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header: Tiêu đề + Sort */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Tất cả sản phẩm
            </h1>
            <p className="text-gray-500 mt-1">
              Hiển thị {startIndex + 1}-{endIndex} trên {products.length} sản phẩm
            </p>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-3">
            {/* Nút mở filter trên mobile */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
            >
              <SlidersHorizontal size={16} />
              <span className="text-sm">Bộ lọc</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
              >
                <ArrowUpDown size={16} />
                <span className="text-sm">Sắp xếp: {currentSortLabel}</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown menu */}
              {isSortOpen && (
                <>
                  {/* Overlay để đóng dropdown khi click ra ngoài */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsSortOpen(false)}
                  />
                  {/* Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSort(option.value)
                          setIsSortOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${sort === option.value ? 'text-[#111111] font-medium' : 'text-gray-700'
                          }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main content: Sidebar + Grid */}
        <div className="flex gap-8">
          {/* Sidebar filter - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <ProductFilter />
            </div>
          </aside>

          {/* Grid sản phẩm + Pagination */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {currentProducts.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 mb-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setIsFilterOpen(false)}
          />
          {/* Drawer */}
          <div
            className={`fixed top-0 left-0 h-full w-80 bg-white z-50 overflow-y-auto transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-2xl font-bold text-[#111111]">MAVELA</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <ProductFilter />
            </div>
          </div>
        </>
      </div>
    </div>
  )
}

export default ProductListPage
