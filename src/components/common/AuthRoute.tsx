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

// Chưa login hoặc không phải admin/staff → chặn truy cập
// Dùng cho: /admin/*
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore()

    if (!user) {
        return <Navigate to="/dang-nhap" replace />
    }

    if (user.role !== 'Admin' && user.role !== 'Staff') {
        return <Navigate to="/" replace />
    }

    return children
}

// Chỉ Admin mới truy cập được (Staff bị chặn)
// Dùng cho: /admin/nhan-vien, /admin/voucher
const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthStore()

    if (!user || user.role !== 'Admin') {
        return <Navigate to="/admin/tong-quan" replace />
    }

    return children
}

export { ProtectedRoute, GuestRoute, AdminRoute, AdminOnlyRoute }
