import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const CONTACT_INFO = [
    {
        icon: MapPin,
        title: 'Địa chỉ',
        content: '123 Đường ABC, Quận 1, TP.HCM',
    },
    {
        icon: Phone,
        title: 'Điện thoại',
        content: '0123 456 789',
    },
    {
        icon: Mail,
        title: 'Email',
        content: 'contact@mavela.vn',
    },
    {
        icon: Clock,
        title: 'Giờ làm việc',
        content: 'Thứ 2 - Thứ 7: 8:00 - 21:00',
    },
]

const ContactPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#111111] text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Liên hệ</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* Cột trái: Form liên hệ */}
                    <div className="bg-white rounded-lg p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Gửi tin nhắn cho chúng tôi
                        </h2>

                        <form className="space-y-4">
                            {/* Họ tên */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Nhập họ và tên"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="Nhập email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors"
                                />
                            </div>

                            {/* Nội dung */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nội dung <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={5}
                                    placeholder="Nhập nội dung tin nhắn"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#111111] transition-colors resize-none"
                                />
                            </div>

                            {/* Nút gửi */}
                            <button
                                type="button"
                                className="w-full bg-[#111111] text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Gửi tin nhắn
                            </button>
                        </form>
                    </div>

                    {/* Cột phải: Thông tin liên hệ */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">
                            Thông tin liên hệ
                        </h2>

                        <div className="space-y-6">
                            {CONTACT_INFO.map((item) => (
                                <div key={item.title} className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center flex-shrink-0">
                                        <item.icon size={20} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600 mt-1">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage
