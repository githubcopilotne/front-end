import { Gem, Shirt, HeadphonesIcon, ShoppingBag, Users, Star, CalendarDays } from 'lucide-react'

const VALUES = [
    {
        icon: Gem,
        title: 'Chất lượng',
        description: 'Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, được chọn lọc kỹ lưỡng từ chất liệu đến đường may.',
    },
    {
        icon: Shirt,
        title: 'Phong cách',
        description: 'Luôn cập nhật xu hướng thời trang mới nhất, giúp bạn tự tin thể hiện phong cách riêng của mình.',
    },
    {
        icon: HeadphonesIcon,
        title: 'Dịch vụ',
        description: 'Đội ngũ tư vấn nhiệt tình, hỗ trợ 24/7, chính sách đổi trả linh hoạt vì sự hài lòng của khách hàng.',
    },
]

const STATS = [
    { icon: ShoppingBag, value: '1,000+', label: 'Sản phẩm' },
    { icon: Users, value: '50,000+', label: 'Khách hàng' },
    { icon: Star, value: '4.8/5', label: 'Đánh giá' },
    { icon: CalendarDays, value: '5+', label: 'Năm hoạt động' },
]

const AboutPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-[#111111] text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Về MAVELA</h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Thương hiệu thời trang Việt Nam, mang đến phong cách hiện đại và chất lượng vượt trội.
                    </p>
                </div>
            </div>

            {/* Câu chuyện thương hiệu */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
                        Câu chuyện của chúng tôi
                    </h2>
                    <div className="space-y-4 text-gray-600 leading-relaxed">
                        <p>
                            MAVELA được thành lập với mong muốn mang đến cho người Việt Nam những sản phẩm thời trang
                            chất lượng cao với mức giá hợp lý. Chúng tôi tin rằng mọi người đều xứng đáng được mặc đẹp
                            và tự tin trong phong cách của riêng mình.
                        </p>
                        <p>
                            Từ những ngày đầu, MAVELA đã không ngừng nỗ lực để tạo ra những bộ sưu tập đa dạng,
                            phù hợp với nhiều phong cách và dịp khác nhau. Mỗi sản phẩm đều được thiết kế tỉ mỉ,
                            lựa chọn chất liệu cẩn thận để đảm bảo sự thoải mái và bền đẹp.
                        </p>
                        <p>
                            Với đội ngũ nhân viên tận tâm và hệ thống cửa hàng trực tuyến hiện đại, chúng tôi cam kết
                            mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
                        </p>
                    </div>
                </div>
            </div>

            {/* Giá trị cốt lõi */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
                        Giá trị cốt lõi
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {VALUES.map((item) => (
                            <div key={item.title} className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <item.icon size={28} className="text-[#111111]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Con số nổi bật */}
            <div className="container mx-auto px-4 py-16">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12 text-center">
                    Con số nổi bật
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="w-12 h-12 bg-[#111111] rounded-full flex items-center justify-center mx-auto mb-3">
                                <stat.icon size={22} className="text-white" />
                            </div>
                            <p className="text-2xl md:text-3xl font-bold text-[#111111]">{stat.value}</p>
                            <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default AboutPage
