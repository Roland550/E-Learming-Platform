import axiosInstance from "@/api/axiosInstance";

async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
}
export async function loginService(formData) {
  try {
    const response = await axiosInstance.post("/auth/login", formData);
    const { data } = response;
    if (data.success && data.data?.accessToken) {
      // Store token without JSON.stringify
      sessionStorage.setItem("accessToken", data.data.accessToken);
      return data;
    }
    throw new Error(data.message || "Login failed");
  } catch (error) {
    console.error(
      "Login error:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
}
export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
}
export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}

export async function mediaUploadDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);
  return data;
}
export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get("/instructor/course/get");
  return data;
}
export async function fetchInstructorCourseDetailService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course//get/details/${id}`
  );
  return data;
}
export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );
  return data;
}
export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post("/instructor/course/add", formData);
  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(`/student/course/get?${query}`);
  return data;
}
export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );
  return data;
}
export async function checkCourseEnrollendInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/enroll-info/${courseId}/${studentId}`
  );
  return data;
}

export async function createEnrollmentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}
export async function fecthStudentCourseByIdService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/taken-courses/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );
  return data;
}
export async function markLectureAsViewSeervice(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-view`,
    {
      userId,
      courseId,
      lectureId,
    }
  );
  return data;
}
export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );
  return data;
}

export default registerService;
