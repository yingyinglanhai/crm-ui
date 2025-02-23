<template>
<!--    shadow	设置阴影显示时机	string	always / hover / never	always-->
    <el-card shadow="never">
        <slot></slot>
    </el-card>
</template>

<script>
export default {
    name: 'TableCard',
    props: {
        header: {},
        bodyStyle: {},
        shadow: {
            type: String
        }
    }
};
</script>
