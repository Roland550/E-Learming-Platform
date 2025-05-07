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
    const response = await axiosInstance.post('/auth/login', formData);
    const { data } = response;
    if (data.success && data.data?.accessToken) {
      // Store token without JSON.stringify
      sessionStorage.setItem('accessToken', data.data.accessToken);
      return data;
    }
    throw new Error(data.message || 'Login failed');
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw error;
  }
}
 export async function checkAuthService(){
    const {data} = await axiosInstance.get('/auth/check-auth')
    return data  
}
 export async function mediaUploadService(formData, onProgressCallback){
    const {data} = await axiosInstance.post('/media/upload', formData,
      {onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgressCallback(percentCompleted);
      }}
     )
    return data  
}

export async function mediaUploadDeleteService(id){
  const {data} = await axiosInstance.delete(`/media/delete/${id}`)
  return data  
}
export async function fetchInstructorCourseListService(){
  const {data} = await axiosInstance.get('/instructor/course/get')
  return data
}
export async function fetchInstructorCourseDetailService(id){
  const {data} = await axiosInstance.get(`/instructor/course//get/details/${id}`)
  return data
  
}
export async function updateCourseByIdService(id, formData){
  const {data} = await axiosInstance.get(`/instructor/course/update/${id}`, formData)
  return data
  
}
export async function addNewCourseService(formData){
  const {data} = await axiosInstance.post('/instructor/course/add', formData)
  return data 
}

export default registerService;