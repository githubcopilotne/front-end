// Dùng cho bảng danh sách nhân viên (GET /api/staff)
export interface StaffListItem {
  userId: number
  employeeCode: string | null
  fullName: string
  email: string
  phone: string | null
  gender: number | null
  role: string
  hireDate: string | null
  status: number
}

// Dùng cho popup chi tiết nhân viên (GET /api/staff/:id)
export interface StaffDetail {
  userId: number
  employeeCode: string | null
  fullName: string
  email: string
  phone: string | null
  gender: number | null
  birthday: string | null
  address: string | null
  role: string
  idCard: string | null
  hireDate: string | null
  leaveDate: string | null
  status: number
  createdAt: string
}

// Dùng cho form tạo nhân viên (POST /api/staff)
export interface CreateStaffRequest {
  email: string
  password: string
  fullName: string
  phone: string
  gender: number
  birthday: string
  address: string
  role: string
  idCard: string
  hireDate: string
}

// Dùng cho form sửa nhân viên (PUT /api/staff/:id)
export interface UpdateStaffRequest {
  fullName: string
  phone: string
  gender: number
  birthday: string
  address: string
  role: string
  idCard: string
  hireDate: string
}
