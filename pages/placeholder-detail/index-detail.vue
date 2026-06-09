<template>
	<view class="container">
		<!-- 1. 顶部轮播图区域 -->
		<view class="banner-section">
			<swiper class="swiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.6)"
				indicator-active-color="#fff">
				<swiper-item v-for="(item, index) in bannerImages" :key="item.id">
					<image :src="item.image" mode="widthFix" class="banner-image"></image>
				</swiper-item>
			</swiper>
		</view>

		<!-- 2. 课程基本信息列表 -->
		<view class="info-card">
			<view class="info-title">正在报名中《{{ courseName }}》</view>
			<view class="info-list">
				<view class="info-item" v-for="(item, index) in infoList" :key="index">
					<text class="dot"></text>
					<text class="label">{{ item.label }}：</text>
					<text class="value">{{ item.value }}</text>
				</view>
			</view>
		</view>

		<!-- 3. 顶部 Tab 切换 -->
		<view class="tab-bar">
			<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
				@click="switchTab(index)" :id="'tab-' + index">
				{{ tab }}
			</view>
			<!-- 滑块动画效果 -->
			<view class="slider" :style="{ left: sliderLeft + 'px', width: sliderWidth + 'px' }"></view>
		</view>

		<!-- 课程特色内容区域  -->
		<view v-show="currentTab === 0" class="content-section">
			<image :src="courseFeatureImage" mode="widthFix" style="width: 100%;"></image>
		</view>
		<!-- 课程计划内容区域  -->
		<view v-show="currentTab === 1" class="content-section">
			<!-- 课程重点 -->
			<view class="course-highlight">
				<view class="highlight-title">
					<view class="title-block"></view>
					<text class="title-text">课程重点</text>
				</view>
				<view class="highlight-list">
					<view class="highlight-item" v-for="(item, index) in courseHighlights" :key="index">
						<text class="highlight-dot">●</text>
						<text class="highlight-text">{{ item }}</text>
					</view>
				</view>
			</view>

			<!-- 课程核心 -->
			<view class="course-core">
				<view class="core-title">
					<view class="title-block"></view>
					<text class="title-text">课程核心</text>
				</view>
				<view class="core-list">
					<view class="core-item" v-for="(item, index) in courseCore" :key="index">
						<text class="core-num">{{ index + 1 }}</text>
						<text class="core-text">{{ item }}</text>
					</view>
				</view>
			</view>
			<!-- 课程课表 -->
			<image :src="courseScheduleImage" mode="widthFix" style="width: 100%;"></image>
		</view>
		<!-- 师资介绍内容区域  -->
		<view v-show="currentTab === 2" class="content-section">
			<image :src="courseTeacherImage" mode="widthFix" style="width: 100%;"></image>
		</view>

		<!-- 5. 底部固定按钮 -->
		<view class="footer-action">
			<button class="submit-btn" @click="handleJoin">我要报名</button>
		</view>

		<!-- 服务条款弹窗 -->
		<view v-if="showPopup" class="popup-mask" @click="closePopup">
			<view class="popup-content" @click.stop>
				<view class="popup-header">服务条款</view>
				<scroll-view class="popup-body" scroll-y>
					<text class="terms-text">{{ serviceTerms }}</text>
				</scroll-view>
				<view class="popup-footer">
					<view class="agree-checkbox" @click="isAgreed = !isAgreed">
						<view class="checkbox" :class="{ checked: isAgreed }">
							<text v-if="isAgreed" class="check-icon">✓</text>
						</view>
						<text class="agree-text">我已阅读并同意上述服务条款</text>
					</view>
					<button class="confirm-btn" :class="{ disabled: !isAgreed }" :disabled="!isAgreed"
						@click="confirmJoin">确认报名</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	computed,
	nextTick,
	onMounted
} from 'vue';
import {
	onLoad
} from '@dcloudio/uni-app';
import {
	getInternationalCourseDetail
} from '../../api/course'
import {
	login
} from '../../api/user'
// --- 数据模拟 ---
// 轮播图占位
const bannerImages = [];

// 信息列表数据
const infoList = [{
	label: '课程地点',
	value: '北京师范大学鄂尔多斯第二附属学校'
},
{
	label: '适合学段',
	value: '小学'
},
{
	label: '课程时间',
	value: '2026年5月8日至2026年5月23日'
},
{
	label: '报名时间',
	value: '截止2026年4月3日'
},
{
	label: '课程费用',
	value: '2890元/人'
},
{
	label: '剩余名额',
	value: "50"
},
{
	label: "课程状态",
	value: "报名中"
}
];

// 课程特色图
const courseFeatureImage = ref('');
// 课程时间图
const courseScheduleImage = ref('');
// 师资图
const courseTeacherImage = ref('');

// Tab 数据
const tabs = ['课程特色', '课程计划', '师资介绍'];
const currentTab = ref(0);

// 课程重点数据
const courseHighlights = ref([]);

// 课程核心数据
const courseCore = ref([]);
const courseName = ref('探航空奥秘 载梦想启航');

// 弹窗相关
const showPopup = ref(false);
const isAgreed = ref(false);
const serviceTerms = ref(`尊敬的用户您好，欢迎参加我们的课程！

为保障您的权益，请您在报名前仔细阅读以下服务条款：

一、服务内容
本课程由北京师范大学鄂尔多斯第二附属学校主办，提供课程教学、实践活动等相关服务。

二、报名须知
1. 报名需缴纳课程费用2890元/人
2. 报名时间截止至2026年4月3日
3. 课程时间为2026年5月8日至2026年5月23日
4. 报名成功后因个人原因取消课程的，恕不退还费用

三、学员须知
1. 学员需遵守学校规章制度
2. 学员需服从教学安排
3. 学员需保证出勤率
4. 学员需爱护教学设施

四、安全责任
1. 学员在校期间安全由学校负责
2. 学员往返途中安全由家长负责
3. 学员需购买意外保险

五、退出条款
1. 课程开始前7天可申请退出
2. 课程开始前3天退出扣50%费用
3. 课程开始后不接受退出申请

六、知识产权
1. 课程内容知识产权归主办方所有
2. 学员不得私自录制、传播课程内容

七、特别说明
1. 主办方保留调整课程内容的权利
2. 如遇不可抗力因素，主办方有权调整课程时间
3. 主办方保留最终解释权

请您确认已阅读并同意以上条款后再进行报名。`);

onLoad((option) => {
	console.log(option);
	getCourseDetail(option.id)

})
const courseId = ref(null);
const statusMap = { 'NOT_STARTED': '未开始', 'IN_PROGRESS': '进行中', 'ENDED': '已结束' }
// 时间格式转化IOS转Y-M-D
const formatDate = (date, isTime = false) => {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	if (isTime) {
		const hours = String(d.getHours()).padStart(2, '0');
		const minutes = String(d.getMinutes()).padStart(2, '0');
		const seconds = String(d.getSeconds()).padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	}
	return `${year}-${month}-${day}`;
}
// 获取详情
const getCourseDetail = async (id) => {
	getInternationalCourseDetail(id).then(res => {
		// console.log(res);
		const data = res.detail
		console.log(data);
		courseName.value = data.name;
		infoList[0].value = data.school;
		infoList[1].value = data.grade;
		infoList[2].value = `${formatDate(data.startDate)}至${formatDate(data.endDate)}`;
		infoList[3].value = formatDate(data.deadline, true);
		infoList[4].value = `${data.price}元/人`;
		infoList[5].value = data.remain;
		infoList[6].value = statusMap[data.status] || '未知状态';
		data.images.forEach((item, index) => {
			bannerImages.push({
				id: index,
				image: item
			})
		});
		courseFeatureImage.value = data.feature[0];
		courseScheduleImage.value = data.schedule[0];
		courseTeacherImage.value = data.teacher[0];
		courseHighlights.value = data.emphasis.split('\\');
		courseCore.value = data.core.split('\\');
		courseId.value = id;
	}).catch(err => {
		console.error(err);
	})
}

// 滑块位置和宽度
const sliderLeft = ref(0);
const sliderWidth = ref(0);



// --- 逻辑方法 ---
const switchTab = (index) => {
	currentTab.value = index;
	updateSliderPosition();
};

// 更新滑块位置和宽度
const updateSliderPosition = () => {
	nextTick(() => {
		const query = uni.createSelectorQuery();
		query.select(`#tab-${currentTab.value}`).boundingClientRect();
		query.select('.tab-bar').boundingClientRect();
		query.exec((res) => {
			if (res[0] && res[1]) {
				const tabRect = res[0];
				const tabBarRect = res[1];
				sliderLeft.value = tabRect.left - tabBarRect.left;
				sliderWidth.value = tabRect.width;
			}
		});
	});
};


const handleJoin = () => {
	showPopup.value = true;
};

const closePopup = () => {
	showPopup.value = false;
	isAgreed.value = false;
};

const confirmJoin = () => {
	if (uni.getStorageSync('token')&&uni.getStorageSync('userInfo')) {
		closePopup();
		uni.navigateTo({
			url: `/pages/mine/profile/children-edit?mode=add&courseId=${courseId.value}`
		})
	} else {
		// 提示登录，点击确定跳转到登录页面
		uni.showModal({
			title: '提示',
			content: '请先登录',
			success: async (res) => {
				if (res.confirm) {
					closePopup();
					try {
						const loginRes = await uni.login({
							provider: 'weixin'
						});
						if (!loginRes.code) {
							uni.showToast({
								title: '获取登录凭证失败',
								icon: 'none'
							});
							return;
						}
						const res = await login({
							code: loginRes.code
						});
						uni.setStorageSync('token', res.token);
						uni.navigateTo({
							url: `/pages/mine/profile/index?courseId=${courseId.value}&type=login`
						})
					} catch (err) {
						console.error('登录过程发生错误:', err);
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						});
					}

				}
			}
		})
	}

};
const previewImage = () => {
	uni.previewImage({
		urls: [courseTeacherImage.value]
	})
}
onMounted(() => {
	// 页面挂载后初始化滑块位置
	setTimeout(() => {
		updateSliderPosition();
	}, 100);
});
const onShareAppMessage = () => {
	// 获取当前页面的路径参数（确保分享出去的路径是最新的）
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const route = currentPage.route
	const options = currentPage.options
	const id = options.id // 获取 URL 中的 id 参数
	console.log(id);

	return {
		title: `我正在报名，快来一起参加吧！`, // 分享标题
		path: `/pages/index-detail/index-detail?id=${id}`, // 拼接路径
		imageUrl: bannerImages?.value[0]?.image || '' // 使用课程首图作为封面
	}
}
</script>

<style lang="scss" scoped>
/* 全局变量 */
$primary-orange: #FF9933;
$primary-blue: #1A2B4B;
$text-dark: #333333;
$text-gray: #666666;

.container {
	background-color: #f5f5f5;
	min-height: 100vh;
	padding-bottom: 120rpx;
	/* 为底部按钮留出空间 */
}

/* 1. 轮播图样式 */
.banner-section {
	width: 100%;

	.swiper {
		height: 400rpx;

		.banner-image {
			width: 100%;
			height: 100%;
		}
	}
}

/* 2. 信息卡片样式 */
.info-card {
	background: #ffffff;
	margin: -40rpx 30rpx 0;
	/* 向上重叠轮播图 */
	border-radius: 16rpx;
	padding: 40rpx 30rpx;
	position: relative;
	z-index: 10;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

	.info-title {
		color: $primary-orange;
		font-size: 36rpx;
		font-weight: bold;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.info-item {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: $text-dark;

		.dot {
			width: 12rpx;
			height: 12rpx;
			background-color: $primary-orange;
			border-radius: 50%;
			margin-right: 12rpx;
			flex-shrink: 0;
		}

		.label {
			font-weight: 600;
			color: $text-dark;
		}

		.value {
			flex: 1;
			color: $text-gray;
		}
	}
}

/* 3. Tab 切换栏 */
.tab-bar {
	display: flex;
	background: #ffffff;
	margin: 30rpx 30rpx 0;
	border-radius: 12rpx;
	padding: 10rpx;
	position: relative;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

	.tab-item {
		flex: 1;
		text-align: center;
		line-height: 80rpx;
		font-size: 30rpx;
		color: $text-gray;
		z-index: 2;
		transition: color 0.3s;

		&.active {
			color: $primary-orange;
			font-weight: bold;
		}
	}

	/* 滑块指示器 (模拟) */
	.slider {
		position: absolute;
		bottom: 10rpx;
		left: 0;
		width: 33.33%;
		height: 6rpx;
		background-color: $primary-orange;
		border-radius: 3rpx;
		transition: left 0.3s ease;
	}
}

/* 4. 内容区域 (深蓝底) */
.content-section {
	padding: 40rpx 30rpx;
}

/* 课程重点样式 */
.course-highlight {
	// margin-top: 40rpx;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.highlight-title {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
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

.highlight-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.highlight-item {
	display: flex;
	align-items: flex-start;
}

.highlight-dot {
	color: $primary-orange;
	font-size: 20rpx;
	margin-right: 12rpx;
	margin-top: 6rpx;
	flex-shrink: 0;
}

.highlight-text {
	font-size: 28rpx;
	color: $text-gray;
	line-height: 1.6;
	flex: 1;
}

/* 课程核心样式 */
.course-core {
	margin-top: 40rpx;
	margin-bottom: 40rpx;
	background: #ffffff;
	border-radius: 16rpx;
	padding: 30rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.core-title {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.core-list {
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.core-item {
	display: flex;
	align-items: center;
}

.core-num {
	width: 48rpx;
	height: 48rpx;
	background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
	color: #ffffff;
	font-size: 24rpx;
	font-weight: bold;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 20rpx;
	flex-shrink: 0;
}

.core-text {
	font-size: 28rpx;
	color: $text-dark;
	line-height: 1.6;
	flex: 1;
}

/* 5. 底部按钮 */
.footer-action {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	padding: 20rpx 30rpx;
	// background-color: #ffffff;
	background-color: transparent;
	// box-shadow: 0 -4rpx 20rpx rgba(0,0,0,0.05);
	box-sizing: border-box;

	.submit-btn {
		width: 50%;
		background-color: $primary-orange;
		color: #ffffff;
		font-size: 34rpx;
		font-weight: bold;
		border-radius: 100rpx;
		height: 90rpx;
		line-height: 90rpx;
		box-shadow: 0 8rpx 20rpx rgba(255, 153, 51, 0.4);

		&:after {
			border: none;
		}
	}
}

/* 弹窗样式 */
.popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.popup-content {
	width: 600rpx;
	max-height: 80vh;
	background: #ffffff;
	border-radius: 24rpx;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

.popup-header {
	padding: 30rpx;
	text-align: center;
	font-size: 34rpx;
	font-weight: bold;
	color: #333333;
	border-bottom: 1rpx solid #f0f0f0;
}

.popup-body {
	width: 96%;
	flex: 1;
	padding-left: 3%;
	padding-right: 2%;
	padding-top: 30rpx;
	padding-bottom: 30rpx;
	max-height: 50vh;
}

.terms-text {
	font-size: 28rpx;
	color: #666666;
	line-height: 1.8;
	white-space: pre-wrap;
}

.popup-footer {
	padding: 30rpx;
	border-top: 1rpx solid #f0f0f0;
}

.agree-checkbox {
	display: flex;
	align-items: center;
	margin-bottom: 30rpx;
}

.checkbox {
	width: 40rpx;
	height: 40rpx;
	border: 2rpx solid #d9d9d9;
	border-radius: 8rpx;
	margin-right: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f5f5f5;

	&.checked {
		background: $primary-orange;
		border-color: $primary-orange;
	}
}

.check-icon {
	color: #ffffff;
	font-size: 24rpx;
	font-weight: bold;
}

.agree-text {
	font-size: 26rpx;
	color: #666666;
}

.confirm-btn {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background: $primary-orange;
	color: #ffffff;
	font-size: 32rpx;
	border-radius: 40rpx;
	border: none;

	&.disabled {
		background: #cccccc;
	}
}
</style>