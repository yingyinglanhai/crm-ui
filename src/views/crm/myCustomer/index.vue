<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="客户名称" prop="customerName">
                <el-input v-model="queryParams.customerName" placeholder="请输入客户名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="所属行业" prop="industry">
                <el-select v-model="queryParams.industry" placeholder="请选择所属行业" clearable >
                    <el-option v-for="dict in dict.type.crm_customer_industry" :key="dict.label" :label="dict.label" :value="dict.label"/>
                </el-select>
            </el-form-item>
            <el-form-item label="客户等级" prop="grade">
                <el-select v-model="queryParams.grade" placeholder="请选择客户等级" clearable >
                    <el-option v-for="dict in dict.type.crm_customer_grade" :key="dict.label" :label="dict.label" :value="dict.label"/>
                </el-select>
            </el-form-item>
            <el-form-item label="客户来源" prop="source">
                <el-select v-model="queryParams.source" placeholder="请选择客户来源" clearable>
                    <el-option v-for="dict in dict.type.crm_customer_source" :key="dict.label" :label="dict.label" :value="dict.label"></el-option>
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
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['crm:customer:add']">
                        新增
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['crm:customer:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['crm:customer:remove']">
                        删除
                    </el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['crm:customer:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="myCustomerList" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"/> -->
                <el-table-column label="客户名称" align="center" prop="customerName"/>
                <el-table-column label="所属行业" align="center" width="100" prop="industry"/>
                <el-table-column label="客户等级" align="center" width="100" prop="grade"/>   
                <el-table-column label="客户来源" align="center" width="100" prop="source"/>
                <el-table-column label="电话" align="center" prop="phone"/>
                <el-table-column label="微信" align="center" width="100" prop="wechat"/>
                <el-table-column label="邮箱" align="center" prop="email"/>
                <!-- <el-table-column label="地址" align="center" prop="address"/>
                <el-table-column label="网址" align="center" prop="website"/>
                <el-table-column label="描述" align="center" prop="description"/> -->
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['crm:customer:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['crm:customer:remove']">
                            删除
                        </el-button>
                        <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)" v-hasPermi="['crm:customer:edit']">
                            <span class="el-dropdown-link">
                              <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="handleReturn" icon="el-icon-user" v-hasPermi="['crm:customer:edit']">移回公海</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改客户对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="850px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户名称" prop="customerName">
                            <el-input v-model="form.customerName" placeholder="请输入客户名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属行业" prop="industry">
                            <el-select v-model="form.industry" placeholder="请选择所属行业" clearable >
                                <el-option v-for="dict in dict.type.crm_customer_industry" :key="dict.label" :label="dict.label" :value="dict.label"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="客户等级" prop="grade">
                            <el-select v-model="form.grade" placeholder="请选择客户等级" clearable >
                                <el-option v-for="dict in dict.type.crm_customer_grade" :key="dict.label" :label="dict.label" :value="dict.label"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户来源" prop="source">
                            <el-select v-model="form.source" placeholder="请选择客户来源" clearable>
                                <el-option v-for="dict in dict.type.crm_customer_source" :key="dict.label" :label="dict.label" :value="dict.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>    
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="form.phone" placeholder="请输入电话"/>
                        </el-form-item>
                    </el-col>  
                    <el-col :span="12"> 
                        <el-form-item label="微信" prop="wechat">
                            <el-input v-model="form.wechat" placeholder="请输入微信号"/>    
                        </el-form-item>
                    </el-col>    
                </el-row>      
                <el-row>
                    <el-col :span="12">    
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱号"/>    
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="网址" prop="website">
                            <el-input v-model="form.website" placeholder="请输入网址"/>    
                        </el-form-item>
                    </el-col>
                </el-row>         
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入联系地址"/>    
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input v-model="form.description" type="textarea" :rows="5" placeholder="请输入内容"/>
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
import {listMyCustomer,getMyCustomer,addMyCustomer,updateMyCustomer,delMyCustomer,returnMyCustomer} from "@/api/crm/myCustomer";

export default {
    name: "myCustomer",
    dicts: ['crm_customer_industry','crm_customer_grade','crm_customer_source'],
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
            // 客户表格数据
            myCustomerList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                customerName: null,
                industry: null,
                grade: null,
                source: null,
                pageNum: 1,
                pageSize: 20,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                customerName: [
                    {required: true, message: "客户名称不能为空", trigger: "change"}
                ],
                industry: [
                    {required: true, message: "行业不能为空", trigger: "blur"}
                ],
                grade: [
                    {required: true, message: "等级不能为空", trigger: "blur"}
                ],
                source: [
                    {required: true, message: "客户来源不能为空", trigger: "blur"}
                ]
            },
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询客户 */
        getList() {
            this.loading = true;
            listMyCustomer(this.queryParams).then(response => {
                this.myCustomerList = response.rows;
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
                customerName: null,
                industry: null,
                grade: null,
                source: null,
                phone: null,
                wechat: null,
                email: null,
                address: null,
                website: null,
                description: null,
                claimUserId: null,
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
            this.ids = selection.map(item => item.customerId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加产品";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.customerId || this.ids
            getMyCustomer(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改客户信息";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.customerId != null) {
                        updateMyCustomer(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addMyCustomer(this.form).then(response => {
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
            const ids = row.customerId || this.ids;
            this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function () {
                return delMyCustomer(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/mycustomer/export', {
                ...this.queryParams
            }, `mycustomer_${new Date().getTime()}.xlsx`)
        },
        // 更多操作触发
        handleCommand(command, row) {
            switch (command) {
                case "handleReturn":
                    this.handleReturn(row);
                    break;
                default:
                    break;
            }
        },
        /** 认领客户 */
        handleReturn(row) {
            const that = this;
            that.$modal.confirm('是否确认把该客户移回公海？').then(function () {
                that.reset();
                that.form.customerId = row.customerId;
                return returnMyCustomer(that.form);
            }).then(() => {
                that.getList();
                that.$modal.msgSuccess("移回成功");
            }).catch((error) => {
                console.error('发生错误:', error.message); // 输出错误信息
                console.trace();
            });            
        }
    }
};
</script>
