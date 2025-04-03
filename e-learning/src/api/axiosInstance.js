import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
})

axiosInstance.interceptors.request.use(config =>{
    const accessToken = sessionStorage.getItem('accessToken')
     if(accessToken){
        config.headers.Authorization = `Bearer ${accessToken}`
     }
     return config
}, (err) => {
    return Promise.reject(err)
})


// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            // // Optionally redirect to login
            // window.location.href = '/';
            console.log('Unauthorized, please login again');
            
        }
        return Promise.reject(error);
    }
);


export default axiosInstance