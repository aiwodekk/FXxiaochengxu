import request from '../utils/request';

// 登录
export const login = (data) => {
  return request.post('/login', data);
};

// 更新用户信息
export const updateUserInfo = (data) => {
  return request.post('/user/update', data);
};

// 退出登录
export const logout =() => {
	return request.post('/logout');
}

// 获取学校列表
export const getSchoolList = (data) => {
	return request.get('/school/search',data)
}