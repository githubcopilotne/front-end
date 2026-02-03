/**
 * Format số tiền sang định dạng VND
 * @param price - Số tiền cần format
 * @returns Chuỗi đã format, ví dụ: "250.000đ"
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + 'đ'
}
