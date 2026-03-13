import apiJava from './apiJava'
import type { CreateVoucherData, UpdateVoucherData } from '../types/voucher'

const voucherService = {
    // Lấy danh sách voucher
    getAll: async () => {
        const res = await apiJava.get('/vouchers')
        return res.data
    },

    // Lấy chi tiết 1 voucher
    getById: async (id: number) => {
        const res = await apiJava.get(`/vouchers/${id}`)
        return res.data
    },

    // Tạo mới
    create: async (data: CreateVoucherData) => {
        const res = await apiJava.post('/vouchers', data)
        return res.data
    },

    // Cập nhật
    update: async (id: number, data: UpdateVoucherData) => {
        const res = await apiJava.put(`/vouchers/${id}`, data)
        return res.data
    },

    // Xóa
    delete: async (id: number) => {
        const res = await apiJava.delete(`/vouchers/${id}`)
        return res.data
    },
}

export default voucherService
