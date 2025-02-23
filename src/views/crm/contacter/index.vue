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
            <el-table v-loading="loading" :data="customerList" :show-header="false" 
            @expand-change="expandChange">
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                    <el-card style="padding-left: 30px; padding-right: 0px; background:#ececec">
                        <el-table :border="Global.tableShowBorder" v-loading="loading" :data="scope.row.contacterList" :row-key="String(scope.row.customerId)">                           
                            <el-table-column label="联系人名称" align="center" width="100" prop="contacterName"/>
                            <el-table-column label="性别" align="center" width="100">   
                                <template slot-scope="scope">
                                    <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.gender"/>
                                </template>
                            </el-table-column>
                            <el-table-column label="职位" align="center" width="100" prop="position"/>
                            <el-table-column label="手机" align="center" width="100" prop="mobile"/>   
                            <el-table-column label="微信" align="center" width="100" prop="wechat"/>
                            <el-table-column label="邮箱" align="center" width="100" prop="email"/>   
                            <el-table-column label="是否决策人" align="center" width="100" prop="isDecider">
                                <template slot-scope="scope">
                                    <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.isDecider"/>
                                </template>                                
                            </el-table-column>   
                            <el-table-column label="最后联系时间" align="center" width="100" prop="lastContactDate"/>
                            <el-table-column label="下次联系时间" align="center" width="100" prop="nextContactDate"/>   
                            <el-table-column label="操作" align="center" fixed="right" class-name="small-padding fixed-width">   
                                <template slot-scope="scope2">
                                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope2.row,scope.row)" v-hasPermi="['crm:contacter:edit']">
                                    修改
                                    </el-button>
                                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope2.row,scope.row)" v-hasPermi="['crm:contacter:remove']">
                                    删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    </template>
                </el-table-column>
                <el-table-column align="left" prop="customerName"/>    
                <el-table-column align="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-plus" v-show="scope.row.showAdd" @click="handleAdd(scope.row)" v-hasPermi="['crm:product:add']">
                            新增
                        </el-button>
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
                        <el-form-item label="联系人姓名" prop="contacterName">
                            <el-input v-model="form.contacterName" placeholder="请输入联系人姓名"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="form.gender" placeholder="请选择性别" clearable >
                                <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value"/>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="职位" prop="position">
                            <el-input v-model="form.position" placeholder="请输入职位" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="手机" prop="mobile">
                            <el-input v-model="form.mobile" placeholder="请输入手机号" />
                        </el-form-item>
                    </el-col>   
                </el-row>
                <el-row>
                    <el-col :span="12"> 
                        <el-form-item label="微信" prop="wechat">
                            <el-input v-model="form.wechat" placeholder="请输入微信号"/>    
                        </el-form-item>
                    </el-col>  
                    <el-col :span="12">    
                        <el-form-item label="邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入邮箱号"/>    
                        </el-form-item>
                    </el-col>   
                </el-row>      
                <el-row>
                    <el-col :span="12">    
                        <el-form-item label="地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入地址"/>    
                        </el-form-item>
                    </el-col>
                    <el-col :span="12"> 
                        <el-form-item label="是否决策人" prop="isDecider">
                            <el-select v-model="form.isDecider" placeholder="请选择" clearable >
                                <el-option v-for="dict in dict.type.sys_yes_no" :key="dict.value" :label="dict.label" :value="dict.value"/>
                            </el-select>  
                        </el-form-item>
                    </el-col>
                </el-row>         
                <el-form-item label="最后联系时间" prop="lastContactDate">
                    <el-date-picker v-model="form.lastContactDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                </el-form-item>  
                <el-form-item label="下次联系时间" prop="nextContactDate">
                    <el-date-picker v-model="form.nextContactDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
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
import {listCustomer} from "@/api/crm/customer";
import {listContacterByCustomerId,getContacter,addContacter,updateContacter,delContacter} from "@/api/crm/contacter";
export default {
    name: "Contacter",
    dicts: ['crm_customer_industry','crm_customer_grade','crm_customer_source','sys_yes_no','sys_user_sex'],
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
            // 客户表格数据,包括嵌套的联系人表格数据存储在contacterList中
            customerList: [],
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
                claimUserId: -1,// -1代表要查询所有客户
                pageNum: 1,
                pageSize: 20,
            },
            // 表单参数
            form: {},
            // 当前行
            currentRow: {},
            // 表单校验
            rules: {
                contacterName: [
                    {required: true, message: "联系人姓名不能为空", trigger: "change"}
                ],
                mobile: [
                    {required: true, message: "手机号不能为空", trigger: "blur"}
                ],
                address: [
                    {required: true, message: "联系人地址不能为空", trigger: "blur"}
                ],
                lastContactDate: [
                    {required: true, message: "最后联系时间不能为空", trigger: "blur"}
                ], 
                isDecider: [
                    {required: true, message: "是否是决策人不能为空", trigger: "blur"}
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
            listCustomer(this.queryParams).then(response => {
                //初始化customer的contacters，全部为空，为了dom渲染
                response.rows.map(item => {
                    item.contacterList = [];
                    //不显示新增按钮
                    item.showAdd = false;
                });
                this.customerList = response.rows;
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
            this.ids = selection.map(item => item.customerId);
            this.single = selection.length !== 1;
            this.multiple = !selection.length;
        },
        /** 新增按钮操作 */
        handleAdd(row) {
            this.reset();
            this.open = true;
            this.title = "添加联系人";
            this.currentRow = row;
        },
        /** 修改按钮操作 */
        handleUpdate(row,parentRow) {
            this.reset();
            const id = row.contacterId || this.ids
            getContacter(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改联系人信息";
                this.currentRow = parentRow;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.contacterId != null) {
                        updateContacter(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getContacterList(this.currentRow);
                        });
                    } else {
                        this.form.customerId = this.currentRow.customerId;
                        addContacter(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getContacterList(this.currentRow);
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row,parentRow) {
            const id = row.contacterId;
            this.$modal.confirm('是否确认删除编号为"' + id + '"的数据项？').then(function () {
                return delContacter(id);
            }).then(() => {
                this.getContacterList(parentRow);
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/contacter/export', {
                ...this.queryParams
            }, `contacter_${new Date().getTime()}.xlsx`)
        },
        //获取行对应的contacterlist
        getContacterList(row){
            listContacterByCustomerId(row.customerId).then(response => {
                row.contacterList = response.data;
            });
        },
        expandChange(row, expandedRows){
            //判断当前行row在不在expandedRows里
            const r = expandedRows.some(obj => obj.customerId === row.customerId);
            if (r) {
                //如果 r=true，说明是展开
                this.getContacterList(row);
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
