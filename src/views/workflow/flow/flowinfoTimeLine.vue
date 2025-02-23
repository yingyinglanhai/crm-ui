<template>
    <div title="流程信息" :visible.sync="showStatus" class="flowinfoCard">
            <div style="padding: 5px;">
                <el-timeline>
                    <el-timeline-item :timestamp="parseTime(item.dueTime,'{y}-{m}-{d} {h}:{i}:{s}')" placement="top" v-for="item in hisList">
                        <el-card>
                            <div class="banner">
                                <span class="title">{{item.taskname}}</span>
                                <span v-if="item.completeStatus=='已完成'" class="label" style="background-color: #1ab394;">已完成</span>
                                <span v-if="item.completeStatus=='未审批'" class="label" style="background-color: #f56c6c;">未审批</span>
                            </div>
                            <p>{{ item.nickName }}</p>
                            <p v-if="!util.isEmpty(item.comment)">办理意见：{{item.comment}}</p>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
    </div>
</template>

<script>
import {getHisByBusinessId} from "@/api/workflow/myTask";
export default {
    name: "FlowInfoTimeLine",
    data() {
        return {
            hisList:[],
            flowImgBase64:"",
            flowImgBase642:""
        }
    },
    props: {
        businessId: "",
        billType: "",
        showStatus:true
    },
    created() {
        console.log("查看流程信息Card："+this.businessId);
        console.log("查看流程信息Card："+this.billType);
        this.getHisByBusinessId();
    },
    methods: {
        getHisByBusinessId(){
            if(this.businessId && this.billType){
                let data = {};
                data.businessId = this.businessId;
                data.billType = this.billType;
                getHisByBusinessId(data).then(res=>{
                    if(200==res.code){
                        console.log(res.data);
                        this.hisList = res.data;
                    }
                })
            }
        },
        beforeClose(){
            this.$emit('closeFlowInfoDialog');
        }
    }
}
</script>

<style  lang="scss"  scoped>
.formTitle{
    text-align: center;
    font-weight: 900;
    color: #606266;
    font-size: 20px;
}
.page-scroll{
    ::v-deep .el-scrollbar__wrap{
        overflow-x: hidden;  /* 隐藏横向的原生滚动条 */
    }
}

.flowinfoCard {
    .banner {
        border-bottom: 1px solid #eeeeee;
        line-height: 35px;
        .title {
            color: #409EFF;
        }
        .label {
            color: #FFFFFF;
            font-size: 12px;
            padding: 5px;
            border-radius: 2px;
            margin-left: 15px;
        }
    }
}
</style>
