<template>
	<view class="news-detail-container">
		<view class="content">
			<view class="header">
				<text class="title">{{ title }}</text>
				<view class="meta-info">
					<text class="date">{{ date }}</text>
					<text class="author">{{ author }}</text>
				</view>
			</view>
			
			<!-- 文章摘要 -->
			<view class="summary-section">
				<text class="summary-text">{{ summary }}</text>
			</view>
			
			<!-- 打开公众号文章按钮 -->
			<view class="action-section">
				<!-- 使用 open-type="openOfficialAccountArticle" 打开公众号文章 -->
				<button class="open-article-btn" open-type="openOfficialAccountArticle" @officialaccountarticle="onOpenArticle">
					<text class="btn-text">📖 打开公众号文章</text>
				</button>
				<text class="tip-text">点击按钮查看完整文章内容</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const title = ref('资讯标题')
const date = ref('2024-01-01')
const author = ref('作者')
const summary = ref('这是一篇公众号文章的摘要，点击按钮可以查看完整内容。')
const articleUrl = ref('')

onLoad((options) => {
	// 页面加载时的逻辑
	if (options.title) {
		title.value = options.title
	}
	if (options.date) {
		date.value = options.date
	}
	if (options.author) {
		author.value = options.author
	}
	if (options.summary) {
		summary.value = decodeURIComponent(options.summary)
	}
	if (options.url) {
		articleUrl.value = decodeURIComponent(options.url)
	} else {
		// 默认公众号文章链接
		articleUrl.value = 'https://mp.weixin.qq.com/s/vQJtmIfoJh6cTvxfzyQY7g'
	}
})

// 打开公众号文章回调
const onOpenArticle = () => {
	// 这里可以做一些统计或埋点
	console.log('用户点击打开公众号文章')
}
</script>

<style scoped>
.news-detail-container {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #f5f5f5;
}

.content {
	display: flex;
	flex-direction: column;
	padding: 40rpx;
	background-color: #ffffff;
}

.header {
	margin-bottom: 40rpx;
	padding-bottom: 30rpx;
	border-bottom: 1rpx solid #eeeeee;
}

.title {
	font-size: 44rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
	line-height: 1.5;
}

.meta-info {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.date, .author {
	font-size: 24rpx;
	color: #999999;
}

/* 文章摘要样式 */
.summary-section {
	margin-bottom: 40rpx;
	padding: 30rpx;
	background-color: #f9f9f9;
	border-radius: 12rpx;
	border-left: 6rpx solid #3cc51f;
}

.summary-text {
	font-size: 30rpx;
	color: #666666;
	line-height: 1.8;
}

/* 操作区域样式 */
.action-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
}

.open-article-btn {
	width: 100%;
	height: 88rpx;
	background: linear-gradient(135deg, #3cc51f 0%, #2ba818 100%);
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	border: none;
	font-size: 32rpx;
	color: #ffffff;
	font-weight: bold;
	box-shadow: 0 8rpx 16rpx rgba(60, 197, 31, 0.3);
}

.open-article-btn::after {
	border: none;
}

.btn-text {
	font-size: 32rpx;
	color: #ffffff;
	font-weight: bold;
}

.tip-text {
	font-size: 24rpx;
	color: #999999;
	margin-top: 20rpx;
	text-align: center;
}
</style>
