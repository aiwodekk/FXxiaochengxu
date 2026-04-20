<template>
  <view class="container">
    <!-- 1. 顶部轮播图区域 -->
    <view class="banner-section">
      <swiper class="swiper" :indicator-dots="true" indicator-color="rgba(255,255,255,0.6)" indicator-active-color="#fff">
        <swiper-item v-for="(item, index) in bannerImages" :key="item.id">
          <image :src="item.image" mode="widthFix" class="banner-image"></image>
        </swiper-item>
      </swiper>
    </view>

    <!-- 2. 课程基本信息列表 -->
    <view class="info-card">
      <view class="info-title">正在报名中《探航空奥秘 载梦想启航》</view>
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
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: currentTab === index }"
        @click="switchTab(index)"
        :id="'tab-' + index"
      >
        {{ tab }}
      </view>
      <!-- 滑块动画效果 -->
      <view class="slider" :style="{ left: sliderLeft + 'px', width: sliderWidth + 'px' }"></view>
    </view>

    <!-- 课程特色内容区域  -->
    <view v-show="currentTab===0" class="content-section">
     <image src="/static/特色(1).jpg" mode="widthFix" style="width: 100%;"></image>
    </view>
	 <!-- 课程计划内容区域  -->
    <view v-show="currentTab===1" class="content-section">
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
	  <image src="/static/课表(1).jpg" mode="widthFix" style="width: 100%;"></image>
    </view>
	 <!-- 师资介绍内容区域  -->
    <view v-show="currentTab===2" class="content-section">
     <image src="/static/老师(1).jpg" mode="widthFix" style="width: 100%;"></image>
    </view>

    <!-- 5. 底部固定按钮 -->
    <view class="footer-action">
      <button class="submit-btn" @click="handleJoin">我要报名</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

// --- 数据模拟 ---
// 轮播图占位
const bannerImages = [
		{ id: 1, image: '/static/logo.png' },
		{ id: 2, image: '/static/课表(1).jpg' },
		{ id: 3, image: '/static/特色(1).jpg' }
];

// 信息列表数据
const infoList = [
  { label: '课程地点', value: '北京师范大学鄂尔多斯第二附属学校' },
  { label: '适合学段', value: '小学' },
  { label: '课程时间', value: '2026年5月8日至2026年5月23日' },
  { label: '报名时间', value: '截止2026年4月3日' },
  { label: '课程费用', value: '2890元/人' },
  {label:'剩余名额',value:"50"},
  {label:"课程状态",value:"报名中"}
];

// Tab 数据
const tabs = ['课程特色', '课程计划', '师资介绍'];
const currentTab = ref(0);

// 课程重点数据
const courseHighlights = [
  '掌握航空基础知识，培养科学探索精神',
  '通过动手实践，提升动手能力和创新思维',
  '实地参观航空基地，近距离感受航空魅力',
  '专业导师全程指导，确保学习效果'
];

// 课程核心数据
const courseCore = [
  '航空原理与飞行器构造基础',
  '模拟飞行体验与操作实践',
  '航空航天科技发展与未来趋势',
  '团队协作与项目式学习成果展示'
];

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
	uni.navigateTo({
		url:'/pages/mine/profile/children-edit'
	})
};

onMounted(() => {
  // 页面挂载后初始化滑块位置
  setTimeout(() => {
    updateSliderPosition();
  }, 100);
});
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
  padding-bottom: 120rpx; /* 为底部按钮留出空间 */
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
  margin: -40rpx 30rpx 0; /* 向上重叠轮播图 */
  border-radius: 16rpx;
  padding: 40rpx 30rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);

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
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);

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
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
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
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
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
      border: none; /* 去除默认边框 */
    }
  }
}
</style>