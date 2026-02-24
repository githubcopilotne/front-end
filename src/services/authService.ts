import api from './api'
import type { RegisterData, VerifyOtpData } from '../types/auth'

const authService = {
    sendOtp: async (data: RegisterData) => {
        const res = await api.post('/auth/send-otp', data)
        return res.data
    },

    verifyOtp: async (data: VerifyOtpData) => {
        const res = await api.post('/auth/verify-otp', data)
        return res.data
    },
}

export default authService
