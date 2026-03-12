export interface Category {
  category_id: number
  category_name: string
  slug: string
}

// ==================== Admin — Java BE (camelCase) ====================

// GET /api/categories — danh sách
export interface CategoryListItem {
    categoryId: number
    categoryName: string
    description: string | null
    status: number
    createdAt: string
}

// GET /api/categories/{id} — chi tiết (fill form edit)
export interface CategoryDetail {
    categoryId: number
    categoryName: string
    slug: string
    description: string | null
    status: number
    createdAt: string
    updatedAt: string | null
}

// POST /api/categories — tạo mới
export interface CreateCategoryData {
    categoryName: string
    description?: string
    status?: number
}

// PUT /api/categories/{id} — cập nhật
export interface UpdateCategoryData {
    categoryName: string
    description?: string
    status: number
}
