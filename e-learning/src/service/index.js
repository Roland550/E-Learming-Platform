import axiosInstance from "@/api/axiosInstance";



async function registerService(formData){
    const {data} = await axiosInstance.post('/auth/register', {
        ...formData,
        role: 'user',
      })
    return data  
}
 export async function loginService(formData){
  try {
    const data  = await axiosInstance.post('/auth/login', formData);
    if (data.data.accessToken) {
    
      sessionStorage.setItem('accessToken', data.data.accessToken);
      
    }
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
}
 export async function checkAuthService(){
    const {data} = await axiosInstance.get('/auth/check-auth')
    return data  
}

export default registerService;