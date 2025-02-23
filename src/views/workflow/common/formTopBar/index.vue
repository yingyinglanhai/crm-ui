<template>
    <div>
        <el-row :gutter="10" type="flex" justify="space-around">
            <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-badge :value="attachmentCount" class="item">
                    <el-button type="primary" plain icon="el-icon-s-order" size="mini" @click="openSysAttachmentDialog">附件</el-button>
                </el-badge>
                <!--  传readonly优先使用readonly，如果没传，有流程实例id的时候不可编辑              -->
                <CcedButton :billType="billType" :businessId="businessId"
                            :readonly="util.isEmpty(readonly) ? (!util.isEmpty(flowInsId))  :  (readonly=='1')">
                </CcedButton>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" class="formTitle">{{ title }}</el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" style="text-align: right;padding-right: 20px;">
                <el-button type="primary" v-if="util.isEmpty(readonly) ? (util.isEmpty(taskId) && util.isEmpty(flowInsId))  :  !(readonly=='1') " plain icon="el-icon-check" size="mini" @click="submitForm('0')">保存</el-button>
                <el-button type="primary" v-if="!util.isEmpty(taskId)" plain icon="el-icon-check" size="mini" @click="commitTask()">同意</el-button>
                <el-button type="warning" v-if="!util.isEmpty(taskId)" plain icon="el-icon-close" size="mini" @click="reject()">驳回</el-button>
                <el-button type="primary" v-if="!util.isEmpty(flowInsId)" plain icon="el-icon-check" size="mini" @click="showFlowInfoDialog()">流程信息</el-button>
            </el-col>
        </el-row>

        <!--    流程信息    -->
        <FlowInfo :businessId="businessId+''" :billType="billType" v-if="showFlowInfo" :showStatus="showFlowInfo" @closeFlowInfoDialog="closeFlowInfoDialog"></FlowInfo>
        <!--   办理任务弹窗     -->
        <ConfirmCommitTask :taskId="taskId" :insId="flowInsId" @closeCommitDialog="closeCommitDialog" :commitType="commitType" :showStatus="showCommitDialog"></ConfirmCommitTask>
        <!--   单据附件弹窗     -->
        <FormAttachment :businessId="businessId" :billType="billType" v-if="showSysAttachmentDialog" :showStatus="showSysAttachmentDialog"
                        :readonly="util.isEmpty(readonly) ? (!(util.isEmpty(taskId) && util.isEmpty(flowInsId)))  :  (readonly=='1')"
                        @closeSysAttachmentDialog="closeSysAttachmentDialog"></FormAttachment>
    </div>
</template>
<script>
import FlowInfo from "@/views/workflow/flow/flowInfo";
import FormAttachment from "@/views/common/sysAttachment/formAttachment"
import ConfirmCommitTask from "@/views/workflow/ConfirmCommitTask";
import CcedButton from "@/views/workflow/common/ccedButton";
import {countSysAttachement} from "@/api/common/sysAttachment"
export default {
    name: "formTopBar",
    components:{FlowInfo,FormAttachment,ConfirmCommitTask,CcedButton},
    props: {
        title:"",
        taskId:"",
        flowInsId: "",
        billType: "",
        businessId:"",
        readonly:""
    },
    data() {
        return {
            commitType:"",
            showCommitDialog:false,
            showSysAttachmentDialog:false,
            showFlowInfo:false,
            openBusAttachmentDialog:false,
            attachmentCount:0
        }
    },
    created() {
        console.log("顶部按钮条参数：",
            "标题："+this.title+"。",
            "taskId："+this.taskId+"。",
            "flowInsId："+this.flowInsId+"。",
            "billType："+this.billType+"。",
            "businessId："+this.businessId+"。",
            "readonly："+this.readonly+"。");
        console.log("判读readonly：",this.util.isEmpty(this.readonly) ? (!this.util.isEmpty(this.flowInsId))  :  (this.readonly=='1'))
        console.log("判断readonly：",!this.util.isEmpty(this.flowInsId));
    },
    updated() {
        this.getSysAttachementCount();
    },
    watch: {
        billType: function (newVal, oldVal) {
            if(newVal!=oldVal){
                console.log("顶部按钮条："+this.billType+","+this.taskId+","+this.flowInsId+","+this.businessId);
                this.getSysAttachementCount();
                // this.$forceUpdate();
            }
        }
    },
    methods:{
        // 计算附件数量
        getSysAttachementCount(){
            let queryParams={
                billType:this.billType,
                businessId:this.businessId
            }
            console.log("查询附件数量="+JSON.stringify(queryParams));
            countSysAttachement(queryParams).then(res=>{
                if(200 == res.code){
                    this.attachmentCount = res.data;
                }
            })
        },
        //根据实例获取流程图片--打开流程信息
        showFlowInfoDialog(){
            this.showFlowInfo = true;
        },
        //关闭流程信息窗口
        closeFlowInfoDialog(){
            this.showFlowInfo = false;
        },
        //提交审批
        commitTask(){
            this.commitType = "agree";
            this.showCommitDialog = true;
        },
        //驳回申请
        reject(){
            this.commitType = "reject";
            this.showCommitDialog = true;
        },
        //关闭完成任务弹窗
        closeCommitDialog(){
            this.showCommitDialog = false;
        },
        //打开附件窗口
        openSysAttachmentDialog(){
            if(!this.businessId){
                this.$modal.msgError("请先【保存】单据！再进行附件上传！");
                return;
            }
            this.showSysAttachmentDialog = true;
        },
        //关闭附件窗口
        closeSysAttachmentDialog(){
            this.showSysAttachmentDialog = false;
        },
        //保存
        submitForm(){
            this.$emit("submitForm");
        }
    }
}
</script>
