/**
 * Format số tiền sang định dạng VND
 * @param price - Số tiền cần format
 * @returns Chuỗi đã format, ví dụ: "250.000đ"
 */
export const formatPrice = (price: number): string => {
  return price.toLocaleString('vi-VN') + 'đ'
}

/**
 * Format ngày sang định dạng dd/MM/yyyy
 * @param dateStr - Chuỗi ngày (ISO string hoặc bất kỳ format Date hợp lệ)
 * @returns Chuỗi đã format, ví dụ: "12/03/2026"
 */
export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}
