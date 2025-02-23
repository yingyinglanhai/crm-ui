<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="编码" prop="key">
                <el-input v-model="queryParams.key" placeholder="请输入编码" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="表单分类" prop="category">
                <el-select v-model="queryParams.category" placeholder="请选择表单分类" clearable>
                    <el-option v-for="dict in dict.type.oa_customform_category" :key="dict.value" :label="dict.label"
                               :value="dict.value"/>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>
        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-delete" size="mini" @click="clearAllProcessInstance">清空所有流程实例</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-input v-model="delInsId" placeholder="请输入实例id" clearable size="small" />
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-delete" size="mini" @click="delByInsId">删除实例</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>
            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="modelList" @selection-change="handleSelectionChange">
    <!--            <el-table-column label="ID" align="center" prop="id"/>-->
                <el-table-column label="流程编码" align="center" prop="key" width="200"/>
                <el-table-column label="名称" align="center" prop="name" width="300"/>
                <el-table-column label="版本" align="center" prop="version" width="50"/>
                <el-table-column label="所属分类" align="center" prop="category" width="200">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.oa_customform_category" :value="scope.row.category"/>
                    </template>
                </el-table-column>
                <el-table-column label="流程优化建议" align="center" prop="key">
                    <template slot-scope="scope">
                        <span>{{ suggestFlow(scope.row.key) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改流程图对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="流程编码" prop="formKey">
                    <el-input v-model="form.key" placeholder="请输入流程编码" />
                </el-form-item>
                <el-form-item label="流程名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入流程名称" />
                </el-form-item>
                <el-form-item label="表单分类" prop="category">
                    <el-select v-model="form.category" placeholder="请选择表单分类" clearable>
                        <el-option v-for="dict in dict.type.oa_customform_category" :key="dict.value" :label="dict.label"
                                   :value="dict.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="流程描述" prop="category">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入流程描述" />
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
import {listModel, getModel, delModel, addModel, updateModel,deploy} from "@/api/workflow/model";
import {clearAllProcessInstance, deleteProcessInstanceById} from "@/api/workflow/processInstance";

export default {
    name: "Model",
    dicts: ['oa_customform_category'],
    data() {
        return {
            delInsId:"",
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
            // 流程图表格数据
            modelList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                name: null,
                key: null,
                category: null,
                createTime: null,
                lastUpdateTime: null,
                version: null,
                metaInfo: null,
                deploymentId: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {}
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询流程图列表 */
        getList() {
            this.loading = true;
            listModel(this.queryParams).then(response => {
                let list = response.rows;
                this.modelList = list;
                this.total = response.total;
                this.loading = false;
            });
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
                rev: null,
                name: null,
                key: null,
                category: null,
                createTime: null,
                lastUpdateTime: null,
                version: null,
                metaInfo: null,
                deploymentId: null,
                editorSourceValueId: null,
                editorSourceExtraValueId: null,
                tenantId: null
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
            this.title = "添加流程图";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getModel(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改流程图";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                        addModel(this.form).then(response => {
                            this.$modal.msgSuccess("创建成功");
                            this.open = false;
                            this.getList();
                        });
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal.confirm('是否确认删除流程图版本号为"' + row.version + '"的数据项？').then( function() {
                return delModel(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        clearAllProcessInstance(){
            this.$modal.confirm('是否确认清空所有流程实例？？？').then(function() {
                return clearAllProcessInstance();
            }).then(() => {
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        delByInsId(){
            this.$modal.confirm('是否确认删除该流程实例？？？"').then( ()=> {
                deleteProcessInstanceById(this.delInsId).then(() => {
                    this.$modal.msgSuccess("删除成功");
                });
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('oa/model/export', {
                ...this.queryParams
            }, `model_${new Date().getTime()}.xlsx`)
        },
        //编辑
        edit(row){
            this.$router.push({path: "/oa/model/modelDesigner/" + row.id});
        },
        suggestFlow(key){
            if(key=="leave") {
                return "1、建议缩短审批时间。2、建议减少多余分支";
            }else if(key=="Meeting"){
                return "1、建议减少多余分支";
            }else if(key=="Seal"){
                return "1、建议减少多余分支";
            }else if(key=="Seal"){
                return "1、建议减少多余分支";
            }else{
                return "1、建议维持现状"
            }
        }
    }
};
</script>
