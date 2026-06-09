<template>
    <view class="search-select-container">
        <!-- 输入框区域 -->
        <view class="input-box" @click="openDropdown">
            <input class="uni-input" placeholder="请输入关键字搜索" v-model="keyword" @input="onInput" @focus="openDropdown"
                :disabled="disabled" />
            <!-- 清除按钮 -->
            <text v-if="keyword" class="clear-icon" @click.stop="clearSelection">×</text>
        </view>

        <!-- 下拉列表区域 -->
        <view class="dropdown-list" v-if="showList && listData.length > 0">
            <scroll-view scroll-y class="scroll-view">
                <view class="list-item" v-for="(item, index) in listData" :key="item.id" @click="selectItem(item)">
                    {{ item.name }}
                </view>
            </scroll-view>
        </view>

        <!-- 无数据提示 -->
        <view class="empty-text" v-if="showList && listData.length === 0 && !loading && keyword">
            暂无匹配数据
        </view>

        <!-- 加载提示 -->
        <view class="loading-text" v-if="loading">
            搜索中...
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue';
import {
    getSchoolList
} from '../api/user'

// 定义 Props
const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
});

// 定义 Emits
const emit = defineEmits(['change']);

// 响应式数据
const state = reactive({
    keyword: '',       // 搜索关键词
    showList: false,   // 是否显示下拉列表
    listData: [],      // 下拉列表数据
    loading: false,    // 加载状态
    timer: null        // 防抖定时器
});

const { keyword, showList, listData, loading } = toRefs(state);

/**
 * 输入框内容变化处理
 */
const onInput = (e) => {
    const val = e.detail.value;

    // 1. 如果输入框为空，不请求接口，直接隐藏列表
    // if (!val || val.trim() === '') {
    // 	state.showList = false;
    // 	state.listData = [];
    // 	if (state.timer) clearTimeout(state.timer); // 清除未执行的请求
    // 	return;
    // }

    // 2. 显示列表，准备搜索
    state.showList = true;

    // 3. 防抖处理
    if (state.timer) clearTimeout(state.timer);

    state.loading = true;

    // 延迟 500ms 执行请求
    state.timer = setTimeout(() => {
        fetchRemoteData(val);
    }, 500);
};

/**
 * 远程 API 请求
 */
const fetchRemoteData = async (key) => {

    const res = await getSchoolList({ keyword: key });
    console.log(res);
    state.listData = res.list; 
    state.loading = false;

};

/**
 * 选中某一项
 */
const selectItem = (item) => {
    state.keyword = item.name; // 输入框回填 name
    state.showList = false;    // 收起下拉框
    state.listData = [];       // 清空列表（可选，防止下次打开残留）

    // 向父组件传递选中的 id
    emit('change', item.id);
};

/**
 * 打开下拉框
 */
const openDropdown = () => {
    // 只有当有关键词且有数据时才打开，或者你可以改为打开时自动触发一次搜索
    if (state.keyword && state.listData.length > 0) {
        state.showList = true;
    }
};

/**
 * 清空选择
 */
const clearSelection = () => {
    state.keyword = '';
    state.listData = [];
    state.showList = false;
    emit('change', ''); // 传递空值
};
</script>

<style lang="scss" scoped>
.search-select-container {
    position: relative;
    width: 100%;
}

.input-box {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px;
    background-color: #fff;
}

.clear-icon {
    position: absolute;
    right: 10px;
    font-size: 20px;
    color: #999;
    padding: 0 5px;
}

/* 下拉列表样式 */
.dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    max-height: 200px;
    background-color: #fff;
    border: 1px solid #eee;
    border-top: none;
    z-index: 999;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 0 0 4px 4px;
}

.scroll-view {
    height: 100%;
}

.list-item {
    padding: 12px 15px;
    border-bottom: 1px solid #f5f5f5;
    font-size: 14px;
    color: #333;
}

.list-item:active {
    background-color: #f0f0f0;
}

.empty-text,
.loading-text {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 10px;
    background: #fff;
    font-size: 12px;
    color: #999;
    border: 1px solid #eee;
    border-top: none;
    z-index: 998;
}
</style>