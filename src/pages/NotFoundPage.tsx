import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    return (
        <div className="min-h-[calc(100vh-64px-200px)] bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="text-center">
                <h1 className="text-8xl font-bold text-[#111111]">404</h1>
                <p className="mt-4 text-xl text-gray-600">Trang bạn tìm không tồn tại</p>
                <Link
                    to="/"
                    className="mt-6 inline-block bg-[#111111] text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                    Về trang chủ
                </Link>
            </div>
        </div>
    )
}

export default NotFoundPage
