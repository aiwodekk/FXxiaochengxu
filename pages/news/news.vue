<template>
	<view class="news-container">
		<view class="content">
			<text class="title">资讯</text>
			<text class="subtitle">这里是资讯内容区域</text>
			<view class="news-list">
				<view class="news-item" v-for="item in newsList" :key="item.id" @click="goToDetail(item)">
					<text class="news-title">{{ item.title }}</text>
					<view class="news-meta">
						<text class="news-date">{{ item.date }}</text>
						<text class="news-author">{{ item.author }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const newsList = ref([
	{ id: 1, title: '学术交流会议通知', date: '2024-01-15', author: '管理员' },
	{ id: 2, title: '访学项目申请指南', date: '2024-01-10', author: '教务处' },
	{ id: 3, title: '国际合作研究计划', date: '2024-01-05', author: '科研处' }
])

onLoad(() => {
	// 页面加载时的逻辑
})

const goToDetail = (item) => {
	uni.navigateTo({
		url: `/pages/news-detail/news-detail?title=${item.title}&date=${item.date}&author=${item.author}&id=${item.id}`
	})
}
</script>

<style scoped>
.news-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
}

.subtitle {
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 40rpx;
}

.news-list {
	width: 100%;
	padding: 0 40rpx;
}

.news-item {
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.news-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 16rpx;
	display: block;
}

.news-meta {
	display: flex;
	justify-content: space-between;
}

.news-date, .news-author {
	font-size: 24rpx;
	color: #999999;
}
</style>
