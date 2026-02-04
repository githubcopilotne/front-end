export interface HeroBannerData {
  subtitle: string
  title: string
  titleHighlight: string
  description: string
  primaryButton: {
    text: string
    link: string
  }
  sliderImages: {
    url: string
    alt: string
  }[]
}
