import api from './api'
import type { RegisterData, VerifyOtpData, LoginData } from '../types/auth'

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
}

export default authService
