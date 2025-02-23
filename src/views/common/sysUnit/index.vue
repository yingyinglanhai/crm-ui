<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="计量单位" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入计量单位" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="基础单位" prop="basicUnit">
                <el-input v-model="queryParams.basicUnit" placeholder="请输入基础单位" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="启用" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择启用" clearable>
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
                    <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['common:sysUnit:add']">新增</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['common:sysUnit:edit']">修改</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['common:sysUnit:remove']">删除</el-button>
                </el-col>
                <el-col :span="1.5">
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['common:sysUnit:export']">导出</el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="unitList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"/>
                <el-table-column label="基础单位" width="100" align="center" prop="basicUnit"/>
                <el-table-column label="计量单位" align="center" prop="name"/>
                <el-table-column label="副单位1" width="150" align="center" prop="otherUnitOne">
                    <template slot-scope="scope">
                        <span>{{ scope.row.otherUnitOne&&scope.row.ratioOne?(scope.row.otherUnitOne + "=" + scope.row.ratioOne + scope.row.basicUnit):"" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="副单位2" width="150"  align="center" prop="otherUnitTwo">
                    <template slot-scope="scope">
                        <span>{{ scope.row.otherUnitTwo&&scope.row.ratioTwo?(scope.row.otherUnitTwo + "=" + scope.row.ratioTwo + scope.row.basicUnit):"" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="副单位3" width="150"  align="center" prop="otherUnitThree">
                    <template slot-scope="scope">
                        <span>{{ scope.row.otherUnitThree&&scope.row.ratioThree?(scope.row.otherUnitThree + "=" + scope.row.ratioThree + scope.row.basicUnit):"" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="副单位4" width="150"  align="center" prop="otherUnitFour">
                    <template slot-scope="scope">
                        <span>{{ scope.row.otherUnitFour&&scope.row.ratioFour?(scope.row.otherUnitFour + "=" + scope.row.ratioFour + scope.row.basicUnit):"" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="副单位5" width="150"  align="center" prop="otherUnitFive">
                    <template slot-scope="scope">
                        <span>{{ scope.row.otherUnitFive&&scope.row.ratioFive?(scope.row.otherUnitFive + "=" + scope.row.ratioFive + scope.row.basicUnit):"" }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="副单位6" width="150"  align="center" prop="otherUnitSix">
                    <template slot-scope="scope">
                        <span>{{ scope.row.otherUnitSix&&scope.row.ratioSix?(scope.row.otherUnitSix + "=" + scope.row.ratioSix + scope.row.basicUnit):"" }}</span>
                    </template>
                </el-table-column>
    <!--            <el-table-column label="比例1" align="center" prop="ratioOne"/>-->
    <!--            <el-table-column label="比例2" align="center" prop="ratioTwo"/>-->
    <!--            <el-table-column label="比例3" align="center" prop="ratioThree"/>-->
    <!--            <el-table-column label="比例4" align="center" prop="ratioFour"/>-->
    <!--            <el-table-column label="比例5" align="center" prop="ratioFive"/>-->
    <!--            <el-table-column label="比例6" align="center" prop="ratioSix"/>-->
                <el-table-column label="启用" width="150" align="center" prop="status">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150" align="center" class-name="small-padding fixed-width">
                    <template slot-scope="scope">
                        <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['common:sysUnit:edit']">修改</el-button>
                        <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['common:sysUnit:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 添加或修改计量单位对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="750px" append-to-body>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-col :span="24">
                    <el-form-item label="计量单位" prop="name">
                        <el-input v-model="form.name" placeholder="请输入计量单位" readonly />
                    </el-form-item>
                    <el-form-item label="基础单位" prop="basicUnit">
                        <el-input v-model="form.basicUnit" placeholder="请输入基础单位"/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="副单位1" prop="otherUnitOne">
                        <el-input v-model="form.otherUnitOne" placeholder="请输入副单位1"/>
                    </el-form-item>
                    <el-form-item label="副单位2" prop="otherUnitTwo">
                        <el-input v-model="form.otherUnitTwo" placeholder="请输入副单位2"/>
                    </el-form-item>
                    <el-form-item label="副单位3" prop="otherUnitThree">
                        <el-input v-model="form.otherUnitThree" placeholder="请输入副单位3"/>
                    </el-form-item>
                    <el-form-item label="副单位4" prop="otherUnitFour">
                        <el-input v-model="form.otherUnitFour" placeholder="请输入副单位4"/>
                    </el-form-item>
                    <el-form-item label="副单位5" prop="otherUnitFive">
                        <el-input v-model="form.otherUnitFive" placeholder="请输入副单位5"/>
                    </el-form-item>
                    <el-form-item label="副单位6" prop="otherUnitSix">
                        <el-input v-model="form.otherUnitSix" placeholder="请输入副单位6"/>
                    </el-form-item>
                </el-col>
<!--                <el-col :span="2">-->
<!--                    <el-col :span="24" prop="ratioOne" style="text-align: center">-->
<!--                        =-->
<!--                    </el-col>-->
<!--                </el-col>-->
                <el-col :span="12">
                    <el-form-item label="=" prop="ratioOne" label-width="35px">
                        <el-input v-model="form.ratioOne" placeholder="请输入比例1">
                            <template slot="append">基础单位</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="=" prop="ratioTwo" label-width="35px">
                        <el-input v-model="form.ratioTwo" placeholder="请输入比例2">
                            <template slot="append">基础单位</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="=" prop="ratioThree" label-width="35px">
                        <el-input v-model="form.ratioThree" placeholder="请输入比例3">
                            <template slot="append">基础单位</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="=" prop="ratioFour" label-width="35px">
                        <el-input v-model="form.ratioFour" placeholder="请输入比例4">
                            <template slot="append">基础单位</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="=" prop="ratioFive" label-width="35px">
                        <el-input v-model="form.ratioFive" placeholder="请输入比例5">
                            <template slot="append">基础单位</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="=" prop="ratioSix" label-width="35px">
                        <el-input v-model="form.ratioSix" placeholder="请输入比例6">
                            <template slot="append">基础单位</template>
                        </el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="启用" prop="status">
                        <el-radio-group v-model="form.status">
                            <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{dict.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {listUnit, getUnit, delUnit, addUnit, updateUnit} from "@/api/common/sysUnit";
export default {
    name: "Unit",
    dicts: ['sys_normal_disable'],
    data() {
        var validateNum = (rule, value, callback)=>{
            if(value&&isNaN(value)){
                callback(new Error('请输入数字'));
            }else{
                callback();
            }
        }
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
            // 计量单位表格数据
            unitList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                name: null,
                basicUnit: null,
                otherUnitOne: null,
                otherUnitTwo: null,
                otherUnitThree: null,
                otherUnitFour: null,
                otherUnitFive: null,
                otherUnitSix: null,
                ratioOne: null,
                ratioTwo: null,
                ratioThree: null,
                ratioFour: null,
                ratioFive: null,
                ratioSix: null,
                status: null,
                tenantId: null,
                deleteFlag: null
            },
            // 表单参数
            form: {status: 0},
            // 表单校验
            rules: {
                name: [
                    {required: true, message: "计量单位不能为空", trigger: "blur"}
                ],
                basicUnit: [
                    {required: true, message: "基础单位不能为空", trigger: "blur"}
                ],
                ratioOne: [
                    {validator: validateNum, trigger: 'blur'},
                ],
                ratioTwo: [
                    {validator: validateNum, trigger: 'blur'},
                ],
                ratioThree: [
                    {validator: validateNum, trigger: 'blur'},
                ],
                ratioFour: [
                    {validator: validateNum, trigger: 'blur'},
                ],
                ratioFive: [
                    {validator: validateNum, trigger: 'blur'},
                ],
                ratioSix: [
                    {validator: validateNum, trigger: 'blur'},
                ],
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询计量单位列表 */
        getList() {
            this.loading = true;
            listUnit(this.queryParams).then(response => {
                this.unitList = response.rows;
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
                basicUnit: null,
                otherUnitOne: null,
                otherUnitTwo: null,
                otherUnitThree: null,
                otherUnitFour: null,
                otherUnitFive: null,
                otherUnitSix: null,
                ratioOne: null,
                ratioTwo: null,
                ratioThree: null,
                ratioFour: null,
                ratioFive: null,
                ratioSix: null,
                status: "0",
                tenantId: null,
                deleteFlag: null
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
            this.title = "添加计量单位";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            const id = row.id || this.ids
            getUnit(id).then(response => {
                this.form = response.data;
                this.open = true;
                this.title = "修改计量单位";
            });
        },
        /** 提交按钮 */
        submitForm() {
            if(this.form.basicUnit){
                let arr = [];
                if(this.form.otherUnitOne&&this.form.ratioOne){
                    arr.push("("+this.form.otherUnitOne+"="+this.form.ratioOne+this.form.basicUnit+")")
                }
                if(this.form.otherUnitTwo&&this.form.ratioTwo){
                    arr.push("("+this.form.otherUnitTwo+"="+this.form.ratioTwo+this.form.basicUnit+")")
                }
                if(this.form.otherUnitThree&&this.form.ratioThree){
                    arr.push("("+this.form.otherUnitThree+"="+this.form.ratioThree+this.form.basicUnit+")")
                }
                if(this.form.otherUnitFour&&this.form.ratioFour){
                    arr.push("("+this.form.otherUnitFour+"="+this.form.ratioFour+this.form.basicUnit+")")
                }
                if(this.form.otherUnitFive&&this.form.ratioFive){
                    arr.push("("+this.form.otherUnitFive+"="+this.form.ratioFive+this.form.basicUnit+")")
                }
                if(this.form.otherUnitSix&&this.form.ratioSix){
                    arr.push("("+this.form.otherUnitSix+"="+this.form.ratioSix+this.form.basicUnit+")")
                }
                if(arr.length>0){
                    this.form.name = this.form.basicUnit + "/" + arr.join("/")
                }else{
                    this.form.name = this.form.basicUnit
                }
            }

            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateUnit(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.open = false;
                            this.getList();
                        });
                    } else {
                        addUnit(this.form).then(response => {
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
            this.$modal.confirm('是否确认删除计量单位编号为"' + ids + '"的数据项？').then(function () {
                return delUnit(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('common/sysUnit/export', {
                ...this.queryParams
            }, `unit_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>
