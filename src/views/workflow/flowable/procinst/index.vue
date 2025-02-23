<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="业务信息" prop="businessKey">
                <el-input v-model="queryParams.businessKey" placeholder="请输入业务信息" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
<!--                <el-col :span="1.5">-->
<!--                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['oa:procinst:edit']">-->
<!--                        修改-->
<!--                    </el-button>-->
<!--                </el-col>-->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['oa:procinst:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="procinstList" @selection-change="handleSelectionChange">
                <el-table-column label="流程实例ID" align="center" prop="procInstId" width="200" :show-overflow-tooltip="true"/>
                <el-table-column label="申请流程" align="center" prop="defName" width="200"/>
                <el-table-column label="流程定义编码" align="center" prop="defKey" width="200"/>
                <el-table-column label="业务信息" align="center" prop="businessKey" width="200"/>
                <el-table-column label="标题" align="center" prop="orderinfo" width="200" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span v-text="formatOrderInfo(scope.row.orderinfo,'title')"></span>
                    </template>
                </el-table-column>
                <el-table-column label="流程定义ID" align="center" prop="procDefId" width="150" :show-overflow-tooltip="true"/>
                <el-table-column label="开始时间" align="center" prop="startTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" prop="endTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="耗时" align="center" prop="duration" width="150">
                    <template slot-scope="scope">
                        <span v-html="formatDuring(scope.row.duration)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="起始人" align="center" prop="startUserId"/>
                <el-table-column label="删除原因" align="center" prop="deleteReason"/>

<!--                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--                    <template slot-scope="scope">-->
<!--                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['oa:procinst:edit']">-->
<!--                            修改-->
<!--                        </el-button>-->
<!--                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['oa:procinst:remove']">-->
<!--                            删除-->
<!--                        </el-button>-->
<!--                    </template>-->
<!--                </el-table-column>-->
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>

        <!-- 添加或修改流程实例对话框 -->
<!--        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>-->
<!--            <el-form ref="form" :model="form" :rules="rules" label-width="120px">-->
<!--                <el-form-item label="" prop="rev">-->
<!--                    <el-input v-model="form.rev" placeholder="请输入"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="流程实例ID" prop="procInstId">-->
<!--                    <el-input v-model="form.procInstId" placeholder="请输入流程实例ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="业务信息" prop="businessKey">-->
<!--                    <el-input v-model="form.businessKey" placeholder="请输入业务信息"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="流程定义ID" prop="procDefId">-->
<!--                    <el-input v-model="form.procDefId" placeholder="请输入流程定义ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="开始时间" prop="startTime">-->
<!--                    <el-date-picker clearable-->
<!--                                    v-model="form.startTime"-->
<!--                                    type="date"-->
<!--                                    value-format="yyyy-MM-dd"-->
<!--                                    placeholder="请选择开始时间">-->
<!--                    </el-date-picker>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="结束时间" prop="endTime">-->
<!--                    <el-date-picker clearable-->
<!--                                    v-model="form.endTime"-->
<!--                                    type="date"-->
<!--                                    value-format="yyyy-MM-dd"-->
<!--                                    placeholder="请选择结束时间">-->
<!--                    </el-date-picker>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="耗时" prop="duration">-->
<!--                    <el-input v-model="form.duration" placeholder="请输入耗时"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="起始人" prop="startUserId">-->
<!--                    <el-input v-model="form.startUserId" placeholder="请输入起始人"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="起始节点ID" prop="startActId">-->
<!--                    <el-input v-model="form.startActId" placeholder="请输入起始节点ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="结束节点ID" prop="endActId">-->
<!--                    <el-input v-model="form.endActId" placeholder="请输入结束节点ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="父流程实例ID" prop="superProcessInstanceId">-->
<!--                    <el-input v-model="form.superProcessInstanceId" placeholder="请输入父流程实例ID"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="删除原因" prop="deleteReason">-->
<!--                    <el-input v-model="form.deleteReason" type="textarea" :rows="5" placeholder="请输入内容"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="${comment}" prop="tenantId">-->
<!--                    <el-input v-model="form.tenantId" placeholder="请输入${comment}"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="名称" prop="name">-->
<!--                    <el-input v-model="form.name" placeholder="请输入名称"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="${comment}" prop="callbackId">-->
<!--                    <el-input v-model="form.callbackId" placeholder="请输入${comment}"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="${comment}" prop="callbackType">-->
<!--                    <el-input v-model="form.callbackType" placeholder="请输入${comment}"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="${comment}" prop="referenceId">-->
<!--                    <el-input v-model="form.referenceId" placeholder="请输入${comment}"/>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="${comment}" prop="referenceType">-->
<!--                    <el-input v-model="form.referenceType" placeholder="请输入${comment}"/>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--            <div slot="footer" class="dialog-footer">-->
<!--                <el-button type="primary" @click="submitForm">确 定</el-button>-->
<!--                <el-button @click="cancel">取 消</el-button>-->
<!--            </div>-->
<!--        </el-dialog>-->
    </div>
</template>

<script>
import {listProcinst, getProcinst, delProcinst, addProcinst, updateProcinst} from "@/api/workflow/procinst";

export default {
    name: "Procinst",
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
            // 流程实例表格数据
            procinstList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                rev: null,
                procInstId: null,
                businessKey: null,
                procDefId: null,
                startTime: null,
                endTime: null,
                duration: null,
                startUserId: null,
                startActId: null,
                endActId: null,
                superProcessInstanceId: null,
                deleteReason: null,
                tenantId: null,
                name: null,
                callbackId: null,
                callbackType: null,
                referenceId: null,
                referenceType: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                procInstId: [
                    {required: true, message: "流程实例ID不能为空", trigger: "blur"}
                ],
                procDefId: [
                    {required: true, message: "流程定义ID不能为空", trigger: "blur"}
                ],
                startTime: [
                    {required: true, message: "开始时间不能为空", trigger: "blur"}
                ],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询流程实例列表 */
        getList() {
            this.loading = true;
            listProcinst(this.queryParams).then(response => {
                this.procinstList = response.rows;
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
                procInstId: null,
                businessKey: null,
                procDefId: null,
                startTime: null,
                endTime: null,
                duration: null,
                startUserId: null,
                startActId: null,
                endActId: null,
                superProcessInstanceId: null,
                deleteReason: null,
                tenantId: null,
                name: null,
                callbackId: null,
                callbackType: null,
                referenceId: null,
                referenceType: null
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
            this.title = "添加流程实例";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getProcinst(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改流程实例";
            });
        },
        formatOrderInfo(orderInfo,key){
            let obj = JSON.parse(orderInfo);
            return obj[key];
        },
        formatDuring(millisecond) {
            var days = parseInt(millisecond / (1000 * 60 * 60 * 24));
            var hours = parseInt((millisecond % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = parseInt((millisecond % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = (millisecond % (1000 * 60)) / 1000;
            let arr = []
            let html = '<span '
            if(days>0){
                if(days>5){
                    html = html + 'style="color:red" '
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
            console.log(html);
            return html;
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateProcinst(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addProcinst(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除流程实例编号为"' + ids + '"的数据项？').then(function () {
                return delProcinst(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('oa/procinst/export', {
                ...this.queryParams
            }, `procinst_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
