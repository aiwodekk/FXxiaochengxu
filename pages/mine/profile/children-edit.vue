<template>
	<view class="children-edit-container">
		<view class="form-section">
			<view class="form-item">
				<text class="label">姓名</text>
				<input 
					class="input" 
					v-model="formData.name" 
					placeholder="请输入孩子姓名"
				/>
			</view>
			<view class="form-item">
				<text class="label">年龄</text>
				<input 
					class="input" 
					v-model="formData.age" 
					placeholder="请输入年龄"
					type="number"
				/>
			</view>
			<view class="form-item">
				<text class="label">性别</text>
				<radio-group @change="onGenderChange">
					<label class="radio-item">
						<radio value="男" :checked="formData.gender === '男'" />
						<text>男</text>
					</label>
					<label class="radio-item">
						<radio value="女" :checked="formData.gender === '女'" />
						<text>女</text>
					</label>
				</radio-group>
			</view>
			<view class="form-item">
				<text class="label">就读学校</text>
				<picker :value="formData.school" :range="schoolList" @change="changeShool">
					<view>{{ formData.school || '请选择学校' }}</view>
				</picker>
<!-- 				<input 
					class="input" 
					v-model="formData.school" 
					placeholder="请输入学校"
				/> -->
			</view>
			<view class="form-item">
				<text class="label">年级</text>
				<picker :value="formData.grade" :range="gradeList" @change="changeGrade">
					<view>{{ formData.grade || '请选择年级' }}</view>
				</picker>
<!-- 				<input
					class="input"
					v-model="formData.grade"
					placeholder="请输入年级"
				/> -->
			</view>
			<view class="form-item">
				<text class="label">身份证号</text>
				<input
					class="input"
					v-model="formData.idCard"
					placeholder="请输入身份证号"
					maxlength="18"
				/>
			</view>
			<view class="form-item">
				<text class="label">本人电话</text>
				<input
					class="input"
					v-model="formData.phone"
					placeholder="请输入本人电话"
					type="number"
					maxlength="11"
				/>
			</view>

			<view class="form-item">
				<text class="label">健康状况</text>
				<radio-group @change="onHealthChange">
					<label class="radio-item">
						<radio value="健康" :checked="formData.health === '健康'" />
						<text>健康</text>
					</label>
					<label class="radio-item">
						<radio value="需关注" :checked="formData.health === '需关注'" />
						<text>需关注</text>
					</label>
					<textarea
					v-if="formData.health === '需关注'"
						class="textarea"
						v-model="formData.healthText"
						placeholder="请输入需要关注问题"
						maxlength="200"
					/>
				</radio-group>
			</view>
			<view class="form-item">
				<text class="label">过敏史或忌口</text>
				<textarea
					class="textarea"
					v-model="formData.allergy"
					placeholder="请输入过敏史或忌口信息"
					maxlength="200"
				/>
			</view>
			<view class="form-item">
				<text class="label">监护人姓名</text>
				<input
					class="input"
					v-model="formData.emergencyContact"
					placeholder="请输入监护人姓名"
				/>
			</view>
			<view class="form-item">
				<text class="label">监护人电话</text>
				<input
					class="input"
					v-model="formData.emergencyPhone"
					placeholder="请输入监护人电话"
					type="number"
					maxlength="11"
				/>
			</view>
		</view>

		<!-- 保存按钮 -->
		<view class="save-section">
			<button class="save-btn" @click="handleSave">提交订单</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const mode = ref('add') // add 或 edit
const editIndex = ref(-1)
const gradeList = ref(['1年级（小学）', '2年级（小学）', '3年级（小学）',
						'4年级（小学）', '5年级（小学）', '6年级（小学）',
						'7年级（初中）', '8年级（初中）', '9年级（初中）',
						'10年级（高中）', '11年级（高中）', '12年级（高中）'
					])
const schoolList = ref([])
const formData = ref({
	name: '',
	age: '',
	gender: '男',
	school: '',
	grade: '',
	idCard: '',
	phone: '',
	allergy: '',
	health: '健康',
	healthText:'',
	emergencyContact: '',
	emergencyPhone: ''
})

onLoad((options) => {
	if (options.mode) {
		mode.value = options.mode
	}
	
	if (mode.value === 'edit' && options.index !== undefined) {
		editIndex.value = parseInt(options.index)
		loadChildrenData()
	}
	
	// 设置导航栏标题
	uni.setNavigationBarTitle({
		title: mode.value === 'add' ? '申请报名' : '编辑孩子信息'
	})
})
const changeGrade = (e) => {
	formData.value.grade = gradeList.value[e.detail.value]
}
const changeShool = (e) => {
	formData.value.school = schoolList.value[e.detail.value]
}
const loadChildrenData = () => {
	const stored = uni.getStorageSync('childrenList')
	if (stored) {
		const list = JSON.parse(stored)
		if (list[editIndex.value]) {
			formData.value = list[editIndex.value]
		}
	}
}

const onGenderChange = (e) => {
	formData.value.gender = e.detail.value
}

const onHealthChange = (e) => {
	formData.value.health = e.detail.value
}

const handleSave = async () => {
	// 表单验证
	if (!formData.value.name) {
		uni.showToast({ title: '请输入姓名', icon: 'none' })
		return
	}
	if (!formData.value.age) {
		uni.showToast({ title: '请输入年龄', icon: 'none' })
		return
	}
	if (!formData.value.gender) {
		uni.showToast({ title: '请选择性别', icon: 'none' })
		return
	}
	if (!formData.value.school) {
		uni.showToast({ title: '请输入学校', icon: 'none' })
		return
	}
	if (!formData.value.grade) {
		uni.showToast({ title: '请输入年级', icon: 'none' })
		return
	}
	if (!formData.value.idCard) {
		uni.showToast({ title: '请输入身份证号', icon: 'none' })
		return
	}
	if (!formData.value.phone) {
		uni.showToast({ title: '请输入本人电话', icon: 'none' })
		return
	}
	if (!formData.value.allergy) {
		uni.showToast({ title: '请输入过敏史或忌口', icon: 'none' })
		return
	}
	if (!formData.value.health) {
		uni.showToast({ title: '请选择健康状况', icon: 'none' })
		return
	}
	if (!formData.value.emergencyContact) {
		uni.showToast({ title: '请输入紧急联系人', icon: 'none' })
		return
	}
	if (!formData.value.emergencyPhone) {
		uni.showToast({ title: '请输入紧急联系人电话', icon: 'none' })
		return
	}

	try {
		// 1. 先创建订单，获取支付参数
		const paymentParams = await createOrder();

		// 2. 调用微信支付
		await requestPayment(paymentParams);

		// 3. 支付成功后才保存数据
		const stored = uni.getStorageSync('childrenList')
		let list = stored ? JSON.parse(stored) : []

		if (mode.value === 'add') {
			list.push({ ...formData.value })
		} else {
			list[editIndex.value] = { ...formData.value }
		}

		uni.setStorageSync('childrenList', JSON.stringify(list))

		uni.showToast({
			title: '支付成功',
			icon: 'success',
			success: () => {
				setTimeout(() => {
					uni.navigateBack()
				}, 500)
			}
		})

	} catch (err) {
		console.error('支付失败或取消:', err);
		if (err.errMsg && err.errMsg.includes('cancel')) {
			uni.showToast({
				title: '已取消支付',
				icon: 'none'
			});
		} else {
			uni.showToast({
				title: '支付失败',
				icon: 'error'
			});
		}
	}
};

// 创建订单，获取支付参数
const createOrder = () => {
	return new Promise((resolve, reject) => {
		// TODO: 调用后端接口创建订单
		// 示例：
		// uni.request({
		//   url: 'https://your-api.com/api/order/create',
		//   method: 'POST',
		//   data: {
		//     childInfo: formData.value,
		//     amount: 2890,
		//     // ... 其他订单信息
		//   },
		//   success: (res) => {
		//     resolve(res.data.paymentParams);
		//   },
		//   fail: (err) => {
		//     reject(err);
		//   }
		// });

		// 模拟后端返回的支付参数
		resolve({
			timeStamp: String(Date.now()),
			nonceStr: 'nonceStr123456',
			package: 'prepay_id=wx20240413123456789',
			signType: 'MD5',
			paySign: 'paySign123456'
		});
	});
};

// 调用微信支付
const requestPayment = (paymentParams) => {
	return new Promise((resolve, reject) => {
		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: paymentParams.timeStamp,
			nonceStr: paymentParams.nonceStr,
			package: paymentParams.package,
			signType: paymentParams.signType,
			paySign: paymentParams.paySign,
			success: (res) => {
				resolve(res);
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
};
</script>

<style scoped>
.children-edit-container {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 120rpx;
}

.form-section {
	background-color: #ffffff;
	margin-top: 20rpx;
}

.form-item {
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.form-item:last-child {
	border-bottom: none;
}

.label {
	font-size: 30rpx;
	color: #333333;
	margin-bottom: 15rpx;
	display: block;
}

.input {
	font-size: 30rpx;
	color: #333333;
	padding: 10rpx 0;
}

.textarea {
	width: 100%;
	height: 150rpx;
	font-size: 30rpx;
	color: #333333;
	padding: 10rpx 0;
}

.textarea::placeholder {
	color: #cccccc;
}

.radio-item {
	display: inline-flex;
	align-items: center;
	margin-right: 40rpx;
	font-size: 28rpx;
	color: #333333;
}

.save-section {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 20rpx 40rpx;
	background-color: #ffffff;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.save-btn {
	background: #FF9933;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 12rpx;
	border: none;
}

.save-btn::after {
	border: none;
}
</style>
