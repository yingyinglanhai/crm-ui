<template>
        <el-dialog :visible.sync="showStatus" :title="title" width="800px" append-to-body :before-close="beforeClose" class="commitTask">
            <el-input v-model="comment" type="textarea" :placeholder="title" :rows="5" ></el-input>
            <div class="operateTypeContainer">
                <el-radio-group v-model="operateType" class="ot">
                    <el-radio v-for="t in operateTypeList" :key="t.value" :label="t.value">
                        {{ t.label }}
                        <el-tooltip :content="t.tip" placement="top-start">
                            <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                    </el-radio>
                </el-radio-group>
                <el-checkbox v-model="ifCced"  class="ot">
                    抄送
                    <el-tooltip content="抄送：同邮件的抄送功能，抄送至其他人，其他人可在【工作空间】内查询到抄送的单据信息" placement="top-start">
                        <i class="el-icon-warning-outline"></i>
                    </el-tooltip>
                </el-checkbox>
            </div>

            <div v-if="operateType=='1'" class="selectUser">
                <el-button type="text" icon="el-icon-edit" @click="selectTransUser">选择接收人</el-button>
                <el-table :border="Global.tableShowBorder" :data="transUserList" key="transTable">
                    <el-table-column label="帐号" align="center" prop="userName" width="150"/>
                    <el-table-column label="所属部门" align="center" prop="dept.deptName"/>
                    <el-table-column label="姓名" align="center" prop="nickName" width="180"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="delTransUser(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div v-if="operateType=='2'" class="selectUser">
                <el-button type="text" icon="el-icon-edit" @click="selectTransUser">选择受委托人</el-button>
                <el-table :border="Global.tableShowBorder" :data="delegateUserList" key="delegateTable">
                    <el-table-column label="帐号" align="center" prop="userName" width="150"/>
                    <el-table-column label="所属部门" align="center" prop="dept.deptName"/>
                    <el-table-column label="姓名" align="center" prop="nickName" width="180"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="delTransUser(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div v-if="ifCced" class="selectUser">
                <el-button type="text" icon="el-icon-edit" @click="selectCcedUser">选择抄送人</el-button>
                <el-table :border="Global.tableShowBorder" :data="ccedUserList">
                    <el-table-column label="帐号" align="center" prop="userName" width="150"/>
                    <el-table-column label="所属部门" align="center" prop="dept.deptName"/>
                    <el-table-column label="姓名" align="center" prop="nickName" width="180"/>
                    <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" icon="el-icon-delete" @click="delCcedUser(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>



            <el-dialog :visible.sync="showSelectOneUser" :title="showSelectOneUserTitle" width="1200px" append-to-body>
                <SelectOneUser @selectedOneUser="selectedOneUser" @closeSelectOneUser="closeSelectOneUser"></SelectOneUser>
            </el-dialog>

            <el-dialog :visible.sync="showSelectMulUser" title="选择抄送用户" width="1200px" append-to-body>
                <SelectMulUser v-if="showSelectMulUser" @selectedMulUser="selectedMulUser" @closeSelectMulUser="closeSelectMulUser"></SelectMulUser>
            </el-dialog>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doAgreeTask" v-show="operateBtn=='agree'">同 意</el-button>
                <el-button type="warning" @click="doRejectTask" v-show="operateBtn=='reject'">驳 回</el-button>
                <el-button @click="closeCommitDialog()">关 闭</el-button>
            </div>

        </el-dialog>
</template>

<script>
import {commitTask, rejectTask} from "@/api/workflow/myTask";

import SelectOneUser from "@/views/common/selectUser/selectOneUser"
import SelectMulUser from "@/views/common/selectUser/selectMulUser"
export default {
    name: 'ConfirmCommitTask',
    components:{SelectOneUser,SelectMulUser},
    props: {
        commitType:"",
        taskId:"",
        insId:"",
        showStatus:false,
    },
    data(){
        return {
            comment: "",
            operateBtn:"",
            title: "",
            operateType:"0",
            operateTypeList:[
                {label:"办理",value:"0",tip:"正常流程流转"},
                {label:"转办",value:"1",tip:"转办：将流程转交至转办人处办理，自己将无需办理"},
                {label:"委托",value:"2",tip:"委托：委托他人处理，将任务提交给其他人处理，其他人处理完毕后，流程将再次回归到本人处"}],
            ifCced:false,
            transUserList:[],
            delegateUserList:[],
            ccedUserList:[],
            //选择用户弹窗
            showSelectOneUser:false,
            showSelectOneUserTitle:"",
            showSelectMulUser:false,
        }
    },
    created(){
        this.reset();
    },

    mounted() {},
    methods:{
        reset(){
            this.comment = "";
            this.operateType="0";
            this.ifCced=false;
        },
        closeCommitDialog(){
            // this.showDialog = false;
            this.$emit('closeCommitDialog');
        },
        //同意
        doAgreeTask(){
            let task = {"taskId":this.taskId,"insId":this.insId,"comment":this.comment,"operateType":this.operateType}
            if(this.operateType=="1"){//转办
                if(!this.transUserList || !this.transUserList[0]){
                    this.$modal.msgError("请选择转办接收用户！");
                    return;
                }
                task.transUserId = this.transUserList[0].userId;
            }
            if(this.operateType=="2"){//委托
                if(!this.delegateUserList || !this.delegateUserList[0]){
                    this.$modal.msgError("请选择受委托用户！");
                    return;
                }
                task.delegateUserId = this.delegateUserList[0].userId;
            }
            if(this.ifCced){//有抄送
                if(!this.ccedUserList || this.ccedUserList.length<=0){
                    this.$modal.msgError("请选择抄送用户！");
                    return;
                }
                let ccedListArr = [];
                this.ccedUserList.forEach(item=>{
                    ccedListArr.push(item.userId);
                })
                task.ccedListStr = ccedListArr.join(",");
                task.ifCced = "1"
            }
            commitTask(task).then(res=>{
                if(200==res.code){
                    this.haveDoneTask = true;
                    this.$modal.msgSuccess("审批成功");
                    this.closeCommitDialog();
                    this.closeThisTab();
                }
            })
        },
        //驳回
        doRejectTask(){
            let task = {"taskId":this.taskId,"insId":this.insId,"comment":this.comment}
            rejectTask(task).then(res=>{
                if(200==res.code){
                    this.haveDoneTask = true;
                    this.$modal.msgSuccess("驳回成功");
                    this.closeCommitDialog();
                    this.closeThisTab();
                }
            })
        },
        //关闭当前tab页签，打开待办页签，并刷新
        closeThisTab(){
            this.$tab.closeOpenPage({ path: "/mySpace/myTask" });
        },
        beforeClose(){
            this.closeCommitDialog();
        },
        // changeOperateType(){
        //     console.log(this.transUserList)
        //     console.log(this.delegateUserList)
        //     this.transUserList = [];
        //     this.delegateUserList = [];
        // },
        delDelegateUser(){
            this.delegateUserList = [];
        },
        delTransUser(){
            this.transUserList = [];
        },
        delCcedUser(row){
            const arr = this.ccedUserList;
            this.ccedUserList = arr.filter(function (item) {
                return row.userId != item.userId;
            });
        },
        selectTransUser(){
            if(this.operateType=="1"){
                this.showSelectOneUserTitle = "选择转办人";
            }else if(this.operateType=="2"){
                this.showSelectOneUserTitle = "选择委托人";
            }
            this.showSelectOneUser = true;
        },
        selectCcedUser(){
            this.showSelectMulUser = true;
        },
        //选择完一条用户
        selectedOneUser(user){
            console.log("选择一条用户："+JSON.stringify(user))
            if(this.operateType=="1"){
                this.transUserList = [];
                this.transUserList.push(user);
            }
            if(this.operateType=="2"){
                this.delegateUserList = []
                this.delegateUserList.push(user);
            }
            this.showSelectOneUser = false;
        },
        // 关闭选择一个用户弹窗
        closeSelectOneUser(){
            this.showSelectOneUser = false;
        },

        //选择抄送用户
        selectedMulUser(users){
            console.log("选择一条用户："+JSON.stringify(users))
            this.ccedUserList = this.ccedUserList.concat(users);
            this.showSelectMulUser = false;
        },
        closeSelectMulUser(){
            this.showSelectMulUser = false;
        }
    },
    watch: {
        commitType: function (newVal, oldVal) {
            console.log("审批类型："+this.commitType);
            if("agree"==this.commitType){
                this.title="请填写审批意见";
                this.operateBtn = "agree";
            }else if("reject"==this.commitType){
                this.title="请填写驳回意见";
                this.operateBtn = "reject";
            }
        },
        showStatus: function(){
            this.reset();
        }
    },
};
</script>
<style scoped lang="scss">
    .commitTask{
        .operateTypeContainer{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            .ot{
                margin-top: 20px
            }
        }

        .selectUser{
            padding-top: 20px;
        }
    }





</style>
