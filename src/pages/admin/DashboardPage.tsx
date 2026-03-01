import { LayoutDashboard } from 'lucide-react'

const DashboardPage = () => {
    return (
        <div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <LayoutDashboard size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">Trang tổng quan đang được phát triển...</p>
            </div>
        </div>
    )
}

export default DashboardPage
