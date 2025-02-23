<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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
            <el-table v-loading="loading" :data="contractList" :show-header="true" @expand-change="expandChange">
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                    <el-card style="padding-left: 30px; padding-right: 0px; background:#ececec">
                        <el-table :border="Global.tableShowBorder" v-loading="loading" :data="scope.row.backmoneyList" :row-key="String(scope.row.contractId)">
                            <el-table-column label="回款日期" align="center" width="100" prop="backmoneyDate"/>
                            <el-table-column label="回款金额" align="center" width="100" prop="backmoneyAmount"/>   
                            <el-table-column label="回款方式" align="center" width="100" prop="backmoneyWay"/>
                            <el-table-column label="备注" align="center" prop="backmoneyDesc"/>
                            <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">  
                                <template slot-scope="scope2">
                                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope2.row,scope.row)" v-hasPermi="['crm:backmoney:edit']">
                                    修改
                                    </el-button>
                                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope2.row,scope.row)" v-hasPermi="['crm:backmoney:remove']">
                                    删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="合同编号"  prop="contractNo"/>    
                <el-table-column align="center" label="合同名称"  prop="contractName"/> 
                <el-table-column align="center" label="签订日期"  prop="signDate"/> 
                <el-table-column align="center" label="客户名称"  prop="customerName"/> 
                <el-table-column align="center" label="合同类型"  prop="contractType"/> 
                <el-table-column align="center" label="合同金额"  prop="contractMoney"/> 
                <el-table-column align="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-plus" v-show="scope.row.showAdd" @click="handleAdd(scope.row)" v-hasPermi="['crm:backmoney:add']">
                            新增
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="回款日期" prop="backmoneyDate">
                    <el-date-picker v-model="form.backmoneyDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                </el-form-item> 
                <el-form-item label="回款方式" prop="backmoneyWay">
                    <el-select v-model="form.backmoneyWay" placeholder="请选择回款方式" clearable >
                        <el-option v-for="dict in dict.type.crm_backmoney_way" :key="dict.value" :label="dict.label" :value="dict.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="回款金额" prop="backmoneyAmount">
                    <el-input v-model="form.backmoneyAmount" type="number" placeholder="请输入金额"/>
                </el-form-item>
                <el-form-item label="备注" prop="backmoneyDesc">
                    <el-input v-model="form.backmoneyDesc" type="textarea" :rows="5" placeholder="请输入内容"/>
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
import {listContract} from "@/api/crm/contract";
import {listBackmoneyByContractId,getBackmoney,addBackmoney,updateBackmoney,delBackmoney} from "@/api/crm/backmoney";
export default {
    name: "Backmoney",
    dicts: ['crm_backmoney_way'],
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
            // 当前行
            currentRow: {},
            // 表单校验
            rules: {
                backmoneyDate: [
                    {required: true, message: "回款日期", trigger: "blur"}
                ],
                backmoneyWay: [
                    {required: true, message: "回款方式", trigger: "change"}
                ],
                backmoneyAmount: [
                    {required: true, message: "回款金额", trigger: "blur"}
                ]       
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询商机列表 */
        getList() {
            this.loading = true;
            listContract(this.queryParams).then(response => {
                //初始化contract的backmoneyList，全部为空，为了dom渲染
                response.rows.map(item => {
                    item.backmoneyList = [];
                    //不显示新增按钮
                    item.showAdd = false;
                });
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
            this.form = {};
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
        handleAdd(row) {
            this.reset();
            this.open = true;
            this.title = "添加";
            this.currentRow = row;
        },
        /** 修改按钮操作 */
        handleUpdate(row,parentRow) {
            this.reset();
            const id = row.backmoneyId || this.ids
            getBackmoney(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改";
                this.currentRow = parentRow;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.backmoneyId != null) {
                        updateBackmoney(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getBackmoneyList(this.currentRow);
                        });
                    } else {
                        this.form.contractId = this.currentRow.contractId;
                        this.form.contractNo = this.currentRow.contractNo;
                        this.form.contractName = this.currentRow.contractName;
                        this.form.customerId = this.currentRow.customerId;
                        this.form.customerName = this.currentRow.customerName;

                        addBackmoney(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getBackmoneyList(this.currentRow);
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row,parentRow) {
            const id = row.backmoneyId;
            this.$modal.confirm('是否确认删除编号为"' + id + '"的数据项？').then(function () {
                return delBackmoney(id);
            }).then(() => {
                this.getBackmoneyList(parentRow);
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/backmoney/export', {
                ...this.queryParams
            }, `backmoney_${new Date().getTime()}.xlsx`)
        },
        //获取行对应合同的回款表
        getBackmoneyList(row){
            debugger;
            listBackmoneyByContractId(row.contractId).then(response => {
                row.backmoneyList = response.data;
            });
        },
        expandChange(row, expandedRows){
            //判断当前行row在不在expandedRows里
            const r = expandedRows.some(obj => obj.contractId === row.contractId);
            if (r) {
                //如果 r=true，说明是展开
                this.getBackmoneyList(row);
                //显示新增按钮
                row.showAdd = true;
            }else{
                //如果 r=false，说明是关闭，情况对应数据
                row.showAdd = false;
            }

        }
    }
};
</script>
