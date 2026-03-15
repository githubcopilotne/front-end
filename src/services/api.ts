import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7179/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Tự động gắn token vào mỗi request (Staff API yêu cầu role Admin)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api
