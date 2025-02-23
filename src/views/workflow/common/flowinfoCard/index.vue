<template>
    <div class="flowInfoCard">
        <div class="left">
            <slot></slot>
        </div>
        <div class="right" v-if="$store.state.settings.flowInfoCard && !util.isEmpty(flowInsId)">
            <el-card style="margin: 15px 0px 15px 15px" v-if="!util.isEmpty(flowInsId)" >
                <div slot="header" class="clearfix">
                    <span style="padding-right: 10px">流程审批信息</span>
                    <el-tooltip content="eg:该卡片（单据中右侧展示流程信息的卡片），可通过[顶部头像处]-[布局设置]-[表单显示流程卡片]，开关功能控制是否显示该卡片" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                </div>
                <FlowInfoTimeLine :businessId="id" :billType="billType"></FlowInfoTimeLine>
            </el-card>
        </div>
    </div>
</template>

<script>
import FlowInfoTimeLine from "@/views/workflow/flow/flowinfoTimeLine";
export default {
    name: 'FlowInfoCard',
    components:{FlowInfoTimeLine},
    props: {
        id:"",
        flowInsId:"",
        billType:""
    },
    data(){
        return{
            flowInfoCard:this.$store.state.settings.flowInfoCard
        }
    },
    watch: {
        flowInsId(val) {
            console.log("流程表单卡片flowInsId:"+val)
        }
    },
    created() {
        console.log("单据是否展示流程卡片："+this.$store.state.settings.flowInfoCard)
        console.log("单据是否展示流程卡片："+this.flowInfoCard)
    }
};
</script>
<style lang="scss" scoped>
    .flowInfoCard{
        display: flex;
        .left{
            flex: 0.7;
            flex-grow: 1;
            width: 100%;
            overflow: scroll;
        }
        .right{
            flex: 0.3;
        }
    }
</style>
