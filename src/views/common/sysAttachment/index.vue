<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="文件名" prop="url">
                <el-input v-model="queryParams.url" placeholder="请输入文件名" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['common:sysAttachment:add']">
                        新增
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['common:sysAttachment:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['common:sysAttachment:remove']">
                        删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['common:sysAttachment:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="sysAttachmentList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="单据类型" align="center" prop="billType">
                    <template slot-scope="scope">
                        <span>{{ parseBillType(scope.row.billType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="文件地址" align="center" prop="url" width="100">
                    <template slot-scope="scope">
                        <image-preview v-if="!util.isEmpty(scope.row.url)" :src="scope.row.url" :width="50" :height="50"/>
                    </template>
                </el-table-column>
                <el-table-column label="文件大小" align="center" prop="size">
                    <template slot-scope="scope">
                        {{(scope.row.size / 1024 / 1024).toFixed(2)}}MB
                    </template>
                </el-table-column>
                <el-table-column label="扩展名" align="center" prop="ext"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-download" @click="downloadFile(scope.row)">下载</el-button>
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['common:sysAttachment:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['common:sysAttachment:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>

        <!-- 添加或修改附件中心对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="单据id" prop="businessId">
                    <el-input v-model="form.businessId" placeholder="请输入单据id"/>
                </el-form-item>
                <el-form-item label="文件地址">
                    <file-upload v-model="form.url"/>
                </el-form-item>
                <el-form-item label="单据类型" prop="billType">
                    <el-select v-model="form.billType" placeholder="请选择单据类型">
                        <el-option v-for="dict in billTypeList" :key="dict.billType" :label="dict.billName" :value="dict.billType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件大小" prop="size">
                    <el-input v-model="form.size" placeholder="请输入文件大小"/>
                </el-form-item>
                <el-form-item label="扩展名" prop="ext">
                    <el-input v-model="form.ext" placeholder="请输入扩展名"/>
                </el-form-item>
                <el-form-item label="用户id" prop="userId">
                    <el-input v-model="form.userId" placeholder="请输入用户id"/>
                </el-form-item>
                <el-form-item label="部门id" prop="deptId">
                    <el-input v-model="form.deptId" placeholder="请输入部门id"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {
    listSysAttachment,
    getSysAttachment,
    delSysAttachment,
    addSysAttachment,
    updateSysAttachment
} from "@/api/common/sysAttachment";
import {listBillTypeAll} from "@/api/common/billType";

export default {
    name: "SysAttachment",
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
            // 附件中心表格数据
            sysAttachmentList: [],
            billTypeList: [],
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
                businessId: null,
                billType: null,
                url: null,
                size: null,
                ext: null,
                userId: null,
                deptId: null
            },
            baseUrl: process.env.VUE_APP_BASE_API,
            // 表单参数
            form: {},
            // 表单校验
            rules: {}
        };
    },
    created() {
        this.getListTypeList();
        this.getList();
    },
    methods: {
        /** 查询附件中心列表 */
        getList() {
            this.loading = true;
            listSysAttachment(this.queryParams).then(response => {
                this.sysAttachmentList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
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
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                businessId: null,
                billType: null,
                url: null,
                size: null,
                ext: null,
                createTime: null,
                createBy: null,
                userId: null,
                deptId: null
            };
            this.resetForm("form");
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加附件中心";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getSysAttachment(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改附件中心";
            });
        },
        // 下载文件
        downloadFile(row){
            window.open(this.baseUrl + row.url);
        },

        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateSysAttachment(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addSysAttachment(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getList();
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal.confirm('是否确认删除附件中心编号为"' + ids + '"的数据项？').then(function () {
                return delSysAttachment(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('common/sysAttachment/export', {
                ...this.queryParams
            }, `sysAttachment_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
