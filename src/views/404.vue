<template>
    <a-result status="404" title="404" sub-title="抱歉, 该页面不存在.">
        <template #extra>
            <a-button type="primary"  @click="$router.push('/welcome')">
                返回主页
            </a-button>
        </template>
    </a-result>
</template>
<script>
    export default {
        data() {
            return {};
        },
    };
</script>
