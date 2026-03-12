import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
    currentPage: number      // 0-indexed
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-center gap-4 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={16} />
                Trước
            </button>
            <span className="text-sm text-gray-600">
                Trang {currentPage + 1} / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
                Sau
                <ChevronRight size={16} />
            </button>
        </div>
    )
}

export default Pagination
