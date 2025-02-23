<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="身份证号" prop="idNum">
                <el-input v-model="queryParams.idNum" placeholder="请输入身份证号" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="queryParams.phone" placeholder="请输入电话" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="queryParams.email" placeholder="请输入邮箱" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="公司名称" prop="companyName">
                <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['oa:communicateBook:add']">
                        新增
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['oa:communicateBook:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['oa:communicateBook:remove']">
                        删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['oa:communicateBook:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="communicateBookList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="头像地址" align="center" prop="avatar" width="100">
                    <template slot-scope="scope">
                        <el-avatar :size="60" :src="baseUrl+scope.row.avatar" shape="square">
                            <el-avatar :size="60" :style="`font-size: 20px;background-color: ${extractColorByName(scope.row.name)}`" shape="square">
                                {{scope.row.name.substr(0,1)}}
                            </el-avatar>
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" align="center" prop="name"/>
                <el-table-column label="出生年月" align="center" prop="birthDate" width="180">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.birthDate, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证号" align="center" prop="idNum"/>
                <el-table-column label="电话" align="center" prop="phone"/>
                <el-table-column label="邮箱" align="center" prop="email"/>
                <el-table-column label="备注" align="center" prop="remark"/>
                <el-table-column label="公司名称" align="center" prop="companyName"/>
                <el-table-column label="公司地址" align="center" prop="companyAddress"/>
                <el-table-column label="联系地址" align="center" prop="address"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['oa:communicateBook:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['oa:communicateBook:remove']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>

        <!-- 添加或修改个人通讯录对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="头像地址">
                            <image-upload v-model="form.avatar" :limit="1"/>
                        </el-form-item>
                        <el-form-item label="公司名称" prop="companyName">
                            <el-input v-model="form.companyName" placeholder="请输入公司名称"/>
                        </el-form-item>
                        <el-form-item label="公司地址" prop="companyAddress">
                            <el-input v-model="form.companyAddress" placeholder="请输入公司地址"/>
                        </el-form-item>
                    </el-col>
                    <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                        <el-form-item label="姓名" prop="name">
                            <el-input v-model="form.name" placeholder="请输入姓名"/>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入电话"/>
                        </el-form-item>
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱"/>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="idNum">
                            <el-input v-model="form.idNum" placeholder="请输入身份证号"/>
                        </el-form-item>
                        <el-form-item label="出生年月" prop="birthDate">
                            <el-date-picker clearable v-model="form.birthDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生年月">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="联系地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入联系地址"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                        <el-form-item label="备注" prop="remark">
                            <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入内容"/>
                        </el-form-item>
                    </el-col>
                </el-row>

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
    listCommunicateBook,
    getCommunicateBook,
    delCommunicateBook,
    addCommunicateBook,
    updateCommunicateBook
} from "@/api/common/communicateBook";

export default {
    name: "CommunicateBook",
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API,
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
            // 个人通讯录表格数据
            communicateBookList: [],
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
                userId: null,
                avatar: null,
                name: null,
                birthDate: null,
                idNum: null,
                phone: null,
                email: null,
                companyName: null,
                companyAddress: null,
                address: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [
                    {required: true, message: "姓名不能为空", trigger: "blur"}
                ],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        extractColorByName(name) {
            var temp = [];
            temp.push("#");
            for (let index = 0; index < name.length; index++) {
                temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16));
            }
            return temp.slice(0, 5).join('').slice(0, 4);
        },
        /** 查询个人通讯录列表 */
        getList() {
            this.loading = true;
            listCommunicateBook(this.queryParams).then(response => {
                this.communicateBookList = response.rows;
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
                userId: null,
                avatar: null,
                name: null,
                birthDate: null,
                idNum: null,
                phone: null,
                email: null,
                remark: null,
                companyName: null,
                companyAddress: null,
                updateTime: null,
                createTime: null,
                address: null
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
            this.title = "添加个人通讯录";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getCommunicateBook(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改个人通讯录";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateCommunicateBook(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addCommunicateBook(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除个人通讯录编号为"' + ids + '"的数据项？').then(function () {
                return delCommunicateBook(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('oa/communicateBook/export', {
                ...this.queryParams
            }, `communicateBook_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
