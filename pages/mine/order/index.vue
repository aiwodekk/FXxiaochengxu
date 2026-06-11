<template>
	<view class="order-container">
		<!-- 订单状态筛选 -->
		<view class="filter-tabs">
			<view v-for="(tab, index) in tabs" :key="index" :class="['tab-item', { active: currentTab === index }]"
				@click="switchTab(index)">
				{{ tab }}
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view v-if="orderList.length === 0" class="empty-state">
				<text class="empty-text">暂无订单</text>
			</view>
			<view v-else class="order-item" v-for="order in orderList" :key="order.id"
				@click="goToOrderDetail(order.id)">
				<view class="order-header">
					<text class="order-no">订单号: {{ order.orderNumber }}</text>
					<text class="order-status" :class="'status-' + order.status">{{ statusMap[order.status] }}</text>
				</view>
				<view class="order-content">
					<image class="order-image" :src="order.schoolLogo" mode="aspectFill"></image>
					<view class="order-info">
						<text class="order-title">{{ order.courseName }}</text>
						<text class="order-desc">{{ order.school }}</text>
						<text class="order-price">¥{{ order.price }}</text>
					</view>
				</view>
				<view class="order-footer">
					<text class="order-time">{{ formatDate(order.time) }}</text>
					<view class="order-actions">
						<button class="action-btn" size="mini" @click.stop="handleOrderAction(order)">
							{{ order.status === 'PENDING' ? '立即付款' : order.status === 'PAID' ? '申请退款' : '联系客服' }}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getOrderList,
		applyRefund,
		updateOrderStatus,
		payOrderApi,
	} from '../../../api/order'
	const tabs = ['全部', '待付款', '进行中', '已完成', '已退款']
	const statusList = ['PENDING', 'PAID', 'COMPLETED', 'REFUNDED']
	const statusMap = {
		'PENDING': '待支付',
		'PAID': '已支付',
		'CANCELLED': '已取消',
		'COMPLETED': '已完成',
		'REFUNDING': '退款中',
		'REFUNDED': '已退款'
	}

	const currentTab = ref(0)

	// 模拟订单数据
	const allOrders = ref([])

	const orderList = ref([])

	onLoad(() => {
		// 页面加载时可以请求订单数据
		fetchOrders()
	})

	// 时间格式转化IOS转Y-M-D
	const formatDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	// 获取订单列表
	const fetchOrders = async (data) => {
		if (!data) {
			data = {
				page: 1,
				size: 100,
			}
			if (currentTab.value > 0) {
				data.status = statusList[currentTab.value - 1]
			}
		}
		const res = await getOrderList(data)
		allOrders.value = res.list
		orderList.value = allOrders.value
	}

	const switchTab = (index) => {
		currentTab.value = index
		fetchOrders()
	}

	const goToOrderDetail = (id) => {
		uni.navigateTo({
			url: `/pages/mine/order/detail?id=${id}`
		})
	}

	const handleOrderAction = async (order) => {
		if (order.status === 'PENDING') {
			try {
				uni.showLoading({
					title: '正在支付...'
				})

				const res = await payOrderApi({ orderId: order.id })

				await new Promise((resolve, reject) => {
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: res.payParams.data.timeStamp,
						nonceStr: res.payParams.data.nonceStr,
						package: res.payParams.data.package,
						signType: res.payParams.data.signType,
						paySign: res.payParams.data.paySign,
						success: (res) => resolve(res),
						fail: (err) => reject(err)
					})
				})
	
				uni.hideLoading()
				uni.showToast({
					title: '支付成功',
					icon: 'success'
				})

				await updateOrderStatus({
					orderId: order.id,
					status: 'PAID'
				})
				fetchOrders()

			} catch (err) {
				uni.hideLoading()
				if (err.errMsg && err.errMsg.includes('cancel')) {
					uni.showToast({
						title: '已取消支付',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: '支付失败',
						icon: 'error'
					})
				}
			}
		} else if (order.status === 'PAID') {
			uni.showModal({
				title: '申请退款',
				editable: true,
				placeholderText: '请输入退款原因',
				success: (res) => {
					console.log(order.id);
					console.log(res.content);
					if (res.confirm) {
						applyRefund({
								orderId: order.id,
								reason: res.content || '无理由退款'
							})
							.then(() => {
								uni.showToast({
									title: '退款申请已提交',
									icon: 'success'
								})
								fetchOrders()
							})
							.catch(() => {
								uni.showToast({
									title: '退款申请失败',
									icon: 'none'
								})
							})
					}
				}
			})
		} else {
			// 联系客服
			uni.navigateTo({
				url: '/pages/mine/customer-service/index'
			})
		}
	}
</script>

<style scoped>
	.order-container {
		min-height: 100vh;
		background-color: #f5f5f5;
	}

	.filter-tabs {
		display: flex;
		background-color: #ffffff;
		padding: 20rpx 0;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		font-size: 28rpx;
		color: #666666;
		padding: 15rpx 0;
		position: relative;
	}

	.tab-item.active {
		color: rgb(255, 144, 62);
		font-weight: bold;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: rgb(255, 144, 62);
		border-radius: 2rpx;
	}

	.order-list {
		padding: 20rpx;
	}

	.empty-state {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 100rpx 0;
	}

	.empty-text {
		font-size: 30rpx;
		color: #999999;
	}

	.order-item {
		background-color: #ffffff;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
		padding: 30rpx;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.order-no {
		font-size: 26rpx;
		color: #999999;
	}

	.order-status {
		font-size: 26rpx;
		font-weight: bold;
	}

	.status-PENDING {
		color: #ff9800;
	}

	.status-PAID {
		color: #2196f3;
	}

	.status-CANCELLED {
		color: #999999;
	}

	.status-COMPLETED {
		color: #4caf50;
	}

	.status-REFUNDING {
		color: #ff9800;
	}

	.status-REFUNDED {
		color: #999999;
	}

	.order-content {
		display: flex;
		padding: 20rpx 0;
	}

	.order-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 80rpx;
		flex-shrink: 0;
	}

	.order-info {
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.order-title {
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.order-desc {
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 10rpx;
	}

	.order-price {
		font-size: 32rpx;
		color: #ff4d4f;
		font-weight: bold;
	}

	.order-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 20rpx;
		border-top: 1rpx solid #f0f0f0;
	}

	.order-time {
		font-size: 24rpx;
		color: #999999;
	}

	.order-actions {
		display: flex;
		gap: 10rpx;
	}

	.action-btn {
		background-color: rgb(255, 144, 62);
		color: #ffffff;
		font-size: 24rpx;
		border-radius: 8rpx;
	}
</style>