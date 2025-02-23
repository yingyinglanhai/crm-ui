<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="产品名称" prop="productName">
                <el-input v-model="queryParams.productName" placeholder="请输入产品名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="产品编码" prop="productCode">
                <el-input v-model="queryParams.productCode" placeholder="请输入产品编码" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <TableCard>
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['crm:product:add']">
                        新增
                    </el-button>
                </el-col>
                <!-- <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['crm:product:edit']">
                        修改
                    </el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['crm:product:remove']">
                        删除
                    </el-button>
                </el-col> -->
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['crm:product:export']">
                        导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table :border="Global.tableShowBorder" v-loading="loading" :data="productList" @selection-change="handleSelectionChange">
                <!-- <el-table-column type="selection" width="55" align="center"/> -->
                <el-table-column label="产品名称" align="center" prop="productName"/>
                <el-table-column label="产品编码" align="center" prop="productCode"/>
                <el-table-column label="产品分类" align="center" prop="categoryName"/>
                <el-table-column label="单位" align="center" prop="unit"/>
                <el-table-column label="价格" align="center" prop="price"/>
                <el-table-column label="描述" align="center" prop="description"/>
                <el-table-column label="状态" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.crm_product_status" :value="scope.row.status"/>
                    </template>
                </el-table-column> 
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['crm:product:edit']">
                            修改
                        </el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['crm:product:remove']">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改产品对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="产品名称" prop="productName">
                    <el-input v-model="form.productName" placeholder="请输入产品名称"/>
                </el-form-item>
                <el-form-item label="产品编码" prop="productCode">
                    <el-input v-model="form.productCode" placeholder="请输入产品编码"/>
                </el-form-item>
                <el-form-item label="产品分类" prop="categoryId">
                    <el-select v-model="form.categoryId" placeholder="请选择产品分类" clearable @change="changeCategory">
                        <el-option v-for="cate in productCategoryList" :key="cate.categoryId" :label="cate.categoryName" :value="cate.categoryId"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-select v-model="form.unit" placeholder="请选择计量单位">
                        <el-option v-for="dict in dict.type.common_unit" :key="dict.label" :label="dict.label" :value="dict.label"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="form.price" type="number" placeholder="请选择单位"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.crm_product_status" :key="dict.value" :label="dict.value">{{ dict.label }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注" prop="description">
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
import {listProduct,getProduct,addProduct,updateProduct,delProduct} from "@/api/crm/product";
import {listProductCategoryAll} from "@/api/crm/productCategory";

export default {
    name: "Product",
    dicts: ['sys_normal_disable','crm_product_status','common_unit'],
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
            // 产品表格数据
            productList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                productName: null,
                productCode: null,
                pageNum: 1,
                pageSize: 20,
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                productName: [
                    {required: true, message: "产品名称不能为空", trigger: "change"}
                ],
                categoryId: [
                    {required: true, message: "产品分类不能为空", trigger: "blur"}
                ]
            },
            //产品分类list
            productCategoryList: []
        };
    },
    created() {
        this.getList();
        this.getProductCategoryList();
    },
    methods: {
        /** 查询产品 */
        getList() {
            this.loading = true;
            listProduct(this.queryParams).then(response => {
                this.productList = response.rows;
                this.total = response.total;
                this.loading = false;
            });
        },
         /** 查询产品分类 */      
        getProductCategoryList(){
            listProductCategoryAll().then(response => {
                this.productCategoryList = response.data;
                console.log(this.productCategoryList);
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
                productName: null,
                productCode: null,
                categorySort: null,
                status: "0",
                createBy: null,
                createTime: null,
                updateBy: null,
                updateTime: null,
                remark: null
            };
            this.resetForm("form");
        },
        changeCategory(category){
            console.log(category);
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
            this.ids = selection.map(item => item.productId);
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
            const id = row.productId || this.ids
            getProduct(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改产品";
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.productId != null) {
                        updateProduct(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addProduct(this.form).then(response => {
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
            const ids = row.productId || this.ids;
            this.$modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(function () {
                return delProduct(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/product/export', {
                ...this.queryParams
            }, `product_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
