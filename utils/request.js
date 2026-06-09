class Request {
	constructor() {
		// 建议：将域名提取到环境变量或单独的配置文件中
		this.baseURL = 'https://api.schoolbridge.com.cn/api';
		// this.baseURL = 'http://192.168.1.238:3000/api'; 
		// this.timeout = 10000; 
	}

	// 核心请求方法
	request(options) {
		return new Promise((resolve, reject) => {
			// 1. 处理 URL 拼接 (修复核心 Bug)
			// 如果 options.url 包含 http，则不拼接，否则拼接 baseURL
			let finalUrl = options.url;
			if (!options.url.startsWith('http') && !options.url.startsWith('http://') && !options.url
				.startsWith('https://')) {
				finalUrl = this.baseURL + options.url;
			}

			// 2. 处理请求头
			const header = {
				'Content-Type': 'application/json',
				...options.header
			};

			// 3. 请求拦截：统一注入 Token
			const token = uni.getStorageSync('token');
			if (token) {
				header['Authorization'] = `Bearer ${token}`;
			}

			// 4. 发起请求
			uni.request({
				url: finalUrl, // 使用处理后的完整 URL
				method: options.method || 'GET',
				data: options.data || {}, // 确保 data 存在，避免报错
				header: header,
				timeout: options.timeout || this.timeout,

				success: (res) => {
					// 响应拦截：统一处理状态码
					this.handleResponse(res, resolve, reject);
				},
				fail: (err) => {
					console.error('网络请求失败:', err);
					uni.showToast({
						title: '网络连接失败',
						icon: 'none'
					});
					reject(err);
				}
			});
		});
	}

	// 统一处理响应
	handleResponse(res, resolve, reject) {
		const {
			statusCode,
			data
		} = res;
		// 这里可以根据后端规范调整
		// 假设后端返回 { code: 200, data: {}, msg: 'success' }

		if (statusCode === 201 || statusCode === 200) {
			// 如果后端业务码也是 200 或 0，直接 resolve data
			// 如果不确定后端格式，可以直接 resolve(res)，让调用层去解构
			resolve(data);
		} else if (statusCode === 401) {
			// 统一处理登录过期
			uni.showToast({
				title: '登录已过期',
				icon: 'none'
			});
			reject(res);
		} else {
			// HTTP 错误
			uni.showToast({
				title: `请求错误: ${statusCode}`,
				icon: 'none'
			});
			reject(res);
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