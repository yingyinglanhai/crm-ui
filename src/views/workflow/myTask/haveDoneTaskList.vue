<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="流程编码" prop="defkey">
                <el-input v-model="queryParams.defkey" placeholder="请输入流程编码" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="流程名称" prop="defname">
                <el-input v-model="queryParams.defname" placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
    <!--                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['oa:myTask:export']">导出</el-button>-->
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="haveDoneTaskList"></right-toolbar>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="myTaskList" @selection-change="">
    <!--            <el-table-column label="流程编码" align="center" prop="defkey"/>-->
                <el-table-column label="流程名称" align="center" prop="processName"/>
                <el-table-column label="任务名称" align="center" prop="taskName"/>
                <el-table-column label="标题" align="center" prop="orderInfo" width="350" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-text="formatOrderInfo(scope.row.orderInfo,'title')"></span>
                    </template>
                </el-table-column>
                <el-table-column label="申请人" align="center" prop="orderinfo">
                    <template slot-scope="scope">
                        <span v-text="formatOrderInfo(scope.row.orderInfo,'nickname')"></span>
                    </template>
                </el-table-column>
                <el-table-column label="办理时间" align="center" prop="endTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-check" @click="view(scope.row)" v-hasPermi="['oa:myTask:remove']">查看</el-button>
                        <el-button size="mini" type="text" icon="el-icon-check" @click="flowDetail(scope.row)" v-hasPermi="['oa:myTask:remove']">查看流程</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="haveDoneTaskList"/>
        </TableCard>


            <FlowInfo :businessId="businessId" :billType="billType" v-if="showFlowInfo" :showStatus="showFlowInfo" @closeFlowInfoDialog="()=>{this.showFlowInfo=false}"></FlowInfo>

    </div>
</template>

<script>
import {haveDoneTaskList} from "@/api/workflow/myTask";
import FlowInfo from "@/views/workflow/flow/flowInfo";
import {listBillTypeAll} from "@/api/common/billType"
export default {
    name: "HaveDoneTaskList",
    components:{FlowInfo},
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
            // 我的已办表格数据
            myTaskList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                defkey: null,
                defname: null,
            },
            showFlowInfo:false,
            insId:"",
            businessId:"",
            billType:"",
            billTypeList:[]
        };
    },
    created() {
        this.haveDoneTaskList();
        this.getListTypeList();
    },
    methods: {
        getListTypeList(){
            listBillTypeAll({status:'0'}).then(res=>{
                this.billTypeList = res.data;
            })
        },
        /** 查询我的已办列表 */
        haveDoneTaskList() {
            this.loading = true;
            // debugger
            // console.log(this.queryParams)
            haveDoneTaskList(this.queryParams).then(response => {
                this.myTaskList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.haveDoneTaskList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        },
        formatOrderInfo(orderInfo,key){
            let obj = JSON.parse(orderInfo);
            return obj[key];
        },
        view(row){
            let iscustomform = this.formatOrderInfo(row.orderInfo,'iscustomform')
            let businessId = row.businessKey.split(":")[2];
            let billType = row.businessKey.split(":")[0];
            // if("Y"==iscustomform){
            //     this.$router.push({path: "/oa/myTask/customFormTask/" + row.taskid });
            // }else{
                this.billTypeList.forEach((item)=>{
                    if(item.billType==billType){
                        this.$router.push({path: item.formUrl + "/" + businessId, query: { readonly:"1"}})
                    }
                })
            // }
        },
        /** 流程信息 ***/
        flowDetail(row){
            this.insId = row.proInsId;
            this.businessId = row.businessKey.split(":")[2];
            this.billType = row.businessKey.split(":")[0];
            this.showFlowInfo = true;
        },

    }
};
</script>
