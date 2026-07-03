<template>
  <view v-if="show" class="privacy-overlay">
    <view class="privacy-dialog">
      <text class="privacy-title">隐私保护提示</text>
      <text class="privacy-desc">
        在使用选择头像功能前，请先阅读并同意
        <text class="privacy-link" @click="openContract">《隐私协议》</text>
      </text>
      <view class="privacy-buttons">
        <button class="btn-disagree" @click="disagree">拒绝</button>
        <button class="btn-agree" open-type="agreePrivacyAuthorization" @agreeprivacyauthorization="agree">同意</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { showPrivacyPopup, handlePrivacyAgree, handlePrivacyDisagree, openPrivacyContract } from '../utils/privacy'

const show = computed(() => showPrivacyPopup.value)

const agree = () => {
  handlePrivacyAgree()
}

const disagree = () => {
  handlePrivacyDisagree()
}

const openContract = () => {
  openPrivacyContract()
}
</script>

<style scoped>
.privacy-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.privacy-dialog {
  width: 600rpx;
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.privacy-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 24rpx;
}

.privacy-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 40rpx;
}

.privacy-link {
  color: #007aff;
  text-decoration: underline;
}

.privacy-buttons {
  display: flex;
  gap: 30rpx;
  width: 100%;
}

.btn-disagree {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #f5f5f5;
  color: #666;
  border-radius: 12rpx;
  font-size: 30rpx;
  border: none;
  padding: 0;
}

.btn-agree {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background: #07c160;
  color: #fff;
  border-radius: 12rpx;
  font-size: 30rpx;
  border: none;
  padding: 0;
}

.btn-disagree::after,
.btn-agree::after {
  border: none;
}
</style>
