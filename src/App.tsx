import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ProtectedRoute, GuestRoute, AdminRoute } from './components/common/AuthRoute'
import ClientLayout from './layouts/ClientLayout'
import AdminLayout from './layouts/AdminLayout'
import HomePage from './pages/client/HomePage'
import ProductListPage from './pages/client/ProductListPage'
import ProductDetailPage from './pages/client/ProductDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ProfilePage from './pages/client/ProfilePage'
import ProfileSection from './components/profile/ProfileSection'
import OrdersSection from './components/profile/OrdersSection'
import WishlistSection from './components/profile/WishlistSection'
import PasswordSection from './components/profile/PasswordSection'
import CartPage from './pages/client/CartPage'
import CheckoutPage from './pages/client/CheckoutPage'
import OrderSuccessPage from './pages/client/OrderSuccessPage'
import AboutPage from './pages/client/AboutPage'
import ContactPage from './pages/client/ContactPage'
import DashboardPage from './pages/admin/DashboardPage'
import CategoryPage from './pages/admin/CategoryPage'
import ProductPage from './pages/admin/ProductPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            padding: '12px 16px',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* ====== Admin Routes (AdminLayout, không có Header/Footer) ====== */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="tong-quan" replace />} />
          <Route path="tong-quan" element={<DashboardPage />} />
          <Route path="khach-hang" element={<div>Khách hàng - đang phát triển...</div>} />
          <Route path="nhan-vien" element={<div>Nhân viên - đang phát triển...</div>} />
          <Route path="danh-muc" element={<CategoryPage />} />
          <Route path="san-pham" element={<ProductPage />} />
          <Route path="don-hang" element={<div>Đơn hàng - đang phát triển...</div>} />
          <Route path="voucher" element={<div>Voucher - đang phát triển...</div>} />
          <Route path="danh-gia" element={<div>Đánh giá - đang phát triển...</div>} />
        </Route>

        {/* ====== Client Routes (Header + Footer) ====== */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/san-pham" element={<ProductListPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/gioi-thieu" element={<AboutPage />} />
          <Route path="/lien-he" element={<ContactPage />} />

          {/* Guest Route */}
          <Route path="/dang-nhap" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/dang-ky" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />

          {/* Protected Route */}
          <Route path="/thanh-toan" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/dat-hang-thanh-cong" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="/tai-khoan" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}>
            <Route index element={<Navigate to="thong-tin" replace />} />
            <Route path="thong-tin" element={<ProfileSection />} />
            <Route path="don-hang" element={<OrdersSection />} />
            <Route path="yeu-thich" element={<WishlistSection />} />
            <Route path="doi-mat-khau" element={<PasswordSection />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App