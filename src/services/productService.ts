import apiJava from './apiJava'

const productService = {
    // Lấy danh sách sản phẩm (có phân trang)
    getAll: async (page = 0, size = 10) => {
        const res = await apiJava.get(`/products?page=${page}&size=${size}`)
        return res.data
    },
}

export default productService
