import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    // Không hiển thị nếu chỉ có 1 trang
    if (totalPages <= 1) return null

    // Tạo danh sách các trang cần hiển thị
    const getPageNumbers = (): (number | '...')[] => {
        const pages: (number | '...')[] = []

        if (totalPages <= 7) {
            // Hiện hết nếu ít trang
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Luôn hiện trang 1
            pages.push(1)

            if (currentPage > 3) {
                pages.push('...')
            }

            // Các trang xung quanh trang hiện tại
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            if (currentPage < totalPages - 2) {
                pages.push('...')
            }

            // Luôn hiện trang cuối
            pages.push(totalPages)
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <nav className="flex items-center justify-center gap-1 sm:gap-2" aria-label="Phân trang">
            {/* Nút Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                aria-label="Trang trước"
            >
                <ChevronLeft size={18} />
            </button>

            {/* Các nút số trang */}
            {pages.map((page, index) =>
                page === '...' ? (
                    <span
                        key={`ellipsis-${index}`}
                        className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 text-gray-400 text-sm select-none"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                ? 'bg-[#111111] text-white'
                                : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                        aria-label={`Trang ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Nút Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                aria-label="Trang sau"
            >
                <ChevronRight size={18} />
            </button>
        </nav>
    )
}

export default Pagination
