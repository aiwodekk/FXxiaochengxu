import request from '../utils/request';

// 创建订单
export function createOrderApi(data) {
  return request.post('/order', data);
}
// 获取订单列表
export function getOrderList(params) {
  return request.get('/order/list', params);
}

// 获取订单详情
export function getOrderDetail(orderId) {
  return request.get(`/order/detail`, { orderId: orderId });
}

// 更新订单状态
export function updateOrderStatus(data) {
  return request.post('/order/status', data);
}

// 申请退款
export function applyRefund(data) {
  return request.post('/order/refund', data);
}

// 支付订单（获取支付参数）
export function payOrderApi(data) {
  return request.post('/order/resume-pay', data);
}