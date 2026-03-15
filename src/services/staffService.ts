import api from './api'
import type { CreateStaffRequest, UpdateStaffRequest } from '../types/staff'

const staffService = {
    // Lấy danh sách nhân viên (tìm kiếm, lọc status/role, phân trang)
    getAll: async (page = 0, size = 20, keyword?: string, status?: number, role?: string) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('size', String(size))
        if (keyword) params.append('keyword', keyword)
        if (status !== undefined) params.append('status', String(status))
        if (role) params.append('role', role)

        const res = await api.get(`/staff?${params.toString()}`)
        return res.data
    },

    // Lấy chi tiết nhân viên
    getById: async (id: number) => {
        const res = await api.get(`/staff/${id}`)
        return res.data
    },

    // Tạo nhân viên mới
    create: async (data: CreateStaffRequest) => {
        const res = await api.post('/staff', data)
        return res.data
    },

    // Cập nhật nhân viên
    update: async (id: number, data: UpdateStaffRequest) => {
        const res = await api.put(`/staff/${id}`, data)
        return res.data
    },

    // Khóa/Mở khóa tài khoản
    toggleStatus: async (id: number) => {
        const res = await api.patch(`/staff/${id}`)
        return res.data
    },

    // Reset mật khẩu
    resetPassword: async (id: number) => {
        const res = await api.patch(`/staff/${id}/reset-password`)
        return res.data
    },
}

export default staffService
