let isRedirecting = false

class Request {
	constructor() {
		this.baseURL = 'https://api.schoolbridge.com.cn/api';
	}

	request(options) {
		return new Promise((resolve, reject) => {
			let finalUrl = options.url
			if (!options.url.startsWith('http') && !options.url.startsWith('http://') && !options.url
				.startsWith('https://')) {
				finalUrl = this.baseURL + options.url
			}

			const header = {
				'Content-Type': 'application/json',
				...options.header
			}

			const token = uni.getStorageSync('token')
			if (token) {
				header['Authorization'] = `Bearer ${token}`
			}

			uni.request({
				url: finalUrl,
				method: options.method || 'GET',
				data: options.data || {},
				header: header,
				timeout: options.timeout || this.timeout,

				success: (res) => {
					this.handleResponse(res, resolve, reject)
				},
				fail: (err) => {
					console.error('网络请求失败:', err)
					uni.showToast({
						title: '网络连接失败',
						icon: 'none'
					})
					reject(err)
				}
			})
		})
	}

	handleResponse(res, resolve, reject) {
		const { statusCode, data } = res

		if (statusCode === 201 || statusCode === 200) {
			resolve(data)
		} else if (statusCode === 401) {
			uni.removeStorageSync('token')
			uni.removeStorageSync('userInfo')

			if (!isRedirecting) {
				isRedirecting = true
				uni.showToast({
					title: '登录已过期，请重新登录',
					icon: 'none',
					duration: 2000
				})
				setTimeout(() => {
					uni.switchTab({ url: '/pages/mine/mine' })
					isRedirecting = false
				}, 2000)
			}

			reject(res)
		} else {
			uni.showToast({
				title: `请求错误: ${statusCode}`,
				icon: 'none'
			})
			reject(res)
		}
	}

	// GET 请求优化
	get(url, data = {}, options = {}) {
		return this.request({
			url,
			method: 'GET',
			data, // uni.request 的 GET 参数放在 data 里，会自动拼接到 URL
			...options
		});
	}

	// POST 请求
	post(url, data = {}, options = {}) {
		return this.request({
			url,
			method: 'POST',
			data,
			...options
		});
	}

	put(url, data = {}, options = {}) {
		return this.request({
			url,
			method: 'PUT',
			data,
			...options
		});
	}

	delete(url, data = {}, options = {}) {
		return this.request({
			url,
			method: 'DELETE',
			data,
			...options
		});
	}
}

export default new Request();