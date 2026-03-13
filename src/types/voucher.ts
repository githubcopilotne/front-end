export interface Voucher {
  voucher_id: number
  voucher_code: string
}

// ==================== Admin — Java BE (camelCase) ====================

// GET /api/vouchers — danh sách
export interface VoucherListItem {
    voucherId: number
    voucherCode: string
    discountType: number // 1: Phần trăm, 2: Mức giá cố định (số tiền)
    discountValue: number
    usageLimit: number
    usedCount: number
    expiryDate: string
    status: number // 1: Hoạt động, 0: Ngừng hoạt động
    createdAt: string
}

// GET /api/vouchers/{id} — chi tiết
export interface VoucherDetail {
    voucherId: number
    voucherCode: string
    discountType: number
    discountValue: number
    usageLimit: number
    usedCount: number
    expiryDate: string
    status: number
    createdAt: string
}

// POST /api/vouchers — tạo mới
export interface CreateVoucherData {
    voucherCode: string
    discountType: number
    discountValue: number
    usageLimit: number
    expiryDate: string
    status?: number
}

// PUT /api/vouchers/{id} — cập nhật
export interface UpdateVoucherData {
    voucherCode: string
    discountType: number
    discountValue: number
    usageLimit: number
    expiryDate: string
    status: number
}
