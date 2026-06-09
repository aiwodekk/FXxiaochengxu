import request from '../utils/request';

// 获取资讯列表
export function getNewsList(params) {
  return request.get('/news/list', params);
}