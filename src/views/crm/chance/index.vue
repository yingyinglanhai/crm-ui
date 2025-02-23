<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="商机标题" prop="chanceTitle">
                <el-input v-model="queryParams.chanceTitle" placeholder="请输入商机标题" clearable @keyup.enter.native="handleQuery"/>
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
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['crm:chance:add']">
                        新增
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['crm:chance:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['crm:chance:remove']">
                        删除
                    </el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['crm:chance:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="chanceList" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"/> -->
                <el-table-column label="商机标题" align="center" prop="chanceTitle"/>
                <el-table-column label="客户名称" align="center"  prop="customerName"/>
                <el-table-column label="发现时间" align="center" prop="findDate"/>   
                <el-table-column label="期望签约时间" align="center"  prop="expectSignDate"/>
                <el-table-column label="期望金额" align="center" prop="expectMoney"/>
                <el-table-column label="商机描述" align="center" prop="chanceDesc"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['crm:chance:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['crm:chance:remove']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改客户对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="商机标题" prop="chanceTitle">
                    <el-input v-model="form.chanceTitle" placeholder="请输入商机标题"/>
                </el-form-item>
                <el-form-item label="客户名称" prop="customerName">
                    <el-select v-model="form.customerName" filterable remote reserve-keyword :remote-method="remoteSearch" @change="selectChange" placeholder="请输入关键词" clearable >
                        <el-option v-for="item in customerList" :key="item.customerId" :label="item.customerName" :value="item.customerId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="发现时间" prop="findDate">
                    <el-date-picker v-model="form.findDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                </el-form-item>
                <el-form-item label="期望签约时间" prop="expectSignDate">
                    <el-date-picker v-model="form.expectSignDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                </el-form-item>
                <el-form-item label="期望金额" prop="expectMoney">
                    <el-input v-model="form.expectMoney" type="number" placeholder="请输入期望金额"/>
                </el-form-item>
                <el-form-item label="商机描述" prop="chanceDesc">
                    <el-input v-model="form.chanceDesc" type="textarea" :rows="5" placeholder="请输入内容"/>
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
import {listChance,getChance,addChance,updateChance,delChance} from "@/api/crm/chance";

export default {
    name: "Chance",
    dicts: [],
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
            // 商机表格数据
            chanceList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                chanceTitle: null,
                customerName: null,
                pageNum: 1,
                pageSize: 20,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                chanceTitle: [
                    {required: true, message: "商机标题不能为空", trigger: "blur"}
                ],
                customerName: [
                    {required: true, message: "客户名称不能为空", trigger: "change"}
                ]
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
            listChance(this.queryParams).then(response => {
                this.chanceList = response.rows;
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
                chanceTitle: null,
                customerName: null,
                customerId: null,
                findDate: null,
                expectSignDate: null,
                expectMoney: null,
                chanceDesc: null,
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
            this.ids = selection.map(item => item.chanceId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加商机";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.chanceId || this.ids
            getChance(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改商机信息";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.chanceId != null) {
                        updateChance(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addChance(this.form).then(response => {
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
            const ids = row.chanceId || this.ids;
            this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function () {
                return delChance(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/chance/export', {
                ...this.queryParams
            }, `chance${new Date().getTime()}.xlsx`)
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
        selectChange(val){
            this.form.customerId = val;
        }
    }
};
</script>
