import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import type { HeroBannerData } from '../../types/heroBanner'

const HeroBanner = () => {
  const [data, setData] = useState<HeroBannerData | null>(null)

  useEffect(() => {
    fetch('/mocks/heroBanner.json')
      .then((res) => res.json())
      .then((json) => setData(json))
  }, [])

  if (!data) {
    return (
      <section className="min-h-[500px] md:min-h-[600px] bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </section>
    )
  }

  return (
    <section className="relative bg-gradient-to-r from-gray-100 to-gray-200 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center min-h-[500px] md:min-h-[600px] py-12 gap-x-20">
          {/* Text Content */}
          <div className="md:w-[400px] lg:w-[450px] flex-shrink-0 text-center md:text-left z-10">
            <p className="text-sm md:text-base text-gray-500 uppercase tracking-widest mb-4">
              {data.subtitle}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111111] leading-tight mb-6">
              {data.title}
              <br />
              <span className="text-gray-500">{data.titleHighlight}</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mb-8 max-w-md mx-auto md:mx-0">
              {data.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href={data.primaryButton.link}
                className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white px-8 py-4 font-medium hover:bg-gray-800 transition-colors rounded"
              >
                {data.primaryButton.text}
                <ArrowRight size={20} />
              </a>
            </div>
          </div>

          {/* Image Slider */}
          <div className="flex-1 mt-8 md:mt-0 relative overflow-hidden flex items-center">
            {/* Slider */}
            <div className="relative w-full">
              {/* Fade edges - cùng chiều cao với ảnh */}
              <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-gray-100/70 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-gray-100/70 to-transparent z-10 pointer-events-none" />

              <div className="flex gap-4 slider-track" style={{ width: 'max-content' }}>
                {/* Lặp 3 lần để đảm bảo loop mượt trên mọi màn hình */}
                {[1, 2, 3].map((loop) =>
                  data.sliderImages.map((image, index) => (
                    <div
                      key={`${loop}-${index}`}
                      className="flex-shrink-0 w-[180px] h-[270px] md:w-[220px] md:h-[330px] rounded-xl overflow-hidden shadow-md"
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gray-300 rounded-full opacity-50 hidden lg:block animate-float" />
      <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-gray-300 rounded-full opacity-30 hidden lg:block animate-float-delayed" />
    </section>
  )
}

export default HeroBanner
