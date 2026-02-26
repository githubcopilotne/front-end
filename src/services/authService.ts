import api from './api'
import type { RegisterData, VerifyOtpData, LoginData, GoogleLoginData, ForgotPasswordData, ResetPasswordData } from '../types/auth'

const authService = {
    sendOtp: async (data: RegisterData) => {
        const res = await api.post('/auth/send-otp', data)
        return res.data
    },

    verifyOtp: async (data: VerifyOtpData) => {
        const res = await api.post('/auth/verify-otp', data)
        return res.data
    },

    login: async (data: LoginData) => {
        const res = await api.post('/auth/login', data)
        return res.data
    },

    googleLogin: async (data: GoogleLoginData) => {
        const res = await api.post('/auth/google-login', data)
        return res.data
    },

    forgotPasswordSendOtp: async (data: ForgotPasswordData) => {
        const res = await api.post('/auth/forgot-password/send-otp', data)
        return res.data
    },

    forgotPasswordVerifyOtp: async (data: VerifyOtpData) => {
        const res = await api.post('/auth/forgot-password/verify-otp', data)
        return res.data
    },

    resetPassword: async (data: ResetPasswordData) => {
        const res = await api.post('/auth/forgot-password/reset-password', data)
        return res.data
    },
}

export default authService
