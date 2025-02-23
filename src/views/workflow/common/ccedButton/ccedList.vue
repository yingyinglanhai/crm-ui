<template>
    <div class="ccedList">
        <el-dialog :visible.sync="showStatus" title="抄送列表" width="1000px" append-to-body :before-close="beforeClose" class="commitTask">

            <el-row :gutter="10" class="mb8" v-if="!readonly">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addCcedUser">
                        选择抄送人
                    </el-button>
                </el-col>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="ccedList">
                <el-table-column label="姓名" align="center" prop="toNickName" width="180"/>
                <el-table-column label="所属部门" align="center" prop="toDeptName"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="100">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="delCcedUser(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total"
                        :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                        @pagination="getList"/>
        </el-dialog>


        <el-dialog :visible.sync="showSelectMulUser" title="选择抄送用户" width="1200px" append-to-body>
            <SelectMulUser v-if="showSelectMulUser" @selectedMulUser="selectedMulUser" @closeSelectMulUser="closeSelectMulUser"></SelectMulUser>
        </el-dialog>
    </div>
</template>

<script>
import {listFlowCced} from "@/api/workflow/flowCced";
import SelectMulUser from "@/views/common/selectUser/selectMulUser"
export default {
    name: "CcedList",
    components:{SelectMulUser},
    props: {
        billType: "",
        businessId: "",
        readonly: false,
        showStatus:false
    },
    inject:["addCcedList"],
    data() {
        return {
            loading: false,
            ccedList: [],
            total: 0,
            showSelectMulUser:false,
            queryParams:{
                billType:"",
                businessId:"",
                pageNum: 1,
                pageSize: 10,
                orderByColumn: "createTime",
                isAsc: "descending",
            }
        }
    },
    created() {
        console.log("抄送人列表====："+this.billType+","+this.businessId);
        this.queryParams.billType = this.billType;
        //新增的时候，不能查出来
        if(this.businessId){
            this.queryParams.businessId = this.businessId;
        }else{
            this.queryParams.businessId = -1;
        }
        this.getList();
    },
    methods: {
        getList(){
            listFlowCced(this.queryParams).then(res=>{
                    let arr = res.rows;
                    this.ccedList = arr;
                    this.total = res.total;
                    this.loading = false;
                    // 给父组件回填抄送人信息
                    this.$emit("setCount",this.total);
            })
        },
        beforeClose(){
            this.$emit('closeCcedListDialog');
        },
        //添加抄送人员
        addCcedUser(){
            this.showSelectMulUser = true;
        },
        //删除抄送人员
        delCcedUser(row){
            const arr = this.ccedList;
            this.ccedList = arr.filter(function (item) {
                return row.toUserId != item.toUserId;
            });
            // 给父组件回填抄送人信息
            this.$emit("setCount",this.ccedList.length);
            this.addCcedList(this.ccedList);
        },
        //格式化数据
        formatCcedList(arr){
            let list = [];
            arr.forEach(item=>{
                let i = {};
                i.billType = this.billType;
                i.toUserId = item.userId;
                // i.userId = item.userId;
                i.toNickName = item.nickName;
                i.toDeptName = item.dept.deptName;
                // i.userName = item.userName;
                list.push(i)
            })
            return list;
        },
        //选择抄送用户
        selectedMulUser(users){
            debugger
            let notSameArr = [];
            //检查有没有选过
            users.forEach(i=>{
                let have = false;
                this.ccedList.forEach(j=>{
                    if(j.toUserId == i.userId){
                        have = true;
                    }
                })
                //如果没选过
                if(!have){
                    notSameArr.push(i)
                }
            })
            console.log("选择用户："+JSON.stringify(notSameArr))
            if(notSameArr.length>0){
                let arr = this.formatCcedList(notSameArr);
                this.ccedList = this.ccedList.concat(arr);
                // 给父组件回填抄送人信息
                this.$emit("setCount",this.ccedList.length);
                this.addCcedList(this.ccedList);
                this.showSelectMulUser = false;
            }
        },
        //关闭选择人员弹窗
        closeSelectMulUser(){
            this.showSelectMulUser = false;
        },
    }
}
</script>
