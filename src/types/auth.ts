export interface RegisterData {
    email: string
    password: string
    fullName: string
    phone: string
}

export interface VerifyOtpData {
    email: string
    otpCode: string
}

export interface LoginData {
    email: string
    password: string
}
