import { useEffect, useState } from 'react'
import { Eye, Lock, Unlock, Search, ChevronDown, Plus, Pencil, KeyRound } from 'lucide-react'
import staffService from '../../services/staffService'
import type { StaffListItem } from '../../types/staff'
import type { StaffDetail } from '../../types/staff'
import { formatDate, formatGender } from '../../utils/format'
import Pagination from '../../components/ui/Pagination'
import StaffStatusDialog from '../../components/admin/staff/StaffStatusDialog'
import StaffResetPasswordDialog from '../../components/admin/staff/StaffResetPasswordDialog'
import StaffFormModal from '../../components/admin/staff/StaffFormModal'
import StaffDetailModal from '../../components/admin/staff/StaffDetailModal'

const StaffPage = () => {
    const [staffList, setStaffList] = useState<StaffListItem[]>([])
    const [loading, setLoading] = useState(true)
    const [apiError, setApiError] = useState('')

    // Phân trang
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const pageSize = 19

    // Tìm kiếm + Lọc
    const [keyword, setKeyword] = useState('')
    const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined)
    const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined)

    // Dialog khóa/mở khóa
    const [statusStaff, setStatusStaff] = useState<StaffListItem | null>(null)
    const [showStatusDialog, setShowStatusDialog] = useState(false)

    // Dialog reset mật khẩu
    const [resetStaff, setResetStaff] = useState<StaffListItem | null>(null)
    const [showResetDialog, setShowResetDialog] = useState(false)

    // Form tạo/sửa
    const [formStaffData, setFormStaffData] = useState<StaffDetail | null>(null)
    const [showFormModal, setShowFormModal] = useState(false)

    // Modal chi tiết
    const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [detailRefreshTrigger, setDetailRefreshTrigger] = useState(0)

    // Lấy danh sách nhân viên
    const fetchStaff = async (page = 0) => {
        try {
            setLoading(true)
            setApiError('')
            const res = await staffService.getAll(page, pageSize, keyword.trim() || undefined, statusFilter, roleFilter)
            if (res.success) {
                setStaffList(res.data.content)
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

    // Gọi API khi lần đầu load hoặc khi đổi filter
    useEffect(() => {
        fetchStaff(0)
    }, [statusFilter, roleFilter])

    // Tìm kiếm khi nhấn Enter hoặc nút Search
    const handleSearch = () => {
        fetchStaff(0)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch()
    }

    return (
        <div>
            {/* Header: Tìm kiếm + Lọc + Nút tạo */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                {/* Ô tìm kiếm */}
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Tìm theo tên, email, SĐT, mã NV"
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
                        onChange={(e) => setStatusFilter(e.target.value === '' ? undefined : Number(e.target.value))}
                        className="appearance-none pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors cursor-pointer bg-white"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="1">Hoạt động</option>
                        <option value="0">Bị khóa</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Dropdown lọc role */}
                <div className="relative">
                    <select
                        value={roleFilter || ''}
                        onChange={(e) => setRoleFilter(e.target.value || undefined)}
                        className="appearance-none pl-3 pr-9 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#409EFF] transition-colors cursor-pointer bg-white"
                    >
                        <option value="">Tất cả role</option>
                        <option value="Admin">Admin</option>
                        <option value="Staff">Staff</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Nút tạo nhân viên */}
                <button
                    onClick={() => { setFormStaffData(null); setShowFormModal(true) }}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#409EFF] text-white rounded-lg text-sm font-medium hover:bg-[#3a8ee6] transition-colors cursor-pointer"
                >
                    <Plus size={16} />
                    Tạo nhân viên
                </button>
            </div>

            {/* Lỗi từ API */}
            {apiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">
                    {apiError}
                </div>
            )}

            {/* Bảng nhân viên */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap w-12">STT</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Mã NV</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Họ tên</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Email</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">SĐT</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Giới tính</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Role</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Ngày vào làm</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Trạng thái</th>
                            <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600 whitespace-nowrap">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-gray-400 text-sm">
                                    Đang tải...
                                </td>
                            </tr>
                        ) : staffList.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-gray-400 text-sm">
                                    Không tìm thấy nhân viên nào
                                </td>
                            </tr>
                        ) : (
                            staffList.map((s, index) => (
                                <tr key={s.userId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {currentPage * pageSize + index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-[#409EFF]">
                                        {s.employeeCode || '—'}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                        {s.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{s.phone || '—'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                        {s.gender !== null ? formatGender(s.gender) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${s.role === 'Admin'
                                                ? 'bg-purple-50 text-purple-600'
                                                : 'bg-blue-50 text-blue-600'
                                            }`}>
                                            {s.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                                        {s.hireDate ? formatDate(s.hireDate) : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        {s.status === 1 ? (
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
                                                onClick={() => { setSelectedStaffId(s.userId); setShowDetailModal(true) }}
                                                className="p-1.5 text-gray-400 hover:text-[#409EFF] hover:bg-blue-50 rounded transition-colors cursor-pointer"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const res = await staffService.getById(s.userId)
                                                        if (res.success) {
                                                            setFormStaffData(res.data)
                                                            setShowFormModal(true)
                                                        }
                                                    } catch { /* ignore */ }
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors cursor-pointer"
                                                title="Sửa"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setStatusStaff(s); setShowStatusDialog(true) }}
                                                className={`p-1.5 rounded transition-colors cursor-pointer ${s.status === 1
                                                    ? 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                    : 'text-gray-400 hover:text-green-500 hover:bg-green-50'
                                                    }`}
                                                title={s.status === 1 ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                                            >
                                                {s.status === 1 ? <Lock size={16} /> : <Unlock size={16} />}
                                            </button>
                                            <button
                                                onClick={() => { setResetStaff(s); setShowResetDialog(true) }}
                                                className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded transition-colors cursor-pointer"
                                                title="Reset mật khẩu"
                                            >
                                                <KeyRound size={16} />
                                            </button>
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
                onPageChange={fetchStaff}
            />

            {/* Dialog khóa/mở khóa */}
            <StaffStatusDialog
                isOpen={showStatusDialog}
                staffId={statusStaff?.userId ?? null}
                staffName={statusStaff?.fullName ?? ''}
                currentStatus={statusStaff?.status ?? 1}
                onClose={() => setShowStatusDialog(false)}
                onSuccess={() => { fetchStaff(currentPage); setDetailRefreshTrigger(prev => prev + 1) }}
            />

            {/* Dialog reset mật khẩu */}
            <StaffResetPasswordDialog
                isOpen={showResetDialog}
                staffId={resetStaff?.userId ?? null}
                staffName={resetStaff?.fullName ?? ''}
                onClose={() => setShowResetDialog(false)}
            />

            {/* Form tạo/sửa */}
            <StaffFormModal
                isOpen={showFormModal}
                staffData={formStaffData}
                onClose={() => setShowFormModal(false)}
                onSuccess={() => { fetchStaff(currentPage); setDetailRefreshTrigger(prev => prev + 1) }}
            />

            {/* Modal chi tiết */}
            <StaffDetailModal
                isOpen={showDetailModal}
                onClose={() => setShowDetailModal(false)}
                staffId={selectedStaffId}
                refreshTrigger={detailRefreshTrigger}
                onEdit={(staff) => {
                    setFormStaffData(staff)
                    setShowFormModal(true)
                }}
                onToggleStatus={(staff) => {
                    setStatusStaff(staff as any)
                    setShowStatusDialog(true)
                }}
                onResetPassword={(staff) => {
                    setResetStaff(staff as any)
                    setShowResetDialog(true)
                }}
            />
        </div>
    )
}

export default StaffPage
