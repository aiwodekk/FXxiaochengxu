<template>
	<view class="service-container">
		<!-- 客服联系方式 -->
		<view class="contact-section">
			<view class="section-title">联系客服</view>
			<view class="contact-list">
				<view class="contact-item" @click="makeCall">
					<view class="contact-left">
						<text class="contact-icon">📞</text>
						<view class="contact-info">
							<text class="contact-label">电话客服</text>
							<text class="contact-value">400-123-4567</text>
						</view>
					</view>
					<text class="arrow">›</text>
				</view>
				
				<view class="contact-item" @click="copyWechat">
					<view class="contact-left">
						<text class="contact-icon">💬</text>
						<view class="contact-info">
							<text class="contact-label">微信客服</text>
							<text class="contact-value">fangxue_service</text>
						</view>
					</view>
					<text class="arrow">›</text>
				</view>
				
				<view class="contact-item" @click="sendEmail">
					<view class="contact-left">
						<text class="contact-icon">📧</text>
						<view class="contact-info">
							<text class="contact-label">邮件客服</text>
							<text class="contact-value">service@fangxue.com</text>
						</view>
					</view>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>

		<!-- 常见问题 -->
		<view class="faq-section">
			<view class="section-title">常见问题</view>
			<view class="faq-list">
				<view 
					v-for="(faq, index) in faqList" 
					:key="index"
					class="faq-item"
					@click="toggleFaq(index)"
				>
					<view class="faq-question">
						<text class="question-text">{{ faq.question }}</text>
						<text class="faq-arrow" :class="{ active: faq.expanded }">▼</text>
					</view>
					<view v-if="faq.expanded" class="faq-answer">
						<text class="answer-text">{{ faq.answer }}</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 在线客服按钮 -->
		<view class="online-service">
			<button class="online-btn" @click="openOnlineService">
				<text class="btn-icon">💭</text>
				<text>在线咨询</text>
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'

const faqList = ref([
	{
		question: '如何预订访学项目?',
		answer: '您可以在首页浏览所有访学项目,选择感兴趣的项目后点击"立即预订",填写相关信息并完成支付即可成功预订。',
		expanded: false
	},
	{
		question: '如何取消订单?',
		answer: '在"我的订单"页面,找到需要取消的订单,点击"取消订单"按钮,选择取消原因并确认即可。请注意,不同状态的订单取消规则可能不同。',
		expanded: false
	},
	{
		question: '如何添加孩子信息?',
		answer: '在"我的资料"页面,点击"添加"按钮,填写孩子的姓名、年龄、性别、学校等信息后保存即可。您可以添加多个孩子信息。',
		expanded: false
	},
	{
		question: '访学项目包含哪些内容?',
	answer: '我们的访学项目通常包含校园参观、名师讲座、文化交流、住宿和餐饮等服务。具体项目内容请在项目详情页查看。',
		expanded: false
	},
	{
		question: '是否支持退款?',
		answer: '在项目开始前7天可以申请全额退款,7天内申请退款将收取一定手续费。具体退款政策请参阅用户协议。',
		expanded: false
	}
])

const makeCall = () => {
	uni.makePhoneCall({
		phoneNumber: '4001234567'
	})
}

const copyWechat = () => {
	uni.setClipboardData({
		data: 'fangxue_service',
		success: () => {
			uni.showToast({
				title: '微信号已复制',
				icon: 'success'
			})
		}
	})
}

const sendEmail = () => {
	uni.showToast({
		title: '请使用邮箱联系客服',
		icon: 'none'
	})
}

const toggleFaq = (index) => {
	faqList.value[index].expanded = !faqList.value[index].expanded
}

const openOnlineService = () => {
	uni.showToast({
		title: '在线客服功能开发中',
		icon: 'none'
	})
}
</script>

<style scoped>
.service-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;
}

.section-title {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
	padding: 30rpx 40rpx;
	background-color: #ffffff;
}

.contact-list {
	background-color: #ffffff;
}

.contact-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.contact-item:last-child {
	border-bottom: none;
}

.contact-left {
	display: flex;
	align-items: center;
	flex: 1;
}

.contact-icon {
	font-size: 48rpx;
	margin-right: 20rpx;
}

.contact-info {
	display: flex;
	flex-direction: column;
}

.contact-label {
	font-size: 28rpx;
	color: #666666;
	margin-bottom: 5rpx;
}

.contact-value {
	font-size: 30rpx;
	color: #333333;
	font-weight: bold;
}

.arrow {
	font-size: 40rpx;
	color: #999999;
}

.faq-section {
	margin-top: 20rpx;
}

.faq-list {
	background-color: #ffffff;
}

.faq-item {
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.faq-item:last-child {
	border-bottom: none;
}

.faq-question {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.question-text {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
}

.faq-arrow {
	font-size: 24rpx;
	color: #999999;
	transition: transform 0.3s;
	margin-left: 20rpx;
}

.faq-arrow.active {
	transform: rotate(180deg);
}

.faq-answer {
	margin-top: 20rpx;
	padding: 20rpx;
	background-color: #f9f9f9;
	border-radius: 8rpx;
}

.answer-text {
	font-size: 26rpx;
	color: #666666;
	line-height: 1.6;
}

.online-service {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 40rpx;
	background-color: #ffffff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.online-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 12rpx;
	border: none;
	display: flex;
	align-items: center;
	justify-content: center;
}

.online-btn::after {
	border: none;
}

.btn-icon {
	font-size: 36rpx;
	margin-right: 10rpx;
}
</style>
