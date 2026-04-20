<template>
	<view class="mine-container">
		<!-- 用户信息头部 -->
		<view class="user-header" @click="goToProfile">
			<view class="user-info">
				<image class="avatar" :src="userInfo.avatar || '/static/default-avatar.png'" mode="aspectFill" @click.stop="chooseAvatar"></image>
				<view class="user-detail">
					<text class="nickname" @click.stop="chooseNickname">{{ userInfo.nickname || '输入昵称' }}</text>
					<text class="user-desc">{{ userInfo.phone || '完善个人资料' }}</text>
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
					<text class="menu-text">资讯客服</text>
				</view>
				<text class="arrow-right">›</text>
			</view>
		</view>

		<!-- 退出登录 -->
		<view class="logout-section">
			<button class="logout-btn" @click="handleLogout">{{ isLoggedIn ? '退出登录' : '立即登录' }}</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'

const userInfo = ref({
	avatar: '',
	nickname: '',
	phone: '',
	school: '',
	grade: '',
	calssRoom:''
})

const isLoggedIn = computed(() => {
	return !!(userInfo.value.avatar || userInfo.value.nickname)
})

onLoad(() => {
	loadUserInfo()
})

onShow(() => {
	loadUserInfo()
})

onMounted(() => {
	loadUserInfo()
})

const loadUserInfo = () => {
	// 从本地存储加载用户信息
	const storedUserInfo = uni.getStorageSync('userInfo')
	if (storedUserInfo) {
		userInfo.value = storedUserInfo
	}
}

const chooseAvatar = () => {
	// 使用微信小程序头像选择
	uni.chooseImage({
		count: 1,
		sizeType: ['compressed'],
		sourceType: ['album', 'camera'],
		success: (res) => {
			const tempFilePath = res.tempFilePaths[0]
			userInfo.value.avatar = tempFilePath
			uni.setStorageSync('userInfo', userInfo.value)
			uni.showToast({
				title: '头像已更新',
				icon: 'success'
			})
		},
		fail: (err) => {
			console.error('选择头像失败:', err)
		}
	})
}

const chooseNickname = () => {
	// 弹出输入框让用户修改昵称
	uni.showModal({
		title: '修改昵称',
		content: userInfo.value.nickname || '',
		editable: true,
		success: (res) => {
			if (res.confirm && res.content) {
				userInfo.value.nickname = res.content
				uni.setStorageSync('userInfo', userInfo.value)
				uni.showToast({
					title: '昵称已更新',
					icon: 'success'
				})
			}
		}
	})
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
	uni.navigateTo({
		url: '/pages/mine/customer-service/index'
	})
}

const handleLogout = async () => {
	if (!isLoggedIn.value) {
		// 未登录时,调用微信登录
		await wxLogin();
		return
	}

	uni.showModal({
		title: '提示',
		content: '确定要退出登录吗?',
		success: (res) => {
			if (res.confirm) {
				// 清除本地存储的用户信息
				uni.removeStorageSync('userInfo')
				// 重置用户信息
				userInfo.value = {
					avatar: '',
					nickname: '',
					phone: '',
					school: '',
					grade: ''
				}
				uni.showToast({
					title: '已退出登录',
					icon: 'success'
				})
			}
		}
	})
}

// 微信登录
const wxLogin = async () => {
	if (!userInfo.value.nickname || !userInfo.value.avatar || !userInfo.value.phone || !userInfo.value.school || !userInfo.value.grade || !userInfo.value.calssRoom ) {
		uni.showModal({
			title: '提示',
			content: '请先完善您的个人资料',
			showCancel: false,
			success: () => {
				uni.navigateTo({
					url: '/pages/mine/profile/index'
				});
			}
		});
		return
	}
	try {
		uni.showLoading({ title: '登录中...' });

		// 1. 调用微信登录获取 code
		const loginRes = await new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: (res) => resolve(res),
				fail: (err) => reject(err)
			});
		});

		console.log('login code:', loginRes.code);

		// 2. 将 code 发送到后端，换取用户信息和 token
		// TODO: 替换为你的后端接口
		// const userRes = await new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'https://your-api.com/api/login',
		// 		method: 'POST',
		// 		data: { code: loginRes.code },
		// 		success: (res) => resolve(res.data),
		// 		fail: (err) => reject(err)
		// 	});
		// });

		// 模拟后端返回的用户信息
		const newUserInfo = {
			avatar: '/static/default-avatar.png',
			nickname: '微信用户',
			phone: '',
			school: '',
			grade: ''
		};

		// 3. 保存用户信息
		uni.setStorageSync('userInfo', newUserInfo);
		userInfo.value = newUserInfo;

		uni.hideLoading();
		uni.showToast({
			title: '登录成功',
			icon: 'success'
		});


	} catch (err) {
		uni.hideLoading();
		console.error('微信登录失败:', err);
		uni.showToast({
			title: '登录失败',
			icon: 'error'
		});
	}
};
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
