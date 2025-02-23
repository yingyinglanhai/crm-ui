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
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="actHiTaskInstList" @selection-change="handleSelectionChange"  @sort-change="handleSortChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="流程名称" align="center" prop="defName"/>
                <el-table-column label="任务KEY" align="center" prop="taskDefKey"/>
                <el-table-column label="任务名称" align="center" prop="name"/>
                <el-table-column label="次数" align="center" prop="cishu"  sortable="custom" :sort-orders="['descending', 'ascending']" >
                    <template slot-scope="scope">
                        <span v-html="formatCishu(scope.row.cishu)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="频繁度" align="center" prop="cishu">
                    <template slot-scope="scope">
                        总会触发
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
    </div>
</template>

<script>
import {listActHiTaskInst,getTaskCishuReport} from "@/api/workflow/actHiTaskInst";

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
            defaultSort: {prop: 'cishu', order: 'descending'},
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                name: null,
                defName:null,
            },
            // 表单参数
            form: {},
            // 表单校验
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
            getTaskCishuReport(this.queryParams).then(response => {
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
        /** 排序触发事件 */
        handleSortChange(column, prop, order) {
            //流程引擎的字段，后面追加一个下划线
            this.queryParams.orderByColumn = column.prop;
            this.queryParams.isAsc = column.order;
            this.getList();
        },
        formatCishu(v){
            let html = '<span ';
            if(v>4){
                html = html + 'style="color:red;">'+v+"次(建议优化)</span>";
            }else{
                html = html + '>'+v+"次</span>";
            }
            return html;
        }
    }
};
</script>
