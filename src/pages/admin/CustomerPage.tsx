import { useEffect, useState } from 'react'
import { Eye, Lock, Unlock, Search, ChevronDown } from 'lucide-react'
import customerService from '../../services/customerService'
import type { CustomerListItem } from '../../types/customer'
import { formatDate, formatGender } from '../../utils/format'
import Pagination from '../../components/ui/Pagination'
import CustomerDetailModal from '../../components/admin/customer/CustomerDetailModal'
import CustomerStatusDialog from '../../components/admin/customer/CustomerStatusDialog'
import useAuthStore from '../../stores/authStore'

const CustomerPage = () => {
    const user = useAuthStore(state => state.user)
    const isAdmin = user?.role === 'Admin'

    const [customers, setCustomers] = useState<CustomerListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')

    // Phân trang
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 19

    // Tìm kiếm + Lọc
    const [keyword, setKeyword] = useState('')
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined)

    // Modal chi tiết
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)

    // Dialog khóa/mở khóa
    const [statusCustomer, setStatusCustomer] = useState<CustomerListItem | null>(null)
    const [showStatusDialog, setShowStatusDialog] = useState(false)

    // Lấy danh sách khách hàng
    const fetchCustomers = async (page = 0) => {
        try {
            setLoading(true)
            setApiError('')
            const res = await customerService.getAll(page, pageSize, keyword.trim() || undefined, statusFilter)
            if (res.success) {
                setCustomers(res.data.content)
                setTotalPages(res.data.totalPages)
                setCurrentPage(res.data.number)
            } else {
                setApiError(res.message)
            }
        } catch (err: any) {
            setApiError(err.response?.data?.message || 'Không thể kết nối server')
        } finally {
            setLoading(false)
        }
    }

    // Gọi API khi lần đầu load hoặc khi đổi filter status
    useEffect(() => {
        fetchCustomers(0)
    }, [statusFilter])

    // Tìm kiếm khi nhấn Enter hoặc nút Search
    const handleSearch = () => {
        fetchCustomers(0)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch()
    }

    // Lọc theo status — chỉ set state, useEffect sẽ tự gọi API
    const handleStatusFilter = (value: string) => {
        setStatusFilter(value === '' ? undefined : Number(value))
    }

    // Mở dialog khóa/mở khóa
    const handleToggleStatus = (customer: CustomerListItem) => {
        setStatusCustomer(customer)
        setShowStatusDialog(true)
    }

    // Mở modal chi tiết
    const handleViewDetail = (id: number) => {
        setSelectedCustomerId(id)
        setShowDetailModal(true)
    }

    return (
        <div>
            {/* Header: Tìm kiếm + Lọc */}
            <div className="flex items-center gap-3 mb-4">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm theo tên, email, SĐT..."
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#409EFF] transition-colors cursor-pointer"
                    >
                        <Search size={16} />
                    </button>
                </div>

                {/* Dropdown lọc status */}
                <div className="relative">
                    <select
                        value={statusFilter === undefined ? '' : statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="appearance-none pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors cursor-pointer bg-white"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Bị khóa</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Lỗi từ API */}
            {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {apiError}
                </div>
            )}

            {/* Bảng khách hàng */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap w-12">STT</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Họ tên</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Email</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">SĐT</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Giới tính</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Ngày tham gia</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-400 text-sm">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-gray-400 text-sm">
                                    Không tìm thấy khách hàng nào
                                </td>
                            </tr>
                        ) : (
                            customers.map((c, index) => (
                                <tr key={c.userId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {currentPage * pageSize + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                        {c.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{c.phone || '—'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatGender(c.gender)}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                                    <td className="px-4 py-3">
                                        {c.status === 1 ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-green-50 text-green-600 whitespace-nowrap">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-500 whitespace-nowrap">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                                Bị khóa
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleViewDetail(c.userId)}
                                                className="p-1.5 text-gray-400 hover:text-[#409EFF] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleToggleStatus(c)}
                                                    className={`p-1.5 rounded transition-colors cursor-pointer ${c.status === 1
                                                        ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                        : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                                                        }`}
                                                    title={c.status === 1 ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                                >
                                                    {c.status === 1 ? <Lock size={16} /> : <Unlock size={16} />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={fetchCustomers}
            />

            {/* Modal chi tiết */}
            <CustomerDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                customerId={selectedCustomerId}
            />

            {/* Dialog khóa/mở khóa */}
            <CustomerStatusDialog
                isOpen={showStatusDialog}
                customerId={statusCustomer?.userId ?? null}
                customerName={statusCustomer?.fullName ?? ''}
                currentStatus={statusCustomer?.status ?? 1}
                onClose={() => setShowStatusDialog(false)}
                onSuccess={() => fetchCustomers(currentPage)}
            />
        </div>
    )
}

export default CustomerPage
