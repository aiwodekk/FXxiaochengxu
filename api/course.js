import request from '../utils/request';

// 获取国内课程轮播图
export const getDomesticCourseBanners = () => {
  return request.get('/domesticImages');
}

// 获取国际课程轮播图
export const getInternationalCourseBanners = () => {
  return request.get('/internationalImages');
}

// 获取国内课程列表
export const getDomesticCourses = (data) => {
  return request.get('/domesticList', data);
}

export const getInternationalCourses = (data) => {
  return request.get('/internationalList', data);
}

// 获取国内课程详情	
export const getDomesticCourseDetail = (courseId) => {
  return request.get(`/domesticDetail`, { id: courseId });
}

// 获取国际课程详情
export const getInternationalCourseDetail = (courseId) => {
  return request.get(`/internationalDetail`, { id: courseId });
}

// 获取课程分类列表
export const getCourseCategories = () => {
  return request.get('/typeList');
}

// 获取城市列表
export const getCityList = () => {
  return request.get('/cityList');
}