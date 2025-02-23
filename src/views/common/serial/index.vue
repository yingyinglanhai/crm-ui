<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="单据类型" prop="billType">
                <el-select v-model="queryParams.billType" placeholder="请选择单据类型" clearable>
                    <el-option v-for="dict in billTypeList" :key="dict.billType" :label="dict.billName" :value="dict.billType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="编号前缀" prop="prefix">
                <el-input v-model="queryParams.prefix" placeholder="请输入编号前缀" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="包含日期" prop="ifHaveDate">
                <el-select v-model="queryParams.ifHaveDate" placeholder="请选择是否包含日期" clearable>
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
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['common:serial:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['common:serial:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['common:serial:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['common:serial:export']">导出</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="serialList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="单据类型" align="center" prop="billType">
                    <template slot-scope="scope">
                        <span>{{ parseBillType(scope.row.billType)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="自定义名称" align="center" prop="name"/>
                <el-table-column label="编号前缀" align="center" prop="prefix"/>
                <el-table-column label="序号" align="center" prop="serialNum"/>
                <el-table-column label="长度" align="center" prop="codeLength" />
                <el-table-column label="是否包含日期" align="center" prop="ifHaveDate">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.ifHaveDate"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['common:serial:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['common:serial:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改编号规则对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio label="0">使用单据类型创建</el-radio>
                        <el-radio label="1">自定义创建</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="单据类型" prop="billType" v-if="form.type=='0'">
                    <el-select v-model="form.billType" placeholder="请选择单据类型">
                        <el-option v-for="dict in billTypeList" :key="dict.billType" :label="dict.billName" :value="dict.billType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="自定义键值" prop="billType" v-if="form.type=='1'">
                    <el-input v-model="form.billType" placeholder="请输入自定义键值"/>
                </el-form-item>
                <el-form-item label="自定义名称" prop="billType" v-if="form.type=='1'">
                    <el-input v-model="form.name" placeholder="请输入自定义名称"/>
                </el-form-item>
                <el-form-item label="编号前缀" prop="prefix">
                    <el-input v-model="form.prefix" placeholder="请输入编号前缀"/>
                </el-form-item>
                <el-form-item label="长度" prop="codeLength">
                    <el-input v-model="form.codeLength" placeholder="请输入长度" />
                </el-form-item>
                <el-form-item label="序号" prop="serialNum">
                    <el-input v-model="form.serialNum" placeholder="请输入序号"/>
                </el-form-item>
                <el-form-item label="是否包含日期">
                    <el-radio-group v-model="form.ifHaveDate">
                        <el-radio v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.value">
                            {{ dict.label }}
                        </el-radio>
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
import {listSerial, getSerial, delSerial, addSerial, updateSerial} from "@/api/common/serial";
import {listBillTypeAll} from "@/api/common/billType";

export default {
    name: "Serial",
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
            // 编号规则表格数据
            serialList: [],
            billTypeList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                billType: null,
                serialNum: null,
                tenantId: null,
                prefix: null,
                ifHaveDate: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                billType: [
                    {required: true, message: "单据类型不能为空", trigger: "change"}
                ],
                prefix: [
                    {required: true, message: "编号前缀不能为空", trigger: "blur"}
                ],
                ifHaveDate: [
                    {required: true, message: "是否包含日期不能为空", trigger: "blur"}
                ],
                codeLength: [
                    { required: true, message: "长度不能为空", trigger: "blur" }
                ]
            }
        };
    },
    created() {
        this.getListTypeList();
        this.getList();
    },
    methods: {
        /** 查询编号规则列表 */
        getList() {
            this.loading = true;
            listSerial(this.queryParams).then(response => {
                this.serialList = response.rows;
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
                type: "0",
                id: null,
                billType: null,
                serialNum: null,
                tenantId: null,
                prefix: null,
                ifHaveDate: "Y"
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
            this.title = "添加编号规则";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getSerial(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改编号规则";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateSerial(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addSerial(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除编号规则编号为"' + ids + '"的数据项？').then(function () {
                return delSerial(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('common/serial/export', {
                ...this.queryParams
            }, `serial_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
