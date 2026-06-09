<template>
	<view class="detail-container">
		<!-- 订单状态 -->
		<!-- 		<view class="status-section">
			<view class="status-icon">
				<text class="icon">{{ statusIcon }}</text>
			</view>
			<text class="status-text">{{ orderDetail.statusText }}</text>
			<text class="status-tip">{{ statusTip }}</text>
		</view> -->

		<!-- 订单信息 -->
		<view class="info-section" v-if="orderDetail">
			<view class="section-title">
				<view class="title-block"></view>
				<text class="title-text">订单信息</text>
			</view>
			<view class="info-list">
				<view class="info-item">
					<text class="label">订单编号</text>
					<text class="value">{{ orderDetail.orderNumber }}</text>
				</view>
				<view class="info-item">
					<text class="label">下单时间</text>
					<text class="value">{{ formatDate(orderDetail.time) }}</text>
				</view>
				<view class="info-item">
					<text class="label">订单状态</text>
					<text class="status" :class="'status-' + orderDetail.status">{{ statusMap[orderDetail.status]
					}}</text>
				</view>
			</view>
		</view>

		<!-- 商品信息 -->
		<view class="info-section" v-if="orderDetail">
			<view class="section-title">
				<view class="title-block"></view>
				<text class="title-text">商品信息</text>
			</view>
			<view class="product-info">
				<image class="product-image" :src="orderDetail.schoolLogo" mode="aspectFill"></image>
				<view class="product-detail">
					<text class="product-title">{{ orderDetail.courseName }}</text>
					<text class="product-desc">{{ orderDetail.school }}</text>
					<text class="product-price">¥{{ orderDetail.price }}</text>
				</view>
			</view>
		</view>

		<!-- 报名人员信息 -->
		<view class="info-section" v-if="orderDetail">
			<view class="section-title">
				<view class="title-block"></view>
				<text class="title-text">报名人员</text>
			</view>
			<view class="children-list">
				<view class="children-item">
					<view class="children-header">
						<text class="children-name">{{ orderDetail.userName }}</text>
						<text class="children-gender">{{ orderDetail.gender }}</text>
					</view>
					<view class="children-detail">
						<text class="detail-row">年龄：{{ orderDetail.age }}岁</text>
						<text class="detail-row">学校：{{ orderDetail.school }}</text>
						<text class="detail-row">年级：{{ orderDetail.studentGrade }}</text>
						<text class="detail-row">身份证号：{{ orderDetail.userIdCard }}</text>
						<text class="detail-row">联系电话：{{ orderDetail.userPhone }}</text>
					</view>
					<view :class="orderDetail.health === '健康' ? 'children-health' : 'children-extra' ">
						<view class="extra-label">健康状况：{{ orderDetail.health }}</view>
						<text v-if="orderDetail.health === '需关注'"
							class="extra-value">{{ orderDetail.healthText }}</text>
					</view>
					<view class="children-extra" v-if="orderDetail.allergy">
						<text class="extra-label">过敏史/忌口：</text>
						<text class="extra-value">{{ orderDetail.allergy }}</text>
					</view>
					<view class="children-emergency">
						<text class="emergency-row">
							紧急联系人：{{ orderDetail.emergencyContact }} | {{ orderDetail.emergencyPhone }}
						</text>
					</view>
				</view>
			</view>
			<!--
			v-if="orderDetail.children && orderDetail.children.length > 0"
			 v-for="(child, index) in orderDetail.children" :key="index"
			<view v-else class="empty-children">
				<text class="empty-text">暂无报名人员信息</text>
			</view> -->
		</view>

		<!-- 费用明细 -->
		<view class="info-section" v-if="orderDetail">
			<view v-if="orderDetail.status !== 'REFUNDED'">
				<view class="section-title">
					<view class="title-block"></view>
					<text class="title-text">费用明细</text>
				</view>
				<view class="price-list">
					<view class="price-item">
						<text class="label">课程费用</text>
						<text class="value">¥{{ orderDetail.price }}</text>
					</view>
					<view class="price-item total">
						<text class="label">实付金额</text>
						<text class="value total-price">¥{{ orderDetail.price }}</text>
					</view>
				</view>
			</view>
			<view v-else class="refund-section">
				<view class="section-title">
					<view class="title-block"></view>
					<text class="title-text">退款信息</text>
				</view>
				<view class="refund-info">
					<!-- 					<view class="refund-item">
						<text class="refund-label">退款金额</text>
						<text class="refund-value">¥{{ orderDetail.price }}</text>
					</view> -->
					<view class="refund-reason">
						<text class="reason-label">退款原因</text>
						<view class="reason-content">{{ orderDetail.refundReason || '无理由退款' }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="footer-actions" v-if="orderDetail">
			<button v-if="orderDetail.status === 'PENDING'" class="action-btn pay-btn" @click="handlePay">立即付款</button>
			<button v-if="orderDetail.status === 'PAID'" class="action-btn contact-btn"
				@click="handleContact">申请退款</button>
			<button v-if="orderDetail.status === 'COMPLETED' || orderDetail.status === 'REFUNDING'"
				class="action-btn buy-btn" @click="handleBuyAgain">联系客服</button>
		</view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		getOrderDetail,
		applyRefund,
	} from '../../../api/order'
	const orderId = ref('')
	const statusMap = {
		'PENDING': '待支付',
		'PAID': '已支付',
		'CANCELLED': '已取消',
		'COMPLETED': '已完成',
		'REFUNDING': '退款中',
		'REFUNDED': '已退款'
	}
	const orderDetail = ref()

	const statusIcon = ref('⏳')
	const statusTip = ref('请尽快完成支付')

	onLoad((options) => {
		if (options.id) {
			orderId.value = options.id
			loadOrderDetail()
		}
	})

	const loadOrderDetail = () => {
		getOrderDetail(orderId.value).then((res) => {
			orderDetail.value = res.detail
		})
	}
	// 时间格式转化IOS转Y-M-D
	const formatDate = (date) => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = String(d.getMonth() + 1).padStart(2, '0');
		const day = String(d.getDate()).padStart(2, '0');
		return `${year}-${month}-${day}`;
	}
	const handlePay = async () => {
		try {
			uni.showLoading({
				title: '正在支付...'
			})

			// TODO: 调用后端接口创建订单
			const paymentParams = {
				timeStamp: String(Date.now()),
				nonceStr: 'nonceStr123456',
				package: 'prepay_id=wx20240413123456789',
				signType: 'MD5',
				paySign: 'paySign123456'
			}

			// 调用微信支付
			await new Promise((resolve, reject) => {
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: paymentParams.timeStamp,
					nonceStr: paymentParams.nonceStr,
					package: paymentParams.package,
					signType: paymentParams.signType,
					paySign: paymentParams.paySign,
					success: (res) => resolve(res),
					fail: (err) => reject(err)
				})
			})

			uni.hideLoading()
			uni.showToast({
				title: '支付成功',
				icon: 'success'
			})

			// 更新订单状态
			orderDetail.value.status = 2
			orderDetail.value.statusText = '进行中'
			statusIcon.value = '✅'
			statusTip.value = '课程进行中，敬请期待'

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
	}

	const handleContact = () => {
		uni.showModal({
			title: '申请退款',
			editable: true,
			placeholderText: '请输入退款原因',
			success: (res) => {
				if (res.confirm) {
					applyRefund({
							orderId: orderId.value,
							reason: res.content || '无理由退款'
						})
						.then(() => {
							uni.showToast({
								title: '退款申请已提交',
								icon: 'success'
							})
							loadOrderDetail()
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
	}

	const handleBuyAgain = () => {
		uni.navigateTo({
			url: '/pages/mine/customer-service/index'
		})
	}
</script>

<style scoped>
	.detail-container {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-bottom: 140rpx;
	}

	/* 状态区域 */
	.status-section {
		background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
		padding: 60rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.status-icon {
		font-size: 80rpx;
		margin-bottom: 20rpx;
	}

	.status-text {
		font-size: 40rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 10rpx;
	}

	.status-tip {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	/* 信息区块 */
	.info-section {
		background-color: #ffffff;
		margin-top: 20rpx;
	}

	.section-title {
		display: flex;
		align-items: center;
		padding: 30rpx 40rpx 20rpx;
	}

	.title-block {
		width: 8rpx;
		height: 32rpx;
		background-color: rgb(255, 144, 62);
		border-radius: 4rpx;
		margin-right: 12rpx;
	}

	.title-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}

	/* 订单信息列表 */
	.info-list {
		padding: 0 40rpx 30rpx;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.info-item:last-child {
		border-bottom: none;
	}

	.info-item .label {
		font-size: 28rpx;
		color: #666666;
	}

	.info-item .value {
		font-size: 28rpx;
		color: #333333;
	}

	.info-item .value.status {
		font-size: 28rpx;
		font-weight: bold;
	}

	/* 'PENDING': '待支付',
	'PAID': '已支付',
	'CANCELLED': '已取消',
	'COMPLETED': '已完成',
	'REFUNDING': '退款中',
	'REFUNDED': '已退款' */
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

	/* 商品信息 */
	.product-info {
		display: flex;
		padding: 30rpx 40rpx;
	}

	.product-image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 80rpx;
		flex-shrink: 0;
	}

	.product-detail {
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.product-title {
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.product-desc {
		font-size: 24rpx;
		color: #999999;
		margin-bottom: 10rpx;
	}

	.product-price {
		font-size: 32rpx;
		color: #ff4d4f;
		font-weight: bold;
	}

	/* 报名人员信息 */
	.children-list {
		padding: 0 40rpx 30rpx;
	}

	.children-item {
		background-color: #f9f9f9;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.children-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
		padding-bottom: 15rpx;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.children-name {
		font-size: 30rpx;
		color: #333333;
		font-weight: bold;
	}

	.children-gender {
		font-size: 26rpx;
		color: rgb(255, 144, 62);
	}

	.children-detail {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
		margin-bottom: 15rpx;
	}

	.detail-row {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.5;
	}

	.children-extra {
		background-color: #fff3e0;
		padding: 15rpx;
		border-radius: 8rpx;
		margin-bottom: 15rpx;

		color: #ff9800;
	}

	.children-health {
		background-color: #e8f5e9;
		padding: 15rpx;
		border-radius: 8rpx;
		margin-bottom: 15rpx;
		color: #4caf50;
	}

	.extra-label {
		font-size: 24rpx;
		font-weight: bold;
	}

	.extra-value {
		font-size: 24rpx;
		flex: 1;
	}

	.children-emergency {
		background-color: #e8f5e9;
		padding: 15rpx;
		border-radius: 8rpx;
	}

	.emergency-row {
		font-size: 24rpx;
		color: #4caf50;
	}

	.empty-children {
		padding: 60rpx 0;
		display: flex;
		justify-content: center;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999999;
	}

	/* 费用明细 */
	.price-list {
		padding: 0 40rpx 30rpx;
	}

	.price-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.price-item:last-child {
		border-bottom: none;
	}

	.price-item .label {
		font-size: 28rpx;
		color: #666666;
	}

	.price-item .value {
		font-size: 28rpx;
		color: #333333;
	}

	.price-item.total {
		margin-top: 10rpx;
		padding-top: 20rpx;
		border-top: 2rpx solid #f0f0f0;
	}

	.price-item.total .label {
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
	}

	.price-item.total .total-price {
		font-size: 36rpx;
		color: #ff4d4f;
		font-weight: bold;
	}

	/* 退款信息样式 */
	.refund-section {
		padding-bottom: 30rpx;
	}

	.refund-info {
		padding: 0 40rpx;
	}

	.refund-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.refund-label {
		font-size: 28rpx;
		color: #666666;
	}

	.refund-value {
		font-size: 32rpx;
		color: #4caf50;
		font-weight: bold;
	}

	.refund-reason {
		padding: 20rpx 0;
	}

	.reason-label {
		font-size: 28rpx;
		color: #666666;
		display: block;
		margin-bottom: 12rpx;
	}

	.reason-content {
		background-color: #fff3e0;
		border-radius: 12rpx;
		padding: 24rpx;
		font-size: 28rpx;
		color: #333333;
		line-height: 1.6;
	}

	/* 底部操作按钮 */
	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 40rpx;
		background-color: #ffffff;
		box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
		display: flex;
		gap: 20rpx;
	}

	.action-btn {
		flex: 1;
		font-size: 30rpx;
		font-weight: bold;
		border-radius: 12rpx;
		border: none;
	}

	.action-btn::after {
		border: none;
	}

	.pay-btn {
		background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
		color: #ffffff;
	}

	.contact-btn {
		background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
		color: #ffffff;
	}

	.buy-btn {
		background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
		color: #ffffff;
	}
</style>