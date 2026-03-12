import { Navigate } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

// Chưa login → chuyển về trang đăng nhập
// Dùng cho: /tai-khoan, /don-hang, ...
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore()

    if (!user) {
        return <Navigate to="/dang-nhap" replace />
    }

    return children
}

// Đã login → chuyển về trang chủ (không cần vào đăng nhập/đăng ký nữa)
// Dùng cho: /dang-nhap, /dang-ky
const GuestRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore()

    if (user) {
        return <Navigate to="/" replace />
    }

    return children
}

// Chưa login hoặc không phải admin → chặn truy cập
// Dùng cho: /admin/*
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore()

    if (!user) {
        return <Navigate to="/dang-nhap" replace />
    }

    if (user.role !== 'Admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export { ProtectedRoute, GuestRoute, AdminRoute }
