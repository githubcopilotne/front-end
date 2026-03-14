// Dùng cho bảng danh sách khách hàng (GET /api/customers)
export interface CustomerListItem {
  userId: number
  fullName: string
  email: string
  phone: string | null
  gender: number          // 1 = Nam, 0 = Nữ
  createdAt: string
  status: number          // 1 = Hoạt động, 0 = Bị khóa
}

// Dùng cho popup chi tiết khách hàng (GET /api/customers/:id)
export interface CustomerDetail {
  userId: number
  fullName: string
  email: string
  phone: string | null
  gender: number
  birthday: string | null
  address: string | null
  createdAt: string
  status: number
  totalOrders: number
  totalSpent: number
}
