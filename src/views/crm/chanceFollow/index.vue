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
            <el-table v-loading="loading" :data="chanceList" :show-header="true" @expand-change="expandChange">
                <el-table-column type="expand" >
                    <template slot-scope="scope">
                    <el-card style="padding-left: 30px; padding-right: 0px; background:#ececec">
                        <el-table :border="Global.tableShowBorder" v-loading="loading" :data="scope.row.chanceFollowList" :row-key="String(scope.row.chanceId)">                           
                            <el-table-column label="跟进日期" align="center" width="100" prop="followDate"/>
                            <el-table-column label="跟进方式" align="center" width="100" prop="followWay"/>   
                            <el-table-column label="联系人" align="center" width="100" prop="contacterName"/>
                            <el-table-column label="沟通内容" align="center" prop="followContent"/>
                            <el-table-column label="下次跟进时间" align="center" width="100" prop="nextFollowDate"/>   
                            <el-table-column label="客户满意度" align="center" width="100" prop="satisfiedLevel"/>  
                            <el-table-column label="操作" align="center" fixed="right" width="150" class-name="small-padding fixed-width">   
                                <template slot-scope="scope2">
                                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope2.row,scope.row)" v-hasPermi="['crm:chanceFollow:edit']">
                                    修改
                                    </el-button>
                                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope2.row,scope.row)" v-hasPermi="['crm:chanceFollow:remove']">
                                    删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="商机标题"  prop="chanceTitle"/>    
                <el-table-column align="center" label="客户名称"  prop="customerName"/> 
                <el-table-column align="center" label="发现时间"  prop="findDate"/> 
                <el-table-column align="center" label="期望金额"  prop="expectMoney"/> 
                <el-table-column align="center" label="期望签约时间"  prop="expectSignDate"/> 
                <el-table-column align="right" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-plus" v-show="scope.row.showAdd" @click="handleAdd(scope.row)" v-hasPermi="['crm:chanceFollow:add']">
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
                <el-form-item label="跟进时间" prop="followDate">
                    <el-date-picker v-model="form.followDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                </el-form-item> 
                <el-form-item label="跟进方式" prop="followWay">
                    <el-select v-model="form.followWay" placeholder="请选择跟进方式" clearable >
                        <el-option v-for="dict in dict.type.crm_follow_way" :key="dict.value" :label="dict.label" :value="dict.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人" prop="contacterName">
                    <el-select v-model="form.contacterName" @change="selectChange" placeholder="请选择联系人"  >
                        <el-option v-for="item in this.contacterList" :key="item.contacterId" :label="item.contacterName" :value="item.contacterId"/>
                    </el-select>
                </el-form-item>   
                <el-form-item label="沟通内容" prop="followContent">
                    <el-input v-model="form.followContent" type="textarea" :rows="5" placeholder="请输入内容"/>
                </el-form-item>
                <el-form-item label="下次跟进时间" prop="nextFollowDate">
                    <el-date-picker v-model="form.nextFollowDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期" clearable />
                </el-form-item> 
                <el-form-item label="客户满意度" prop="satisfiedLevel">
                    <el-select v-model="form.satisfiedLevel" placeholder="请选择满意度" clearable >
                        <el-option v-for="dict in dict.type.crm_customer_pleased_level" :key="dict.value" :label="dict.label" :value="dict.label"/>
                    </el-select>
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
import {listChance} from "@/api/crm/chance";
import {listChanceFollowByChanceId,getChanceFollow,addChanceFollow,updateChanceFollow,delChanceFollow} from "@/api/crm/chanceFollow";
import {listContacterByCustomerId} from "@/api/crm/contacter";
export default {
    name: "ChanceFollow",
    dicts: ['crm_customer_pleased_level','crm_follow_way'],
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
            // 商机表格数据
            chanceList: [],
            // 联系人列表数据
            contacterList: [],
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
            // 当前行
            currentRow: {},
            // 表单校验
            rules: {
                followDate: [
                    {required: true, message: "跟进时间不能为空", trigger: "blur"}
                ],
                followWay: [
                    {required: true, message: "跟进方式不能为空", trigger: "blur"}
                ],
                contacterName: [
                    {required: true, message: "联系人姓名不能为空", trigger: "change"}
                ],
                followContent: [
                    {required: true, message: "沟通内容不能为空", trigger: "blur"}
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
            listChance(this.queryParams).then(response => {
                //初始化customer的contacters，全部为空，为了dom渲染
                response.rows.map(item => {
                    item.chanceFollowList = [];
                    //不显示新增按钮
                    item.showAdd = false;
                });
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
            this.title = "添加";
            this.currentRow = row;
            this.getContacterList(row);
        },
        /** 修改按钮操作 */
        handleUpdate(row,parentRow) {
            this.reset();
            this.getContacterList(parentRow);
            debugger;
            const id = row.followId || this.ids
            getChanceFollow(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改信息";
                this.currentRow = parentRow;
            });
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.followId != null) {
                        updateChanceFollow(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getChanceFollowList(this.currentRow);
                        });
                    } else {
                        this.form.chanceId = this.currentRow.chanceId;
                        addChanceFollow(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.open = false;
                            this.getChanceFollowList(this.currentRow);
                        });
                    }
                }
            });
        },
        /** 删除按钮操作 */
        handleDelete(row,parentRow) {
            const id = row.followId;
            this.$modal.confirm('是否确认删除编号为"' + id + '"的数据项？').then(function () {
                return delChanceFollow(id);
            }).then(() => {
                this.getChanceFollowList(parentRow);
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('crm/chanceFollow/export', {
                ...this.queryParams
            }, `chanceFollow_${new Date().getTime()}.xlsx`)
        },
        //获取行对应的chanceFollowlist
        getChanceFollowList(row){
            listChanceFollowByChanceId(row.chanceId).then(response => {
                row.chanceFollowList = response.data;
            });
        },
        //获取指定客户的联系人列表
        getContacterList(row){
            const customerId = row.customerId;
            listContacterByCustomerId(customerId).then(response => {
                this.contacterList = [];
                this.contacterList = response.data;
            });
        },
        selectChange(val){
            this.form.contacterId = val;
        },
        expandChange(row, expandedRows){
            //判断当前行row在不在expandedRows里
            const r = expandedRows.some(obj => obj.chanceId === row.chanceId);
            if (r) {
                //如果 r=true，说明是展开
                this.getChanceFollowList(row);
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
