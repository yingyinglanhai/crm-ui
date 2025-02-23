<template>
    <el-dialog title="流程信息" :visible.sync="showStatus" width="1200px" append-to-body :before-close="beforeClose">
        <div style="padding: 20px">
                <div>
                    <el-scrollbar class="page-scroll" style="height: 100%;">
                        <!--流程信息-->
                        <div style="padding: 0px 57px 0px 40px;">
                            <!--流程图-->
                            <div style="display: flex;justify-content: center;">
                                <el-image :src="'data:image/png;base64,'+flowImgBase64"></el-image>
                            </div>
    <!--                        <div style="display: flex;justify-content: center;">-->
    <!--                            <el-image :src="'data:image/png;base64,'+flowImgBase642"></el-image>-->
    <!--                        </div>-->
                            <el-divider content-position="left">流程审批信息</el-divider>
                            <div style="padding: 15px;">
                                <el-table  :border="Global.tableShowBorder" :data="hisList" >
                                    <el-table-column prop="taskname" label="任务名称" width="180" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="nickName" label="办理人" width="180" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="candidateName" label="候选人" width="200" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="comment" label="办理意见" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="dueTime" label="办理时间">
                                        <template slot-scope="scope">
                                            <span>{{ parseTime(scope.row.dueTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="completeStatus" label="是否完成" width="100"></el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
        </div>
    </el-dialog>
</template>

<script>
import {getDefImgByInsId,getFlowImgByInsId,getDefImgByBusinessId} from "@/api/workflow/flowImg";
import {getHisByBusinessId, getHisByInsId} from "@/api/workflow/myTask";
export default {
    name: "FlowInfo",
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
        showStatus:false
    },
    created() {
        console.log("查看流程信息："+this.businessId);
        console.log("查看流程信息："+this.billType);
        this.getDefImgByBusinessId();
        // this.getFlowImgByInsId(this.insId);
        this.getHisByBusinessId();
    },
    methods: {
        //根据实例获取流程图片
        getDefImgByBusinessId(){
            if(this.businessId && this.billType){
                let data = {};
                data.businessId = this.businessId;
                data.billType = this.billType;
                getDefImgByBusinessId(data).then(res=>{
                    if(200==res.code){
                        this.flowImgBase64 = res.data;
                    }
                })
            }
        },
        // getFlowImgByInsId(insId){
        //     if(insId){
        //         getFlowImgByInsId(insId).then(res=>{
        //             if(200==res.code){
        //                 // console.log(res.data);
        //                 this.flowImgBase642 = res.data;
        //             }
        //         })
        //     }
        // },
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
</style>
