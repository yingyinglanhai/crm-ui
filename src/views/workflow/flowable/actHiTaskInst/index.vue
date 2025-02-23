<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="任务名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入任务名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="流程名称" prop="name">
                <el-input v-model="queryParams.defName" placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['oa:actHiTaskInst:export']">导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="actHiTaskInstList" @selection-change="handleSelectionChange"  @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="流程名称" align="center" prop="defName"/>
                <el-table-column label="任务KEY" align="center" prop="taskDefKey"/>
                <el-table-column label="任务名称" align="center" prop="name"/>
                <el-table-column label="描述信息" align="center" prop="description"/>
    <!--            <el-table-column label="拥有人" align="center" prop="owner"/>-->
                <el-table-column label="办理人" align="center" prop="assignee"/>
                <el-table-column label="开始时间" align="center" prop="startTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="认领时间" align="center" prop="claimTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.claimTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" prop="endTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="花费时间" align="center" prop="duration"  sortable="custom" :sort-orders="['descending', 'ascending']" >
                    <template slot-scope="scope">
                        <span v-html="formatDuring(scope.row.duration)"></span>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
    </div>
</template>

<script>
import {listActHiTaskInst, getActHiTaskInst, delActHiTaskInst, addActHiTaskInst, updateActHiTaskInst} from "@/api/workflow/actHiTaskInst";

export default {
    name: "ActHiTaskInst",
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
            // 历史任务表格数据
            actHiTaskInstList: [],
            // 默认排序
            defaultSort: {prop: 'FLOW_ORDERBY_COL:DURATION_', order: 'descending'},
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                rev: null,
                procDefId: null,
                taskDefId: null,
                taskDefKey: null,
                procInstId: null,
                executionId: null,
                scopeId: null,
                subScopeId: null,
                scopeType: null,
                scopeDefinitionId: null,
                propagatedStageInstId: null,
                name: null,
                defName:null,
                parentTaskId: null,
                description: null,
                owner: null,
                assignee: null,
                startTime: null,
                claimTime: null,
                endTime: null,
                duration: null,
                deleteReason: null,
                priority: null,
                dueDate: null,
                formKey: null,
                category: null,
                tenantId: null,
                lastUpdatedTime: null
            },
            // 表单参数
            form: {},
        };
    },
    created() {
        this.queryParams.orderByColumn = this.defaultSort.prop;
        this.queryParams.isAsc = this.defaultSort.order;
        this.getList();
    },
    methods: {
        /** 查询历史任务列表 */
        getList() {
            this.loading = true;
            listActHiTaskInst(this.queryParams).then(response => {
                this.actHiTaskInstList = response.rows;
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
            this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
            this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('oa/actHiTaskInst/export', {
                ...this.queryParams
            }, `actHiTaskInst_${new Date().getTime()}.xlsx`)
        },
        /** 排序触发事件 */
        handleSortChange(column, prop, order) {
            //流程引擎的字段，后面追加一个下划线
            this.queryParams.orderByColumn = "FLOW_ORDERBY_COL:"+column.prop+"_";
            this.queryParams.isAsc = column.order;
            this.getList();
        },
        /** 格式化耗时 ***/
        formatDuring(millisecond) {
            var days = parseInt(millisecond / (1000 * 60 * 60 * 24));
            var hours = parseInt((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (millisecond % (1000 * 60)) / 1000;
            let arr = []
            let html = '<span '
            let ifBetter = false;
            if(days>0){
                if(days>5){
                    html = html + 'style="color:red" '
                    ifBetter = true;
                }
                arr.push(days+"天")
            }
            if(hours>0){
                arr.push(hours+"时")
            }
            if(minutes>0){
                arr.push(minutes+"分")
            }
            if(seconds>0){
                arr.push(seconds+"秒")
            }

            if(ifBetter){
                html = html + '>' + arr.join("")+"(建议优化)</span>"
            }else{
                html = html + '>' + arr.join("")+"</span>"
            }

            console.log(html);
            return html;
        }
    }
};
</script>
