import { ref } from 'vue'

const showPrivacyPopup = ref(false)
let privacyResolve = null

export function setupPrivacy() {
  console.log('触发了新的');
  console.log(typeof wx !== 'undefined');
  console.log(wx.onNeedPrivacyAuthorization);
  console.log('------------');
  
  
  if (typeof wx !== 'undefined' && wx.onNeedPrivacyAuthorization) {
    wx.onNeedPrivacyAuthorization((resolve) => {
      console.log(resolve);
      
      privacyResolve = resolve
      showPrivacyPopup.value = true
    })
  }
}

export function handlePrivacyAgree() {
  showPrivacyPopup.value = false
}

export function handlePrivacyDisagree() {
  showPrivacyPopup.value = false
  if (privacyResolve) {
    privacyResolve({ event: 'disagree' })
    privacyResolve = null
  }
}

export function openPrivacyContract() {
  wx.openPrivacyContract({
    fail: () => {
      uni.showToast({ title: '打开隐私协议失败', icon: 'none' })
    }
  })
}

export { showPrivacyPopup }
