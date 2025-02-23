<template>
    <div class="building">
        <img class="bu" src="@/assets/images/building.png">
        <div class="des">建设中，开发小哥正在疯狂埋头苦干中。。。。。。</div>
        <div class="des">如需定制化。。。。。。</div>
        <el-button class="contactButton" type="primary" @click="contactUs">联系我们，加快进度~~ヽ(°◇° )ノ</el-button>
        <el-dialog :visible.sync="open" width="500px" append-to-body>
            <img class="author" src="@/assets/images/author.png" style="margin-left:60px;width: 350px;">
        </el-dialog>
    </div>
</template>
<script>

export default {
    name: "building",
    data() {
        return {
            open:false
        }
    },
    methods:{
        contactUs(){
            this.open = true;
        }
    }
}
</script>
<style scoped lang="scss">
    .building{
        padding-top: 50px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .bu{
            height: 300px;
            width: 300px;
        }
        .des{
            font-size: 30px;
            color: #36a3f7;
        }
        .contactButton{
            margin-top: 200px;
        }
    }
</style>
