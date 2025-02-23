<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入公司名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="地址" prop="address">
                <el-input v-model="queryParams.address" placeholder="请输入地址" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
                <el-input v-model="queryParams.legalPerson" placeholder="请输入法人" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="过期时间" prop="expirationTime">
                <el-date-picker clearable v-model="queryParams.expirationTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择过期时间"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['tenant:companyTenant:add']">
                        新增
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['tenant:companyTenant:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['tenant:companyTenant:remove']">
                        删除
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['tenant:companyTenant:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="companyTenantList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="营业执照" align="center" prop="businessLicense" width="80">
                    <template slot-scope="scope">
                        <image-preview v-if="!util.isEmpty(scope.row.businessLicense)" :src="scope.row.businessLicense" :width="25" :height="25"/>
                    </template>
                </el-table-column>
                <el-table-column label="公司名称" align="center" prop="name" width="250" :show-overflow-tooltip="true"/>
                <el-table-column label="纳税识别号" align="center" prop="idNum" width="180" :show-overflow-tooltip="true"/>
                <el-table-column label="法人" align="center" prop="legalPerson" width="150" :show-overflow-tooltip="true"/>
                <el-table-column label="联系方式" align="center" prop="phone" width="150" :show-overflow-tooltip="true"/>
                <el-table-column label="地址" align="center" prop="address" :show-overflow-tooltip="true"/>
<!--                <el-table-column label="经营范围" align="center" prop="businessScope" :show-overflow-tooltip="true"/>-->
                <el-table-column label="过期时间" align="center" prop="expirationTime" width="180" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.expirationTime, '{y}-{m}-{d}') }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否可用" align="center" prop="status" width="150">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column label="是否初始化帐号" align="center" prop="ifInit" width="150">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.ifInit"/>
                    </template>
                </el-table-column>
                <el-table-column label="管理员账号" align="center" prop="adminName" width="150" :show-overflow-tooltip="true"/>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['tenant:companyTenant:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" v-if="scope.row.ifInit=='N'" type="text" icon="el-icon-edit" @click="initCompanyAdmin(scope.row)" v-hasPermi="['tenant:companyTenant:edit']">
                            初始化企业
                        </el-button>
                        <el-button size="mini" v-if="scope.row.status=='1'" type="text" icon="el-icon-edit" @click="changeStatus(scope.row,'0')" v-hasPermi="['tenant:companyTenant:edit']">
                            启用
                        </el-button>
                        <el-button size="mini" v-if="scope.row.status=='0'" type="text" icon="el-icon-delete" @click="changeStatus(scope.row,'1')" v-hasPermi="['tenant:companyTenant:edit']">
                            停用
                        </el-button>
                        <el-button size="mini" v-if="scope.row.ifInit=='Y'" type="text" icon="el-icon-edit" @click="resetAdminPassword(scope.row)" v-hasPermi="['tenant:companyTenant:edit']">
                            重置密码
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>

        <!-- 添加或修改公司管理-租户对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="公司名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入公司名称"/>
                </el-form-item>
                <el-form-item label="纳税识别号" prop="idNum">
                    <el-input v-model="form.idNum" placeholder="请输入纳税识别号"/>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form.address" placeholder="请输入地址"/>
                </el-form-item>
                <el-form-item label="法人" prop="legalPerson">
                    <el-input v-model="form.legalPerson" placeholder="请输入法人"/>
                </el-form-item>
                <el-form-item label="联系方式" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入联系方式"/>
                </el-form-item>
                <el-form-item label="营业执照">
                    <image-upload v-model="form.businessLicense"/>
                </el-form-item>
                <el-form-item label="经营范围" prop="businessScope">
                    <el-input v-model="form.businessScope" type="textarea" :rows="5" placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="过期时间" prop="expirationTime">
                    <el-date-picker clearable v-model="form.expirationTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择过期时间"></el-date-picker>
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
import {listCompanyTenant, getCompanyTenant, delCompanyTenant, addCompanyTenant, updateCompanyTenant, initCompany} from "@/api/common/companyTenant";
import {resetAdminPwd} from "@/api/system/user";

export default {
    name: "CompanyTenant",
    dicts: ['sys_yes_no','sys_normal_disable'],
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
            // 公司管理-租户表格数据
            companyTenantList: [],
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
                name: null,
                address: null,
                legalPerson: null,
                businessLicense: null,
                businessScope: null,
                expirationTime: null,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                name: [
                    {required: true, message: "公司名称不能为空", trigger: "blur"}
                ],
                address: [
                    {required: true, message: "公司地址不能为空", trigger: "blur"}
                ],
                idNum: [
                    {required: true, message: "纳税识别号不能为空", trigger: "blur"}
                ],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询公司管理-租户列表 */
        getList() {
            this.loading = true;
            listCompanyTenant(this.queryParams).then(response => {
                this.companyTenantList = response.rows;
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
                name: null,
                address: null,
                legalPerson: null,
                businessLicense: null,
                businessScope: null,
                expirationTime: null,
                createTime: null
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
            this.title = "添加公司管理-租户";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getCompanyTenant(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改公司管理-租户";
            });
        },
        initCompany(row){

            // this.$modal.confirm("初始化企业，将为该企业创建初始化管理员账户（admin），分配默认角色（企业管理员），初始化组织机构根节点（企业名称）。").then( ()=> {
            //     initCompany(row.id).then(res=>{
            //         if(res.code==0){
            //             this.$modal.msgSuccess("初始化成功，管理员帐号为admin，默认密码为123456");
            //         }
            //     })
            // })
        },
        changeStatus(row,status){
            let msg = "";
            if("1"==status){
                msg = "您是否要停用该公司？"
            }else if("0"==status){
                msg = "您是否要启用该公司？"
            }
            this.$modal.confirm(msg).then( ()=> {
                let data = {
                    id : row.id,
                    status:status
                }
                updateCompanyTenant(data).then(response => {
                    this.$modal.msgSuccess("修改成功");
                    this.getList();
                });
            })
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateCompanyTenant(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addCompanyTenant(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除公司管理-租户编号为"' + ids + '"的数据项？').then(function () {
                return delCompanyTenant(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /**重置密码 */
        resetAdminPassword(row){
            this.$modal.confirm("是否确认要重置密码？").then(function () {
                return resetAdminPwd(row.adminName);
            }).then(() => {
                this.$modal.msgSuccess("重置成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('tenant/companyTenant/export', {
                ...this.queryParams
            }, `companyTenant_${new Date().getTime()}.xlsx`)
        },
        /** 重置密码按钮操作 */
        initCompanyAdmin(row) {
            this.$prompt('请输入"' + row.name + '"的管理员账号', "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnClickModal: false,
                inputValidator: (value) => { 
                    //非空验证
                    if (!value) {
                        return '账号不能为空'
                    }                   
                }
            }).then(({value}) => {
                const initData = {
                    id : row.id,
                    name : value
                };   
                initCompany(initData).then(res => {
                    if (res.code == 200){
                        this.$modal.msgSuccess("初始化成功，管理员账号是：" + value);
                        this.getList();
                    }
                    else
                        this.$modal.msgSuccess(res.msg);                  
                });
            }).catch(() => {
            });
        }

    }
};
</script>
