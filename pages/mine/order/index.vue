<template>
	<view class="order-container">
		<!-- 订单状态筛选 -->
		<view class="filter-tabs">
			<view 
				v-for="(tab, index) in tabs" 
				:key="index"
				:class="['tab-item', { active: currentTab === index }]"
				@click="switchTab(index)"
			>
				{{ tab }}
			</view>
		</view>

		<!-- 订单列表 -->
		<view class="order-list">
			<view v-if="orderList.length === 0" class="empty-state">
				<text class="empty-text">暂无订单</text>
			</view>
			<view v-else class="order-item" v-for="order in orderList" :key="order.id" @click="goToOrderDetail(order.id)">
				<view class="order-header">
					<text class="order-no">订单号: {{ order.orderNo }}</text>
					<text class="order-status" :class="'status-' + order.status">{{ order.statusText }}</text>
				</view>
				<view class="order-content">
					<image class="order-image" :src="order.image" mode="aspectFill"></image>
					<view class="order-info">
						<text class="order-title">{{ order.title }}</text>
						<text class="order-desc">{{ order.description }}</text>
						<text class="order-price">¥{{ order.price }}</text>
					</view>
				</view>
				<view class="order-footer">
					<text class="order-time">{{ order.createTime }}</text>
					<view class="order-actions">
						<button v-if="order.statusText !== '已完成'" class="action-btn" size="mini" @click.stop="handleOrderAction(order)">
							{{ order.actionText }}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const tabs = ['全部', '待付款', '进行中', '已完成', '已取消']
const currentTab = ref(0)

// 模拟订单数据
const allOrders = ref([
	{
		id: 1,
		orderNo: 'FX202604130001',
		title: '北京访学之旅',
		description: '北京大学访学体验',
		image: '/static/logo.png',
		price: 2999.00,
		status: 1,
		statusText: '待付款',
		createTime: '2026-04-13 10:30',
		actionText: '立即付款'
	},
	{
		id: 2,
		orderNo: 'FX202604120002',
		title: '上海访学营',
		description: '复旦大学访学项目',
		image: '/static/logo.png',
		price: 3599.00,
		status: 2,
		statusText: '进行中',
		createTime: '2026-04-12 14:20',
		actionText: '申请退款'
	},
	{
		id: 3,
		orderNo: 'FX202604100003',
		title: '深圳访学行',
		description: '深圳大学访学活动',
		image: '/static/logo.png',
		price: 1999.00,
		status: 3,
		statusText: '已完成',
		createTime: '2026-04-10 09:15',
		actionText: '再次购买'
	}
])

const orderList = computed(() => {
	if (currentTab.value === 0) {
		return allOrders.value
	}
	return allOrders.value.filter(order => order.status === currentTab.value)
})

onLoad(() => {
	// 页面加载时可以请求订单数据
})

const switchTab = (index) => {
	currentTab.value = index
}

const goToOrderDetail = (id) => {
	uni.navigateTo({
		url: `/pages/mine/order/detail?id=${id}`
	})
}

const handleOrderAction = (order) => {
	if (order.status === 1) {
		uni.showToast({
			title: '付款功能开发中',
			icon: 'none'
		})
	} else if (order.status === 2) {
		goToOrderDetail(order.id)
	} else {
		goToOrderDetail(order.id)
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

.status-1 {
	color: #ff9800;
}

.status-2 {
	color: #2196f3;
}

.status-3 {
	color: #4caf50;
}

.status-4 {
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
