import apiJava from './apiJava'
import type { CreateCategoryData, UpdateCategoryData } from '../types/category'

const categoryService = {
    // Lấy danh sách danh mục
    getAll: async () => {
        const res = await apiJava.get('/categories')
        return res.data
    },

    // Lấy chi tiết 1 danh mục (dùng khi mở form sửa)
    getById: async (id: number) => {
        const res = await apiJava.get(`/categories/${id}`)
        return res.data
    },

    // Tạo mới
    create: async (data: CreateCategoryData) => {
        const res = await apiJava.post('/categories', data)
        return res.data
    },

    // Cập nhật
    update: async (id: number, data: UpdateCategoryData) => {
        const res = await apiJava.put(`/categories/${id}`, data)
        return res.data
    },

    // Xóa
    delete: async (id: number) => {
        const res = await apiJava.delete(`/categories/${id}`)
        return res.data
    },
}

export default categoryService
