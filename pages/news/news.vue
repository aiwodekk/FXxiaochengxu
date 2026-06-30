<template>
	<view class="news-container">
		<view class="content">
<!-- 			<text class="title">资讯</text>
			<text class="subtitle">这里是资讯内容区域</text> -->
			
			<!-- 1. 使用 scroll-view 包裹列表，开启 scroll-y 纵向滚动 -->
			<!-- @scrolltolower 是触底事件，bind:scrolltolower 也可以 -->
			<scroll-view 
				scroll-y 
				class="news-list" 
				@scrolltolower="loadMore"
				:style="{ height: 'calc(100vh - 200rpx)' }" 
			>
				<view class="news-item" v-for="item in newsList" :key="item.id" @click="goToDetail(item)">
					<image :src="item.image" mode="aspectFill" class="news-image" />
					<text class="news-title">{{ item.title }}</text>
				</view>

				<!-- 加载状态提示 -->
				<view class="loading-more" v-if="loading">
					<text class="loading-text">正在加载更多...</text>
				</view>
				
				<!-- 没有更多数据提示 -->
				<view class="no-more" v-if="!hasMore || newsList.length > 0">
					<text class="no-more-text">没有更多了</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { getNewsList } from '../../api/news'

// 2. 定义分页所需的状态变量
const newsList = ref([]) // 初始化为空数组
const currentPage = ref(1) // 当前页码
const pageSize = ref(10)   // 每页条数
const loading = ref(false) // 是否正在加载
const hasMore = ref(true)  // 是否还有更多数据

// 3. 核心加载函数
const fetchNews = async (isLoadMore = false) => {
	// 如果正在加载中，或者已经没有更多数据了，直接返回
	if (loading.value || !hasMore.value) return

	loading.value = true

	// 如果是加载更多，页码 +1
	if (isLoadMore) {
		currentPage.value++
	} else {
		// 如果是刷新或初始化，重置页码
		currentPage.value = 1
	}

	try {
		// 调用接口
		const response = await getNewsList({
			page: currentPage.value,
			size: pageSize.value
		})
		
		// 假设后端返回的数据结构是 { data: [...], total: 100 }
		// 请根据实际后端返回结构调整
		const newData = response.list|| [] 

		if (isLoadMore) {
			// 4. 关键点：加载更多时，使用数组合并
			newsList.value = [...newsList.value, ...newData]
		} else {
			// 初始化/刷新时，直接赋值
			newsList.value = newData
		}

		// 5. 判断是否还有更多数据
		// 如果返回的数据少于每页限制数量，说明到底了
		if (newData.length < pageSize.value) {
			hasMore.value = false
		}

	} catch (error) {
		console.error('获取资讯列表失败:', error)
		// 出错时，如果是在加载更多，页码要减回去，避免下次请求错误的页码
		if (isLoadMore) {
			currentPage.value--
		}
	} finally {
		loading.value = false
	}
}

// 6. 触底触发函数
const loadMore = () => {
	if (hasMore.value) {
		fetchNews(true) // 传入 true 表示是加载更多
	}
}

onLoad(() => {
	// 页面加载时，初始化数据
	fetchNews(false)
})

onShareAppMessage(() => ({
	title: '访学-资讯',
	path: '/pages/news/news'
}))

onShareTimeline(() => ({
	title: '访学-资讯'
}))

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
	/* 确保容器高度足够 */
	height: 100vh; 
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
	margin-bottom: 20rpx;
}

.news-list {
	width: 100%;
	padding: 0 40rpx;
	box-sizing: border-box;
	/* 这里的 overflow-y: auto 是 scroll-view 自动处理的 */
}

.news-item {
	background-color: #f0eeee;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
	display: flex;
	/* flex-direction: column; */
	align-items: center;
}
.news-image {
	width: 200rpx;
	height: 200rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}
.news-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 16rpx;
	display: block;
	margin-left: 20rpx;
}



/* 加载状态样式 */
.loading-more, .no-more {
	padding: 20rpx 0;
	text-align: center;
}
.loading-text, .no-more-text {
	font-size: 24rpx;
	color: #999999;
}
</style>