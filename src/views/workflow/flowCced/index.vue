<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="单据类型" prop="billType">
                <el-select v-model="queryParams.billType" placeholder="请选择单据类型" clearable>
                    <el-option v-for="dict in billTypeList" :key="dict.billType" :label="dict.billName" :value="dict.billType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单据标题" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入单据标题" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="flowCcedList">
                <el-table-column label="单据类型" align="center" prop="billType">
                    <template slot-scope="scope">
                        <span>{{ parseBillType(scope.row.billType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单据标题" align="center" prop="title"/>
                <el-table-column label="流程定义编号" align="center" prop="flowKey" width="180"/>
<!--                <el-table-column label="业务id" align="center" prop="businessId"/>-->
                <el-table-column label="单据绑定编码" align="center" prop="businessKey"/>
                <el-table-column label="来源用户" align="center" prop="fromNickName" width="150"/>
                <el-table-column label="抄送用户" align="center" prop="toNickName"/>

                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-view" @click="view(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
    </div>
</template>

<script>
import {listToMe, getFlowCced, delFlowCced, addFlowCced, updateFlowCced} from "@/api/workflow/flowCced";
import {listBillTypeAll} from "@/api/common/billType"
export default {
    name: "FlowCced",
    dicts: ['bill_type'],
    data() {
        return {
            // 遮罩层
            loading: true,
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            // 抄送我的表格数据
            flowCcedList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                orderByColumn: "createTime",
                isAsc: "descending",
                flowInsId: null,
                billType: null,
                flowKey: null,
                businessId: null,
                businessKey: null,
                fromUserId: null,
                toUserId: null,
                title: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {},
            billTypeList:[]
        };
    },
    created() {
        this.getListTypeList();
        this.getList();
    },
    methods: {
        getListTypeList(){
            listBillTypeAll({status:'0'}).then(res=>{
                this.billTypeList = res.data;
            })
        },
        parseBillType(billType){
            let name = "";
            this.billTypeList.forEach(item=>{
                if(item.billType == billType){
                    name = item.billName;
                }
            })
            return name;
        },
        /** 查询抄送我的列表 */
        getList() {
            this.loading = true;
            listToMe(this.queryParams).then(response => {
                this.flowCcedList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        view(row){
            // console.log(row.defkey);
            // console.log("reimburse"==row.defkey)
            let iscustomform = row.isCustomForm;
            let businessId = row.businessId;
            let billType = row.billType;
            // if("Y"==iscustomform){
            //     this.$router.push({path: "/oa/myTask/customFormTask/" + row.taskid });
            // }else{
                this.billTypeList.forEach((item)=>{
                    if(item.billType==row.billType){
                        this.$router.push({path: item.formUrl + "/" + businessId, query: { readonly:"1"}})
                    }
                })
            // }
        },
    }
};
</script>
