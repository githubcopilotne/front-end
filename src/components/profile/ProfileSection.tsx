import { useState, useEffect } from 'react'
import { Pencil } from 'lucide-react'
import type { User } from '../../types/user'

const ProfileSection = () => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({
        full_name: '',
        phone: '',
        gender: 1,
        birthday: '',
        address: '',
    })

    useEffect(() => {
        fetch('/mocks/user.json')
            .then((res) => res.json())
            .then((data: User) => {
                setUser(data)
                setForm({
                    full_name: data.full_name,
                    phone: data.phone,
                    gender: data.gender,
                    birthday: data.birthday,
                    address: data.address,
                })
                setIsLoading(false)
            })
    }, [])

    const handleSave = () => {
        if (!user) return
        // TODO: Call API to update user
        setUser({ ...user, ...form })
        setIsEditing(false)
    }

    const handleCancel = () => {
        if (!user) return
        setForm({
            full_name: user.full_name,
            phone: user.phone,
            gender: user.gender,
            birthday: user.birthday,
            address: user.address,
        })
        setIsEditing(false)
    }

    if (isLoading || !user) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Thông tin cá nhân</h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#111111] border border-[#111111] rounded-lg hover:bg-[#111111] hover:text-white transition-colors"
                    >
                        <Pencil size={16} />
                        Chỉnh sửa
                    </button>
                )}
            </div>

            <div className="space-y-5">
                {/* Email (readonly) */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                </div>

                {/* Họ tên */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Họ và tên
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={form.full_name}
                            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                        />
                    ) : (
                        <p className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                            {user.full_name}
                        </p>
                    )}
                </div>

                {/* SĐT */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Số điện thoại
                    </label>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                        />
                    ) : (
                        <p className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                            {user.phone || '—'}
                        </p>
                    )}
                </div>

                {/* Giới tính */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Giới tính
                    </label>
                    {isEditing ? (
                        <div className="flex gap-6 px-4 py-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={form.gender === 1}
                                    onChange={() => setForm({ ...form, gender: 1 })}
                                    className="w-4 h-4 accent-[#111111]"
                                />
                                <span>Nam</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="gender"
                                    checked={form.gender === 0}
                                    onChange={() => setForm({ ...form, gender: 0 })}
                                    className="w-4 h-4 accent-[#111111]"
                                />
                                <span>Nữ</span>
                            </label>
                        </div>
                    ) : (
                        <p className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                            {user.gender === 1 ? 'Nam' : 'Nữ'}
                        </p>
                    )}
                </div>

                {/* Ngày sinh */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Ngày sinh
                    </label>
                    {isEditing ? (
                        <input
                            type="date"
                            value={form.birthday}
                            onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                        />
                    ) : (
                        <p className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                            {user.birthday
                                ? new Date(user.birthday).toLocaleDateString('vi-VN')
                                : '—'}
                        </p>
                    )}
                </div>

                {/* Địa chỉ */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Địa chỉ
                    </label>
                    {isEditing ? (
                        <textarea
                            value={form.address}
                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors resize-none"
                        />
                    ) : (
                        <p className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                            {user.address || '—'}
                        </p>
                    )}
                </div>

                {/* Buttons */}
                {isEditing && (
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-3 bg-[#111111] text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProfileSection
