<template>
	<view class="mine-container">
		<!-- 用户信息头部 -->
		<view class="user-header" @click="goToProfile">
			<view class="user-info">
				<changeImage :model-value="userInfo.userImage" :user-info="userInfo"></changeImage>
				<view class="user-detail">
					<text class="nickname">{{ userInfo.nickname || '输入昵称' }}</text>
					<text class="user-desc">{{ userInfo.tel || '完善个人资料' }}</text>
				</view>
			</view>
			<text class="arrow-right">›</text>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-item" @click="goToOrder">
				<view class="menu-left">
					<text class="menu-icon">📋</text>
					<text class="menu-text">我的订单</text>
				</view>
				<text class="arrow-right">›</text>
			</view>
			<view class="menu-item" @click="goToProfile">
				<view class="menu-left">
					<text class="menu-icon">👤</text>
					<text class="menu-text">我的资料</text>
				</view>
				<text class="arrow-right">›</text>
			</view>
			<view class="menu-item" @click="goToCustomerService">
				<view class="menu-left">
					<text class="menu-icon">💬</text>
					<text class="menu-text">联系客服</text>
				</view>
				<text class="arrow-right">›</text>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section">
			<button class="logout-btn" @click="handleLoginOrLogout">{{ isLoggedIn ? '退出登录' : '立即登录' }}</button>
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
		onLoad,
		onShow
	} from '@dcloudio/uni-app'
	import changeImage from '../../utils/changeImage.vue'
	import {
		logout
	} from '../../api/user'
	import { wechatLogin } from '../../utils/auth'
	const userInfo = ref({
		userImage: '',
		nickname: '',
		tel: '',
		school: '',
		grade: '',
		calssRoom: ''
	})
	const isLoggedIn = ref(false);
	onLoad(() => {
		loadUserInfo()
	})

	onShow(() => {
		const token = uni.getStorageSync('token');
		isLoggedIn.value = !!token;
		console.log('当前登录状态:', isLoggedIn.value);
		loadUserInfo()
	})

	onMounted(() => {
		const token = uni.getStorageSync('token');
		isLoggedIn.value = !!token;
		console.log('当前登录状态:', isLoggedIn.value);
		loadUserInfo()
	})

	const loadUserInfo = () => {
		const storedUserInfo = uni.getStorageSync('userInfo')
		if (isLoggedIn.value && storedUserInfo) {
			userInfo.value = storedUserInfo
		}
	}

	const goToProfile = () => {
		uni.navigateTo({
			url: '/pages/mine/profile/index'
		})
	}

	const goToOrder = () => {
		uni.navigateTo({
			url: '/pages/mine/order/index'
		})
	}

	const goToCustomerService = () => {
		 wx.openCustomerServiceChat({
		       extInfo: {url: 'https://work.weixin.qq.com/kfid/kfc285c0d23a79fa954'},
		       corpId: 'ww80f6980562d27520', 
		       success(res) {
		         console.log('成功打开客服聊天界面');
		       },
		       fail(err) {
		         console.log('打开客服聊天界面失败', err);
		       }
		     });
	}

	const handleLoginOrLogout = async () => {
		if (!uni.getStorageSync('token')) {
			try {
				await wechatLogin()
				uni.navigateTo({
					url: '/pages/mine/profile/index?type=login'
				})
			} catch (err) {
				console.error('登录过程发生错误:', err)
			}
			return
		}
		uni.showModal({
			title: '提示',
			content: '确定要退出登录吗?',
			success: (modalRes) => {
				if (modalRes.confirm) {
					logout()
					uni.removeStorageSync('userInfo')
					uni.removeStorageSync('token')
					isLoggedIn.value = false
					userInfo.value = {
						userImage: '',
						nickname: '',
						tel: '',
						school: '',
						grade: '',
						calssRoom: ''
					}
					uni.showToast({
						title: '已退出登录',
						icon: 'success'
					})
				}
			}
		})
	}
</script>

<style scoped>
	.mine-container {
		min-height: 100vh;
		min-width: 100vw;
		background-color: #f5f5f5;
		position: fixed;
	}

	.user-header {
		background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
		padding: 60rpx 40rpx 40rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.user-info {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid rgba(255, 255, 255, 0.5);
		background-color: #fff;
	}

	.user-detail {
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
	}

	.nickname {
		font-size: 36rpx;
		font-weight: bold;
		color: #ffffff;
		margin-bottom: 10rpx;
	}

	.user-desc {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.arrow-right {
		font-size: 48rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.menu-section {
		background-color: #ffffff;
		margin-top: 20rpx;
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 35rpx 40rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.menu-left {
		display: flex;
		align-items: center;
	}

	.menu-icon {
		font-size: 40rpx;
		margin-right: 20rpx;
	}

	.menu-text {
		font-size: 30rpx;
		color: #333333;
	}

	.menu-item .arrow-right {
		color: #999999;
		font-size: 40rpx;
	}

	.logout-section {
		margin-top: 40rpx;
		padding: 0 40rpx;
	}

	.logout-btn {
		background-color: #ffffff;
		color: #ff4d4f;
		font-size: 30rpx;
		border-radius: 12rpx;
		border: none;
	}

	.logout-btn::after {
		border: none;
	}
</style>