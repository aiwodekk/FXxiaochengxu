<template>
	<view class="welcome-container">
		<view class="logo-area">
			<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
		</view>
		<view class="text-area">
			<text class="title">欢迎来到访学小程序</text>
			<text class="subtitle">开启你的学术交流之旅</text>
		</view>
		<view class="enter-btn" @click="enterHome">
			<text class="btn-text">进入首页</text>
		</view>
	</view>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
	// 页面加载时的逻辑
})

const enterHome = () => {
	uni.reLaunch({
		url: '/pages/index/index'
	})
}
</script>

<style scoped>
.welcome-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	min-width: 100vw;
	position: fixed;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo-area {
	margin-bottom: 40rpx;
}

.logo {
	width: 200rpx;
	height: 200rpx;
}

.text-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 100rpx;
}

.title {
	font-size: 48rpx;
	font-weight: bold;
	color: #ffffff;
	margin-bottom: 20rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #f0f0f0;
}

.enter-btn {
	width: 400rpx;
	height: 90rpx;
	background-color: #ffffff;
	border-radius: 45rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.2);
}

.btn-text {
	font-size: 32rpx;
	color: #667eea;
	font-weight: bold;
}
</style>
