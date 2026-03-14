import apiJava from './apiJava'

const customerService = {
    // Lấy danh sách khách hàng (tìm kiếm, lọc status, phân trang)
    getAll: async (page = 0, size = 20, keyword?: string, status?: number) => {
        const params = new URLSearchParams()
        params.append('page', String(page))
        params.append('size', String(size))
        if (keyword) params.append('keyword', keyword)
        if (status !== undefined) params.append('status', String(status))

        const res = await apiJava.get(`/customers?${params.toString()}`)
        return res.data
    },

    // Lấy chi tiết khách hàng
    getById: async (id: number) => {
        const res = await apiJava.get(`/customers/${id}`)
        return res.data
    },

    // Khóa/Mở khóa tài khoản
    toggleStatus: async (id: number) => {
        const res = await apiJava.patch(`/customers/${id}/status`)
        return res.data
    },
}

export default customerService
