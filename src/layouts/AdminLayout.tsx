import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopbar from '../components/admin/AdminTopbar'

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main area — topbar + content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminTopbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#f8fafc' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
