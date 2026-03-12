import axios from 'axios'

const apiJava = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Tự động gắn token vào mỗi request (Category API yêu cầu role Admin)
apiJava.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default apiJava
