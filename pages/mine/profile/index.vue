<template>
	<view class="profile-container">
		<!-- 用户基本信息 -->
		<view class="profile-header">
			<view class="avatar-wrapper">
				<changeImage :model-value="userInfo.userImage" :user-info="userInfo" @choose="chooseAvatar">
				</changeImage>
				<view class="avatar-tip">点击更换</view>
			</view>
		</view>

		<!-- 表单信息 -->
		<view class="form-section">
			<view class="form-item" @click="chooseNickname">
				<text class="label">昵称</text>
				<view class="value-wrapper">
					<text class="value">{{ userInfo.nickname || '点击设置' }}</text>
					<text class="arrow">›</text>
				</view>
			</view>
			<view class="form-item">
				<text class="label">手机号</text>
				<input class="input" v-model="userInfo.tel" placeholder="请输入手机号" type="number" @blur="saveUserInfo" />
			</view>
			<view class="privacy-tip">仅用于项目管理、活动安排及教育交流等用途,确认即同意</view>
			<view class="form-item">
				<text class="label">就读学校</text>
				<picker :value="userInfo.school" :range="schoolList" @change="changeShool">
					<view>{{ userInfo.school || '请选择学校' }}</view>
				</picker>
				<!-- <input class="input" v-model="userInfo.school" placeholder="请输入学校" @blur="saveUserInfo" /> -->
			</view>
			<view class="form-item">
				<text class="label">年级</text>
				<picker :value="userInfo.grade" :range="gradeList" @change="changeGrade">
					<view>{{ userInfo.grade || '请选择年级' }}</view>
				</picker>
				<!-- 				<input
					class="input"
					v-model="userInfo.grade"
					placeholder="请输入年级"
					@blur="saveUserInfo"
				/> -->
			</view>
			<view class="form-item">
				<text class="label">班级</text>
				<!-- <input class="input" v-model="userInfo.calssRoom" placeholder="请输入班级" @blur="saveUserInfo" /> -->
				<picker :value="userInfo.calssRoom" :range="calssRoomList" @change="changeCalssRoom">
					<view>{{ userInfo.calssRoom || '请选择班级' }}</view>
				</picker>
			</view>
		</view>


		<!-- 孩子信息管理 -->
		<!-- 孩子信息功能已隐藏
		<view class="children-section">
			<view class="section-header">
				<text class="section-title">孩子信息</text>
				<button class="add-btn" size="mini" @click="goToAddChildren">+ 添加</button>
			</view>

			<view v-if="childrenList.length === 0" class="empty-children">
				<text class="empty-text">暂无孩子信息，点击上方添加</text>
			</view>

			<view v-else class="children-list">
				<view
					v-for="(child, index) in childrenList"
					:key="index"
					class="children-item"
					@click="goToEditChildren(index)"
				>
					<view class="children-info">
						<text class="children-name">{{ child.name }}</text>
						<text class="children-age">年龄: {{ child.age }}岁</text>
						<text class="children-gender">性别: {{ child.gender }}</text>
					</view>
					<view class="children-actions">
						<button class="edit-btn" size="mini" @click.stop="goToEditChildren(index)">编辑</button>
						<button class="delete-btn" size="mini" @click.stop="deleteChildren(index)">删除</button>
					</view>
				</view>
			</view>
		</view>
		-->
		<button style="width: 50%;margin-top: 20px;background-color: #FF9933;color: white;border-radius: 5px;"
			@click="saveBtn">确定</button>

	</view>
</template>

<script setup>
import changeImage from '../../../utils/changeImage.vue'
import {
	ref,
	onMounted
} from 'vue'
import {
	onLoad
} from '@dcloudio/uni-app'
import {
	updateUserInfo,
	getSchoolList
} from '../../../api/user'
import SearchSelect from '../../../utils/SearchSelect.vue'
const userInfo = ref({
	userImage: '',
	nickname: '',
	tel: '',
	school: '',
	grade: '',
	calssRoom: ''
})
const gradeList = ref(['1年级（小学）', '2年级（小学）', '3年级（小学）',
	'4年级（小学）', '5年级（小学）', '6年级（小学）',
	'7年级（初中）', '8年级（初中）', '9年级（初中）',
	'10年级（高中）', '11年级（高中）', '12年级（高中）'
])
const calssRoomList = ref([
	'1班', '2班', '3班', '4班', '5班',
	'6班', '7班', '8班', '9班', '10班',
	'11班', '12班', '13班', '14班', '15班',
	'16班', '17班', '18班', '19班', '20班',
	'21班', '22班', '23班', '24班', '25班',
	'26班', '27班', '28班', '29班', '30班',
	'31班', '32班', '33班', '34班', '35班',
	'36班', '37班', '38班', '39班', '40班',
	'41班', '42班', '43班', '44班', '45班',
	'46班', '47班', '48班', '49班', '50班'
])
const gradeMap = {
	'1年级（小学）': 1,
	'2年级（小学）': 2,
	'3年级（小学）': 3,
	'4年级（小学）': 4,
	'5年级（小学）': 5,
	'6年级（小学）': 6,
	'7年级（初中）': 7,
	'8年级（初中）': 8,
	'9年级（初中）': 9,
	'10年级（高中）': 10,
	'11年级（高中）': 11,
	'12年级（高中）': 12
}
const schoolList = ref([])
const childrenList = ref([])
const isLogin = ref(false)
const courseId = ref('')
onLoad((option) => {
	console.log(option);
	if (option?.type === 'login') {
		isLogin.value = true
	} else {
		isLogin.value = false
	}
	if (option?.courseId) {
		courseId.value = option.courseId
	}
	loadUserInfo()
	loadChildrenList()
	getListSchool()
})

onMounted(() => {
	loadUserInfo()
	loadChildrenList()
})
const schoolIdMap = ref({})
const getListSchool = async () => {
	try {
		const res = await getSchoolList()
		const schoolNames = res.list.map(school => school.name)
		schoolList.value = schoolNames
		schoolIdMap.value = res.list.reduce((acc, school) => {
			acc[school.name] = school.id;
			return acc;
		}, {});
		console.log(schoolIdMap);

	} catch (err) {
		console.log(err);
	}
}

const saveBtn = async () => {
	if (!userInfo.value.nickname) {
		uni.showToast({ title: '请设置昵称', icon: 'none' })
		return
	}
	if (!userInfo.value.tel) {
		uni.showToast({ title: '请输入手机号', icon: 'none' })
		return
	}
	if (!/^1[3-9]\d{9}$/.test(userInfo.value.tel)) {
		uni.showToast({ title: '手机号格式错误', icon: 'none' })
		return
	}
	if (!userInfo.value.school) {
		uni.showToast({ title: '请选择学校', icon: 'none' })
		return
	}
	if (!userInfo.value.grade) {
		uni.showToast({ title: '请选择年级', icon: 'none' })
		return
	}
	if (!userInfo.value.calssRoom) {
		uni.showToast({ title: '请选择班级', icon: 'none' })
		return
	}

	const gradeVal = gradeMap[userInfo.value.grade] || ''
	const schoolVal = schoolIdMap.value[userInfo.value.school] || ''
	const submitData = {
		...userInfo.value,
		grade: gradeVal,
		school: schoolVal
	}
	updateUserInfoMethod(submitData)
};

const updateUserInfoMethod = async (submitData) => {
	try {
		const res = await updateUserInfo(submitData)
		console.log('后端返回的数据:', res);

		uni.showToast({
			title: isLogin.value ? '登录成功' : '更新成功！',
			icon: 'success'
		});
		uni.setStorageSync('userInfo', userInfo.value);
		// 5. 跳转页面或刷新数据
		setTimeout(() => {
			if (courseId.value) {
				uni.redirectTo({
					url: `/pages/mine/profile/children-edit?mode=add&courseId=${courseId.value}`
				})
			} else {
				uni.switchTab({
					url: '/pages/mine/mine'
				});
			}

		}, 1000);

	} catch (err) {
		console.error('更新过程发生错误:', err);
		uni.showToast({
			title: isLogin.value ? '登录失败' : '更新失败',
			icon: 'none'
		});
	}
}
const loadUserInfo = () => {
	const storedUserInfo = uni.getStorageSync('userInfo')
	if (storedUserInfo) {
		userInfo.value = storedUserInfo
	}
}

const loadChildrenList = () => {
	const stored = uni.getStorageSync('childrenList')
	if (stored) {
		childrenList.value = JSON.parse(stored)
	}
}

const saveUserInfo = () => {
	if (userInfo.value.tel !== '' && userInfo.value.tel.length !== 11 && !/^1[3-9]\d{9}$/.test(userInfo.value
		.tel)) {
		// 提示手机格式
		uni.showToast({
			title: '手机号格式错误',
			icon: 'none'
		})
		return
	}
	uni.setStorageSync('userInfo', userInfo.value)
}

const chooseAvatar = async (path) => {
	userInfo.value.userImage = path;
	const token = uni.getStorageSync('token')
	try {
		const uploadRes = await new Promise((resolve, reject) => {
			uni.uploadFile({
				url: 'https://api.schoolbridge.com.cn/api/upload',
				// url: 'http://192.168.1.238:3000/api/upload',
				filePath: path,
				name: 'file',
				header: {
					'Authorization': 'Bearer ' + token
				},
				success: (res) => {
					const data = JSON.parse(res.data);
					console.log('永久头像地址:', data.url);
				}
			});
		});

		userInfo.value.userImage = uploadRes.url;
	} catch (err) {
		userInfo.value.userImage = path;
		uni.showToast({
			title: '上传失败',
			icon: 'none'
		});
	}


	uni.setStorageSync('userInfo', userInfo.value);
}

const chooseNickname = () => {
	// 弹出输入框让用户修改昵称
	uni.showModal({
		title: '修改昵称',
		content: userInfo.value.nickname || '',
		editable: true,
		success: (res) => {
			if (res.confirm && res.content) {
				userInfo.value.nickname = res.content
				saveUserInfo()
				uni.showToast({
					title: '昵称已更新',
					icon: 'success'
				})
			}
		}
	})
}
const changeGrade = (e) => {
	userInfo.value.grade = gradeList.value[e.detail.value]
	saveUserInfo()
}
const changeCalssRoom = (e) => {
	userInfo.value.calssRoom = calssRoomList.value[e.detail.value]
	saveUserInfo()
}
const changeShool = (e) => {
	userInfo.value.school = schoolList.value[e.detail.value]
	saveUserInfo()
}
const goToAddChildren = () => {
	uni.navigateTo({
		url: '/pages/mine/profile/children-edit?mode=add'
	})
}

const goToEditChildren = (index) => {
	uni.navigateTo({
		url: `/pages/mine/profile/children-edit?mode=edit&index=${index}`
	})
}

const deleteChildren = (index) => {
	uni.showModal({
		title: '提示',
		content: '确定要删除这个孩子信息吗?',
		success: (res) => {
			if (res.confirm) {
				childrenList.value.splice(index, 1)
				uni.setStorageSync('childrenList', JSON.stringify(childrenList.value))
				uni.showToast({
					title: '删除成功',
					icon: 'success'
				})
			}
		}
	})
}
</script>

<style scoped>
.profile-container {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.profile-header {
	background: linear-gradient(135deg, #FF9933 0%, #FFB366 100%);
	padding: 60rpx 40rpx;
	display: flex;
	justify-content: center;
}

.avatar-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 50%;
	border: 6rpx solid rgba(255, 255, 255, 0.5);
	background-color: #fff;
}

.avatar-tip {
	font-size: 22rpx;
	color: rgba(255, 255, 255, 0.8);
	margin-top: 15rpx;
}

.form-section {
	background-color: #ffffff;
	margin-top: 20rpx;
}

.form-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 30rpx 40rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.privacy-tip {
	font-size: 24rpx;
	color: #999;
	padding: 10rpx 40rpx 20rpx;
	background-color: #ffffff;
}

.form-item:last-child {
	border-bottom: none;
}

.label {
	font-size: 30rpx;
	color: #333333;
	min-width: 120rpx;
}

.input {
	flex: 1;
	font-size: 30rpx;
	color: #333333;
	text-align: right;
}

.value-wrapper {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}

.value {
	font-size: 30rpx;
	color: #333333;
	text-align: right;
}

.arrow {
	font-size: 36rpx;
	color: #999999;
	margin-left: 10rpx;
}

.children-section {
	background-color: #ffffff;
	margin-top: 20rpx;
	padding: 30rpx 40rpx;
}

.section-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.section-title {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
}

.add-btn {
	background-color: #667eea;
	color: #ffffff;
	font-size: 24rpx;
	border-radius: 8rpx;
	border: none;
}

.add-btn::after {
	border: none;
}

.empty-children {
	display: flex;
	justify-content: center;
	padding: 60rpx 0;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}

.children-list {
	display: flex;
	flex-direction: column;
}

.children-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	background-color: #f9f9f9;
	border-radius: 12rpx;
	margin-bottom: 20rpx;
}

.children-info {
	flex: 1;
	display: flex;
	flex-direction: column;
}

.children-name {
	font-size: 30rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 10rpx;
}

.children-age,
.children-gender {
	font-size: 24rpx;
	color: #666666;
	margin-bottom: 5rpx;
}

.children-actions {
	display: flex;
	gap: 10rpx;
}

.edit-btn {
	background-color: #667eea;
	color: #ffffff;
	font-size: 24rpx;
	border-radius: 8rpx;
	border: none;
}

.edit-btn::after {
	border: none;
}

.delete-btn {
	background-color: #ff4d4f;
	color: #ffffff;
	font-size: 24rpx;
	border-radius: 8rpx;
	border: none;
}

.delete-btn::after {
	border: none;
}
</style>