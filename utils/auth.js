import { login } from '../api/user'

export function wechatLogin() {
  return new Promise(async (resolve, reject) => {
    try {
      const loginRes = await uni.login({ provider: 'weixin' })
      if (!loginRes.code) {
        uni.showToast({ title: '获取登录凭证失败', icon: 'none' })
        reject(new Error('Failed to get login code'))
        return
      }
      const res = await login({ code: loginRes.code })
      uni.setStorageSync('token', res.token)
      resolve(res)
    } catch (err) {
      console.error('登录过程发生错误:', err)
      uni.showToast({ title: '登录失败', icon: 'none' })
      reject(err)
    }
  })
}
