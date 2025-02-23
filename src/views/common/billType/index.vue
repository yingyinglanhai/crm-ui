<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="名称" prop="billName">
                <el-input v-model="queryParams.billName" placeholder="请输入单据类型名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="对应主表" prop="tableName">
                <el-input v-model="queryParams.tableName" placeholder="请输入对应主表" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="流程定义" prop="defKey">
                <el-input v-model="queryParams.defKey" placeholder="请输入流程定义编码" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
                    <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label" :value="dict.value"/>
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
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['oa:billType:add']">
                        新增
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['oa:billType:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['oa:billType:remove']">
                        删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['oa:billType:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="billTypeList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="图标" align="center" prop="appImgUrl" width="60">
                    <template slot-scope="scope">
                        <image-preview v-if="!util.isEmpty(scope.row.appImgUrl)" :src="scope.row.appImgUrl" :width="30" :height="30"/>
                        <el-avatar v-if="util.isEmpty(scope.row.appImgUrl)" :size="30" style="font-size: 14px;background-color: #aaaaaa;" >
                            无
                        </el-avatar>
                    </template>
                </el-table-column>
                <el-table-column prop="icon" label="首页图标" align="center" width="80">
                    <template slot-scope="scope">
                        <svg-icon :icon-class="scope.row.icon" v-if="!util.isEmpty(scope.row.icon)" style="width:25px;height: 25px"/>
                    </template>
                </el-table-column>
                <el-table-column label="单据类型" align="center" prop="billType"/>
                <el-table-column label="单据类型名称" align="center" prop="billName"/>
                <el-table-column label="对应主表" align="center" prop="tableName"/>
                <el-table-column label="流程定义编码" align="center" prop="defKey"/>
                <el-table-column label="路由地址" align="center" prop="formUrl" :show-overflow-tooltip="true"/>
                <el-table-column label="顺序" align="center" prop="sort" width="100"/>
                <el-table-column label="状态" align="center" prop="status" width="100">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column label="首页快捷入口" align="center" prop="homepageShow" width="100">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.homepageShow"/>
                    </template>
                </el-table-column>
                <el-table-column label="APP状态" align="center" prop="appStatus" width="120">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.appStatus"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['oa:billType:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['oa:billType:remove']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>

        <!-- 添加或修改单据类型配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="单据类型编码" prop="billType">
                    <el-input v-model="form.billType" placeholder="请输入单据类型编码"/>
                </el-form-item>
                <el-form-item label="单据类型名称" prop="billName">
                    <el-input v-model="form.billName" placeholder="请输入单据类型名称"/>
                </el-form-item>
                <el-form-item label="对应主表" prop="tableName">
                    <el-input v-model="form.tableName" placeholder="请输入对应主表"/>
                </el-form-item>
                <el-form-item label="流程定义编码" prop="defKey">
                    <el-input v-model="form.defKey" placeholder="请输入流程定义编码"/>
                </el-form-item>
                <el-form-item label="路由地址" prop="formUrl">
                    <el-input v-model="form.formUrl" placeholder="请输入路由地址"/>
                </el-form-item>
                <el-form-item label="展示顺序" prop="sort">
                    <el-input v-model="form.sort" placeholder="请输入展示顺序"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-divider content-position="left">PC端首页展示配置</el-divider>

                <el-form-item label="首页快捷入口">
                    <el-radio-group v-model="form.homepageShow">
                        <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="PC首页图标" prop="icon">
                    <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
                        <IconSelect ref="iconSelect" @selected="selected"/>
                        <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                            <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px;width: 16px;"/>
                            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
                        </el-input>
                    </el-popover>
                </el-form-item>

                <el-divider content-position="left">APP/小程序相关配置</el-divider>


                <el-form-item label="图标" prop="appImgUrl">
                    <image-upload v-model="form.appImgUrl" :limit="1"/>
                </el-form-item>
                <el-form-item label="列表地址" prop="appListUrl">
                    <el-input v-model="form.appListUrl" placeholder="请输入APP列表页路由地址"/>
                </el-form-item>
                <el-form-item label="单据地址" prop="appFormUrl">
                    <el-input v-model="form.appFormUrl" placeholder="请输入APP单据详情页路由地址"/>
                </el-form-item>

                <el-form-item label="APP是否可用">
                    <el-radio-group v-model="form.appStatus">
                        <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                    </el-radio-group>
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
import {listBillType, getBillType, delBillType, addBillType, updateBillType} from "@/api/common/billType";
import IconSelect from "@/components/IconSelect";
export default {
    name: "BillType",
    dicts: ['sys_normal_disable'],
    components: {IconSelect},
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
            // 单据类型配置表格数据
            billTypeList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                orderByColumn: "sort",
                isAsc: "ascending",
                billType: null,
                billName: null,
                tableName: null,
                defKey: null,
                formUrl: null,
                tenantId: null,
                status: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                billType: [
                    {required: true, message: "单据类型不能为空", trigger: "change"}
                ],
                billName: [
                    {required: true, message: "单据类型名称不能为空", trigger: "blur"}
                ],
                tableName: [
                    {required: true, message: "对应主表不能为空", trigger: "blur"}
                ],
                defKey: [
                    {required: true, message: "流程定义编码不能为空", trigger: "blur"}
                ],
                formUrl: [
                    {required: true, message: "路由地址不能为空", trigger: "blur"}
                ],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询单据类型配置列表 */
        getList() {
            this.loading = true;
            listBillType(this.queryParams).then(response => {
                this.billTypeList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
        // 选择图标
        selected(name) {
            this.form.icon = name;
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
                billType: null,
                billName: null,
                tableName: null,
                defKey: null,
                formUrl: null,
                icon:null,
                tenantId: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                status: "0"
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
            this.title = "添加单据类型配置";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getBillType(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改单据类型配置";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateBillType(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addBillType(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除单据类型配置编号为"' + ids + '"的数据项？').then(function () {
                return delBillType(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('common/billType/export', {
                ...this.queryParams
            }, `billType_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
