<template>
    <div id="app">
        <el-scrollbar wrap-class="scrollbar-wrapper" style="height:100vh;">
            <router-view/>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'App',
    metaInfo() {
        // return {
        //     title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
        //     titleTemplate: title => {
        //         return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
        //     }
        // }
    }
}
</script>
<style lang="scss">
/* element滚动条组件 隐藏水平滚动条 */
//#app .el-scrollbar__wrap {
//    overflow-x: hidden;
//}
</style>
