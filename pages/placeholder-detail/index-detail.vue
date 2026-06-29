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
import { wechatLogin } from '../../utils/auth'
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
	label: '截止时间',
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
const serviceTerms = ref('');

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
		serviceTerms.value = `尊敬的家长、同学：

您好！欢迎报名参加 ${data.school} 访学项目。为保障活动顺利开展及您的合法权益，请您在报名缴费前仔细阅读并确认以下内容：

一、项目基本信息
项目名称：访学项目
主办单位：${data.school}
项目时间：${formatDate(data.startDate)} 至 ${formatDate(data.endDate)}
报名截止时间：${formatDate(data.deadline)}
项目费用：${data.price}元/人

报名缴费成功后，即视为本人及监护人已充分了解并同意本须知全部内容。

二、项目内容
项目期间，学员将进入合作学校进行沉浸式学习与交流，参与课堂跟班学习、校园文化体验、实践活动及其他教育交流活动，具体安排以主办方实际通知为准。

三、学员行为规范
为维护良好的学习和交流秩序，学员须做到：

遵守国家法律法规及项目学校各项管理制度；
尊重师长、团结同学，文明交流，树立良好形象；
按要求参加各项课程、活动及集体安排，不得擅自离队或单独行动；
爱护学校公共设施及教学设备，如因个人原因造成损坏，须承担相应赔偿责任；
不得从事任何影响教学秩序或存在安全隐患的行为。

对于严重违反纪律或影响项目正常开展的学员，主办方有权取消其参与资格，相关费用不予退还。

四、安全与责任说明
项目期间，主办方及接待学校将按照活动安排履行教育管理职责；
学员应严格遵守活动纪律和安全要求，服从带队老师及学校管理人员安排；
学员因违反纪律、擅自离队或不服从管理造成的人身伤害、财产损失及其他后果，由本人及监护人承担相应责任；
学员往返项目学校期间的人身及财产安全由监护人负责；
建议学员在参加项目期间购买人身意外伤害保险。

五、请假与退出规则
（一）请假规定
项目期间原则上不接受无故请假。如因特殊情况需请假，应提前向项目负责人提出申请，经批准后方可离开。

（二）退出规则
项目开始前7日（含）以上申请退出，可全额退款；
项目开始前3日至6日申请退出，扣除已发生费用后退还剩余款项；
项目开始前3日内申请退出，退还50%项目费用；
项目开始后，中途退出或无故缺席的，已缴费用不予退还。

六、肖像权与宣传授权
项目期间，主办方可能对课程、活动过程进行拍摄、录像及资料收集，用于项目总结、成果展示、宣传推广及教育交流等非商业用途。

报名即视为学员本人及监护人同意主办方合理使用相关影像资料。如有特殊情况，请提前书面说明。

七、知识产权保护
项目课程资料、教学内容、活动方案及相关成果的知识产权归主办方或权利人所有；
未经授权，任何个人不得复制、录制、传播、转载或用于商业用途；
因违反知识产权规定造成损失的，应依法承担相应责任。

八、特别说明
主办方有权根据实际情况对课程内容、活动安排、师资配置等进行合理调整；
因不可抗力因素（包括但不限于自然灾害、公共卫生事件、政府管控措施等）导致项目延期、取消或调整的，主办方将及时通知并妥善处理；
本项目未尽事宜，由主办方另行通知；
本须知最终解释权归主办方所有。
监护人确认

本人已认真阅读并充分理解《校际交流跟班项目报名须知》全部内容，同意并遵守相关规定，自愿为学生报名参加本项目。

监护人签字：_______________

学生签字：_______________

签署日期：______年____月____日

（线上报名勾选“我已阅读并同意”即视为完成确认）`;
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
	if (uni.getStorageSync('token') && uni.getStorageSync('userInfo')) {
		closePopup();
		uni.navigateTo({
			url: `/pages/mine/profile/children-edit?mode=add&courseId=${courseId.value}`
		})
	} else {
		uni.showModal({
			title: '提示',
			content: '请先登录',
			success: async (modalRes) => {
				if (!modalRes.confirm) return
				closePopup();
				try {
					await wechatLogin()
					uni.navigateTo({
						url: `/pages/mine/profile/index?courseId=${courseId.value}&type=login`
					})
				} catch (err) {
					console.error('登录过程发生错误:', err)
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