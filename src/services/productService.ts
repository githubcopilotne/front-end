import apiJava from './apiJava'
import type { CreateProductData, UpdateProductData } from '../types/product'

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

    // Lấy chi tiết sản phẩm
    getById: async (id: number) => {
        const res = await apiJava.get(`/products/${id}`)
        return res.data
    },

    // Toggle ẩn/hiện sản phẩm
    toggleStatus: async (id: number) => {
        const res = await apiJava.patch(`/products/${id}/status`)
        return res.data
    },

    // Xóa sản phẩm
    deleteProduct: async (id: number) => {
        const res = await apiJava.delete(`/products/${id}`)
        return res.data
    },

    // Cập nhật thông tin sản phẩm
    updateProduct: async (id: number, data: UpdateProductData) => {
        const res = await apiJava.put(`/products/${id}`, data)
        return res.data
    },

    // Thêm biến thể (gửi array)
    addVariants: async (productId: number, variants: { color: string; size: string; stockQuantity: number }[]) => {
        const res = await apiJava.post(`/products/${productId}/variants`, variants)
        return res.data
    },

    // Cập nhật tồn kho biến thể
    updateVariantStock: async (productId: number, variantId: number, data: { mode: string; quantity: number }) => {
        const res = await apiJava.patch(`/products/${productId}/variants/${variantId}`, data)
        return res.data
    },

    // Xóa biến thể
    deleteVariant: async (productId: number, variantId: number) => {
        const res = await apiJava.delete(`/products/${productId}/variants/${variantId}`)
        return res.data
    },
}

export default productService
