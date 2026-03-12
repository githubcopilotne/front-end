import apiJava from './apiJava'
import type { CreateProductData } from '../types/product'

const productService = {
    // Lấy danh sách sản phẩm (có phân trang)
    getAll: async (page = 0, size = 10) => {
        const res = await apiJava.get(`/products?page=${page}&size=${size}`)
        return res.data
    },

    // Tạo sản phẩm mới
    create: async (data: CreateProductData) => {
        const res = await apiJava.post('/products', data)
        return res.data
    },
}

export default productService
