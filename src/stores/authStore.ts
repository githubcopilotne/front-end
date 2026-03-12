import { create } from 'zustand'

// ==================== TYPES ====================
interface UserInfo {
    userId: number
    email: string
    fullName: string
    role: string
}

interface AuthState {
    token: string | null
    user: UserInfo | null
    login: (token: string, user: UserInfo) => void
    logout: () => void
}

// ==================== STORE ====================
const useAuthStore = create<AuthState>((set) => ({
    // Khởi tạo từ localStorage (reload trang không mất login)
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),

    // Lưu token + user vào store + localStorage
    login: (token, user) => {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        set({ token, user })
    },

    // Xóa token + user khỏi store + localStorage
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        set({ token: null, user: null })
    },
}))

export default useAuthStore
