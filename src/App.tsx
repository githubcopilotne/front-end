import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import { ProtectedRoute, GuestRoute } from './components/common/AuthRoute'
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
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/san-pham" element={<ProductListPage />} />
            <Route path="/san-pham/:slug" element={<ProductDetailPage />} />

            {/* Guest Route — đã login thì redirect về trang chủ */}
            <Route path="/dang-nhap" element={<GuestRoute><LoginPage /></GuestRoute>} />
            <Route path="/dang-ky" element={<GuestRoute><RegisterPage /></GuestRoute>} />
            <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />

            {/* Protected Route — chưa login thì redirect về đăng nhập */}
            <Route path="/tai-khoan" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>}>
              <Route index element={<Navigate to="thong-tin" replace />} />
              <Route path="thong-tin" element={<ProfileSection />} />
              <Route path="don-hang" element={<OrdersSection />} />
              <Route path="yeu-thich" element={<WishlistSection />} />
              <Route path="doi-mat-khau" element={<PasswordSection />} />
            </Route>

            {/* 404 — route không tồn tại */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App