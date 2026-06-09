<template>
  <view class="avatar-container">
    <!-- 标题 -->
    <!-- <text class="label">头像</text> -->
    
    <!-- 头像显示区域 -->
    <!-- 使用 button 的 open-type="chooseAvatar" 是微信官方推荐的新写法 -->
    <button 
      class="avatar-btn" 
      open-type="chooseAvatar" 
      @chooseavatar="onChooseAvatar"
    >
      <image :src="displayAvatar" mode="aspectFill" class="avatar-img"></image>
      <!-- 未登录时显示一个遮罩提示 -->
<!--      <view v-if="!isLoggedIn" class="upload-mask">
        <text class="iconfont">📷</text>
      </view> -->
    </button>
  </view>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';

// 定义属性：接收外部传入的用户信息
const props = defineProps({
  modelValue: String, // 支持 v-model
  userInfo: Object    // 你的全局用户信息对象
});

const emit = defineEmits(['update:modelValue', 'choose']);

// 1. 登录状态判断
const isLoggedIn = ref(false);

// 显示头像的计算属性
const displayAvatar = computed(() => {
  // 如果已登录，优先显示服务器返回的头像
  if (isLoggedIn.value && props.userInfo?.userImage) {
    return props.userInfo.userImage;
  }
  // 如果未登录，但有本地选中的图（v-model），显示本地的
  if (props.modelValue) {
    return props.modelValue;
  }
  // 默认占位图（微信默认灰色头像）
  return 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
});

// 页面加载时检查登录状态
const checkLoginStatus = () => {
  const token = uni.getStorageSync('token');
  isLoggedIn.value = !!token;
  console.log('当前登录状态:', isLoggedIn.value);
};
checkLoginStatus();

// 3. 处理头像选择（兼容微信原生组件）
const onChooseAvatar = (e) => {
  const { avatarUrl } = e.detail;
  updateAvatar(avatarUrl);
};

// 4. 兜底点击事件（兼容旧版或普通点击）
// const handleClick = () => {
//   // 如果已登录，这里可以不做任何事，或者你可以选择允许他们更换头像
//   if (isLoggedIn.value) {
//     // 可选：如果已登录也想换头像，可以取消下面的注释
//     // uni.chooseImage({ count: 1, success: (res) => updateAvatar(res.tempFilePaths[0]) });
//     return; 
//   }
  
//   // 如果未登录，触发选择图片
//   uni.chooseImage({
//     count: 1,
//     success: (res) => {
//       updateAvatar(res.tempFilePaths[0]);
//     }
//   });
// };

// 5. 统一更新逻辑
const updateAvatar = (path) => {
  emit('update:modelValue', path); // 更新 v-model
  emit('choose', path);            // 触发事件给父组件
  
  // 这里可以加一个提示
  if (!isLoggedIn.value) {
    // uni.showToast({ title: '头像已选择（未登录）', icon: 'none' });
  }
};
</script>
<style scoped>
.avatar-container {
  display: flex;
  align-items: center;
  /* padding: 20rpx 0; */
}

.label {
  width: 100rpx;
  font-size: 28rpx;
  color: #333;
}

.avatar-btn {
  width: 150rpx;
  height: 150rpx;
  border-radius: 50%;
  overflow: hidden;
  border: none;
  background: none;
  padding: 0;
  margin: 0;
  position: relative;
  box-sizing: border-box;
}

.avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.upload-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 40rpx;
}
</style>