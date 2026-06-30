<template>
	<web-view :src="url"></web-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const url = ref('')

onLoad((options) => {
	if (options.url) {
		url.value = decodeURIComponent(options.url)
		console.log(url.value);
		
	}
})
</script>

<style scoped>
.news-detail-container {
	width: 100%;
	height: 100vh;
	overflow: hidden;
}
</style>
