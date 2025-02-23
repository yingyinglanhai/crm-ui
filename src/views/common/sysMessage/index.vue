<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="发件人" prop="sendUserId">
                <el-input v-model="queryParams.sendUserId" placeholder="请输入发件人" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="收件人" prop="receiveUserId">
                <el-input v-model="queryParams.receiveUserId" placeholder="请输入收件人" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="发件人标题" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入发件人标题" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="发送时间" prop="sendTime">
                <el-date-picker clearable v-model="queryParams.sendTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择发送时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否阅读" prop="ifRead">
                <el-select v-model="queryParams.ifRead" placeholder="请选择是否阅读" clearable>
                    <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['common:sysMessage:add']">
                        新增
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['common:sysMessage:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['common:sysMessage:remove']">
                        删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['common:sysMessage:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="sysMessageList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="主键" align="center" prop="id"/>
                <el-table-column label="发件人" align="center" prop="sendUserId"/>
                <el-table-column label="收件人" align="center" prop="receiveUserId"/>
                <el-table-column label="发件人标题" align="center" prop="title"/>
                <el-table-column label="发送内容" align="center" prop="content"/>
                <el-table-column label="发送时间" align="center" prop="sendTime" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.sendTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否阅读" align="center" prop="ifRead">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.ifRead"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['common:sysMessage:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['common:sysMessage:remove']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>

        <!-- 添加或修改站内信对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="发件人" prop="sendUserId">
                    <el-input v-model="form.sendUserId" placeholder="请输入发件人"/>
                </el-form-item>
                <el-form-item label="收件人" prop="receiveUserId">
                    <el-input v-model="form.receiveUserId" placeholder="请输入收件人"/>
                </el-form-item>
                <el-form-item label="发件人标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入发件人标题"/>
                </el-form-item>
                <el-form-item label="发送内容">
                    <editor v-model="form.content" :min-height="192"/>
                </el-form-item>
                <el-form-item label="发送时间" prop="sendTime">
                    <el-date-picker clearable v-model="form.sendTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择发送时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="是否阅读" prop="ifRead">
                    <el-select v-model="form.ifRead" placeholder="请选择是否阅读">
                        <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                    </el-select>
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
import {listSysMessage, getSysMessage, delSysMessage, addSysMessage, updateSysMessage} from "@/api/common/sysMessage";

export default {
    name: "SysMessage",
    dicts: ['sys_yes_no'],
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
            // 站内信表格数据
            sysMessageList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                orderByColumn: "sendTime",
                isAsc: "descending",
                sendUserId: null,
                receiveUserId: null,
                title: null,
                content: null,
                sendTime: null,
                ifRead: null
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
        /** 查询站内信列表 */
        getList() {
            this.loading = true;
            listSysMessage(this.queryParams).then(response => {
                this.sysMessageList = response.rows;
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
                sendUserId: null,
                receiveUserId: null,
                title: null,
                content: null,
                sendTime: null,
                ifRead: null
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
            this.title = "添加站内信";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getSysMessage(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改站内信";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateSysMessage(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addSysMessage(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除站内信编号为"' + ids + '"的数据项？').then(function () {
                return delSysMessage(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('common/sysMessage/export', {
                ...this.queryParams
            }, `sysMessage_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
