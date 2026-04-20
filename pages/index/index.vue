<template>
	<view class="home-container">
		<view class="content">
			<!-- 搜索框 -->
			<view class="search-box">
				<input class="search-input" v-model="searchKeyword" placeholder="搜索学校" @confirm="onSearch" @input="onSearchInput" />
				<picker class="search-btn" :value="cityIndex" :range="cityList" @change="onCityChange">
				  <view class="search-text">
				    {{ cityIndex === 0 ? '所在城市' : cityList[cityIndex] }}
				  </view>
				</picker>
				<picker class="search-btn" :value="categoryIndex" :range="categoryList" @change="onCategoryChange">
				  <view class="search-text">
				    {{ categoryIndex === 0 ? '课程分类' : categoryList[categoryIndex] }}
				  </view>
				</picker>
				<view class="search-btn" @click="onSearch">
					<text class="search-text">搜索</text>
				</view>
			</view>
			<!-- 轮播图 -->
			<swiper class="banner-swiper" :indicator-dots="true"  :duration="500">
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<image class="banner-image" :src="item.image" mode="aspectFill"></image>
				</swiper-item>
			</swiper>

			<!-- 课程列表 -->
			<view class="section-title">
				<view class="title-block"></view>
				<text class="title-text">课程列表</text>
			</view>
			      <view class="grade-tabs">
			        <view 
			          v-for="(tab, index) in gradeTabs" 
			          :key="index" 
			          class="tab-item" 
			          :class="{ 'active': currentGradeIndex === index }"
			          @click="onGradeTabChange(index)"
			        >
			          {{ tab }}
			        </view>
			      </view>
			<view class="course-list">
				<view class="course-item" v-for="(item, index) in displayCourseList" :key="item.id" @click="goToCourseDetail(item)">
					<image class="school-logo" :src="item.logo" mode="aspectFit"></image>
					<view class="course-info">
						<text class="course-name">{{ item.name }}</text>
						<text class="course-school">{{ item.schoolName }}</text>
					</view>
					<view class="classStyle">
						{{item.gradeLevel === 1 ? '小学' : item.gradeLevel === 2 ? '初中' : '高中'}}
					</view>
				</view>
			</view>
			
			<!-- 加载更多提示 -->
			<view class="loading-more" v-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>
			<view class="no-more" v-if="noMore">
				<text class="no-more-text">没有更多了</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import courseData from './data.json';
const courseList = ref([])
const displayCourseList = ref([])
const searchKeyword = ref('')
const bannerList = ref([])
const isLoading = ref(false)
const noMore = ref(false)
const currentPage = ref(1)
const pageSize = 20
// 新增：筛选相关数据
const cityList = ref(['全部', '北京', '上海', '广州', '深圳', '杭州'])
const categoryList = ref(['全部', '数学', '英语', '物理', '化学', '编程'])
const cityIndex = ref(0)
const categoryIndex = ref(0)
const gradeTabs = ref([ '小学', '初中', '高中'])
const currentGradeIndex = ref(0) // 当前选中的 Tab 索引
onLoad(() => {
	courseList.value = courseData
	// 轮播图数据
	bannerList.value = [
		{ id: 1, image: '/static/logo.png' },
		{ id: 2, image: '/static/课表(1).jpg' },
		{ id: 3, image: '/static/特色(1).jpg' }
	]
	
	// 初始加载第一页数据
	loadMoreData()
})

// 加载更多数据
const loadMoreData = () => {
	if (isLoading.value || noMore.value) return
	
	// 如果有搜索关键词，不进行懒加载
	if (searchKeyword.value.trim()) return
	
	isLoading.value = true
	
	// 模拟网络延迟
	setTimeout(() => {
		const start = (currentPage.value - 1) * pageSize
		const end = start + pageSize
		const newData = courseList.value.slice(start, end)
		
		displayCourseList.value = [...displayCourseList.value, ...newData]
		currentPage.value++
		isLoading.value = false
		
		// 判断是否还有更多数据
		if (end >= courseList.value.length) {
			noMore.value = true
		}
	}, 500)
}

// 触底加载
onReachBottom(() => {
	loadMoreData()
})

// 新增：学段 Tab 点击事件
const onGradeTabChange = (index) => {
  currentGradeIndex.value = index
}

const onCityChange = (e) => {
  cityIndex.value = e.detail.value
}

// 新增：分类选择变化
const onCategoryChange = (e) => {
  categoryIndex.value = e.detail.value
}

const onSearch = () => {
	const keyword = searchKeyword.value.trim()
	
	if (!keyword) {
		// 如果搜索框为空，恢复懒加载模式
		resetToLazyLoad()
		return
	}
	
	// 根据学校名称进行模糊搜索
	const filteredCourses = courseList.value.filter(item => 
		item.schoolName.includes(keyword)
	)
	
	displayCourseList.value = filteredCourses
	console.log(displayCourseList.value);
	noMore.value = true // 搜索完成后显示"没有更多了"
	
}

// 搜索框输入时触发
const onSearchInput = () => {
	if (!searchKeyword.value.trim()) {
		// 输入框为空时，恢复懒加载模式
		resetToLazyLoad()
	}
}

// 重置为懒加载模式
const resetToLazyLoad = () => {
	currentPage.value = 1
	displayCourseList.value = []
	noMore.value = false
	isLoading.value = false
	loadMoreData()
}

const goToCourseDetail = (item) => {
	uni.navigateTo({
		url: `/pages/index-detail/index-detail?title=${item.name}&id=${item.id}`
	})
}
</script>

<style scoped>
	.grade-tabs {
	  width: 100%;
	  white-space: nowrap;
	  padding: 0 20rpx;
	  margin-bottom: 20rpx;
	  display: flex;
	  justify-content: space-around;
	}
	
	.tab-item {
	  display: inline-block;
	  padding: 16rpx 30rpx;
	  margin-right: 20rpx;
	  font-size: 28rpx;
	  color: #666666;
	  border-radius: 30rpx;
	  background-color: #f5f5f5;
	  transition: all 0.3s ease;
	}
	
	.tab-item.active {
	  color: #ffffff;
	  background-color: rgb(255, 144, 62);
	  font-weight: bold;
	}
.home-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20rpx;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

/* 搜索框样式 */
.search-box {
	width: 100%;
	padding: 0 20rpx;
	margin-bottom: 20rpx;
	display: flex;
	align-items: center;
}

.search-input {
	flex: 1;
	height: 70rpx;
	background-color: #f5f5f5;
	border-radius: 35rpx;
	padding: 0 30rpx;
	font-size: 28rpx;
}

.search-btn {
	margin-left: 20rpx;
	height: 70rpx;
	padding: 0 30rpx;
	background-color: rgb(255, 144, 62);
	border-radius: 35rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.search-text {
	font-size: 28rpx;
	color: #ffffff;
	font-weight: bold;
}

/* 轮播图样式 */
.banner-swiper {
	width: 100%;
	height: 300rpx;
	margin-bottom: 20rpx;
	border-radius: 16rpx;
	overflow: hidden;
}

.banner-image {
	width: 100%;
	height: 100%;
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

/* 课程列表样式 */
.course-list {
	width: 100%;
	padding: 0 20rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}

.course-item {
	width: 48%;
	display: flex;
	align-items: center;
	background-color: #ffffff;
	border-radius: 16rpx;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
	box-sizing: border-box;
	position: relative;
}

.school-logo {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	margin-right: 16rpx;
	flex-shrink: 0;
}

.course-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.course-name {
	font-size: 20rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 6rpx;
}

.course-school {
	font-size: 16rpx;
	color: #666666;
}

/* 课程列表标题样式 */
.section-title {
	width: 100%;
	padding: 30rpx 20rpx 20rpx;
	display: flex;
	align-items: center;
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

/* 加载更多样式 */
.loading-more {
	width: 100%;
	padding: 30rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.loading-text {
	font-size: 26rpx;
	color: #999999;
}

/* 没有更多样式 */
.no-more {
	width: 100%;
	padding: 30rpx 0;
	display: flex;
	justify-content: center;
	align-items: center;
}

.no-more-text {
	font-size: 26rpx;
	color: #cccccc;
}

/* 学段标签样式 */
.classStyle {
	position: absolute;
	bottom: 12rpx;
	right: 12rpx;
	font-size: 14rpx;
	background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
	color: #ffffff;
	padding: 4rpx 12rpx;
	border-radius: 20rpx;
	font-weight: 500;
	line-height: 1;
}
</style>
