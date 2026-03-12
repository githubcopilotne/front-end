import { useRef, useEffect } from 'react'

interface OtpInputProps {
  value: string[]
  onChange: (otp: string[]) => void
}

const OtpInput = ({ value, onChange }: OtpInputProps) => {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  // Auto focus vào ô đầu tiên khi component hiện ra
  useEffect(() => {
    otpRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, inputValue: string) => {
    // Chỉ cho phép nhập số
    if (inputValue && !/^\d$/.test(inputValue)) return

    const newOtp = [...value]
    newOtp[index] = inputValue
    onChange(newOtp)

    // Tự động nhảy sang ô tiếp theo
    if (inputValue && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Nhấn Backspace: xóa và quay lại ô trước
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasteData) {
      const newOtp = [...value]
      for (let i = 0; i < pasteData.length; i++) {
        newOtp[i] = pasteData[i]
      }
      onChange(newOtp)
      // Focus vào ô cuối cùng được điền
      const lastIndex = Math.min(pasteData.length - 1, 5)
      otpRefs.current[lastIndex]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-2" onPaste={handlePaste}>
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => { otpRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#111111] focus:border-transparent outline-none transition-all"
        />
      ))}
    </div>
  )
}

export default OtpInput
