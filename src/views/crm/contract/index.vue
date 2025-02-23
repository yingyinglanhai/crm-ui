<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="合同编号" prop="contractNo">
                <el-input v-model="queryParams.contractNo" placeholder="请输入合同编号" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="合同名称" prop="contractName">
                <el-input v-model="queryParams.contractName" placeholder="请输入合同名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName">
                <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['crm:contract:add']">
                        新增
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['crm:contract:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['crm:contract:remove']">
                        删除
                    </el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['crm:contract:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="contractList" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"/> -->
                <el-table-column label="合同编号" align="center" prop="contractNo"/>
                <el-table-column label="合同名称" align="center"  prop="contractName"/>
                <el-table-column label="签订时间" align="center" prop="signDate"/>
                <el-table-column label="客户名称" align="center" prop="customerName"/>   
                <el-table-column label="合同类型" align="center"  prop="contractType"/>
                <el-table-column label="合同金额" align="center" prop="contractMoney"/>
                <el-table-column label="合同开始时间" align="center" prop="beginDate"/>
                <el-table-column label="合同结束时间" align="center" prop="endDate"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['crm:contract:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['crm:contract:remove']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改合同对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同编号" prop="contractNo">
                            <el-input v-model="form.contractNo" placeholder="请输入合同编号"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同名称" prop="contractName">
                            <el-input v-model="form.contractName" placeholder="请输入合同名称"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="customerName">
                            <el-select ref="selectOptions" v-model="form.customerName" filterable remote reserve-keyword :remote-method="remoteSearch" @change="selectChange" placeholder="请输入关键词" clearable >
                                <el-option v-for="item in customerList" :key="item.customerId" :label="item.customerName" :value="item.customerId"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同类型" prop="contractType">
                            <el-select v-model="form.contractType" placeholder="请选择合同类型" clearable >
                                <el-option v-for="dict in dict.type.crm_contract_type" :key="dict.value" :label="dict.label" :value="dict.label"/>
                            </el-select>
                        </el-form-item>                    
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="签订日期" prop="signDate">
                            <el-date-picker v-model="form.signDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同金额" prop="contractMoney">
                            <el-input v-model="form.contractMoney" type="number" placeholder="请输入合同金额"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="合同开始时间" prop="beginDate">
                            <el-date-picker v-model="form.beginDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="合同结束时间" prop="endDate">
                            <el-date-picker v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="合同描述" prop="contractDesc">
                    <el-input v-model="form.contractDesc" type="textarea" :rows="5" placeholder="请输入合同描述"/>
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
import { debounce } from 'lodash';
import {listAllCustomer} from "@/api/crm/customer";
import {listContract,getContract,addContract,updateContract,delContract} from "@/api/crm/contract";

export default {
    name: "Contract",
    dicts: ['crm_contract_type'],
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
            //客户的搜索结果数据
            customerList: [],
            // 合同表格数据
            contractList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                contractNo: null,
                contractName: null,
                customerName: null,
                pageNum: 1,
                pageSize: 20,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                contractNo: [
                    {required: true, message: "合同编号不能为空", trigger: "blur"}
                ],
                customerName: [
                    {required: true, message: "客户名称不能为空", trigger: "change"}
                ],
                signDate: [
                    {required: true, message: "签订日期不能为空", trigger: "change"}
                ],      
                contractMoney: [
                    {required: true, message: "合同金额不能为空", trigger: "change"}
                ],          
            },
        };
    },
    created() {
        this.getList();
    },
    // watch: {
    //     // 监听 selectedItem 的变化，以便在选项被选中时取消正在进行的防抖请求
    //     selectedItem(newValue) {
    //         // 清除防抖函数的延时，立即执行当前请求（如果有的话）
    //         if (this.debouncedRemoteMethod) {
    //             this.debouncedRemoteMethod.cancel();
    //         }
    //     },
    // },
    methods: {
        /** 查询客户 */
        getList() {
            this.loading = true;
            listContract(this.queryParams).then(response => {
                this.contractList = response.rows;
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
                contractId: null,
                contractNo: null,
                contractName: null,
                contractType: null,
                customerId: null,                
                customerName: null,
                signDate: null,
                beginDate: null,
                endDate: null,
                contractMoney: null,
                contractDesc: null,
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null
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
            this.ids = selection.map(item => item.contractId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加信息";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.contractId || this.ids
            getContract(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改信息";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.contractId != null) {
                        console.log("form="+JSON.stringify(this.form));
                        updateContract(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        console.log("form="+JSON.stringify(this.form));
                        addContract(this.form).then(response => {
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
            const ids = row.contractId || this.ids;
            this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function () {
                return delContract(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/contract/export', {
                ...this.queryParams
            }, `contract${new Date().getTime()}.xlsx`)
        },
        remoteSearch(key){
            if (key !== ''){
                let params={};
                params.customerName = key;
                listAllCustomer(params).then(response => {
                    this.customerList = response.data;
                }); 
            }else{
                this.customerList = []
            }
        },
        selectChange(){
            this.$nextTick(function () {
                this.form.customerId = this.$refs.selectOptions.selected.value;
                this.form.customerName = this.$refs.selectOptions.selected.label;
            });
        }
    }
};
</script>
