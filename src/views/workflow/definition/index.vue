<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
            <el-form-item label="流程编码" prop="key">
                <el-input v-model="queryParams.key" placeholder="请输入流程编码" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="流程名称" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入流程名称" clearable @keyup.enter.native="handleQuery"/>
            </el-form-item>
            <el-form-item label="表单分类" prop="category">
                <el-select v-model="queryParams.category" placeholder="请选择表单分类" clearable>
                    <el-option v-for="dict in dict.type.oa_customform_category" :key="dict.value" :label="dict.label"
                               :value="dict.value"/>
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
                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['oa:definition:export']">导出
                    </el-button>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
            </el-row>

            <el-table  :border="Global.tableShowBorder" v-loading="loading" :data="definitionList" @selection-change="handleSelectionChange">
                <el-table-column label="流程名称" align="center" prop="name"/>
                <el-table-column label="流程编码" align="center" prop="key"/>
                <el-table-column label="流程版本" align="center" prop="version" width="150"/>
                <el-table-column label="所属分类" align="center" prop="category">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.oa_customform_category" :value="scope.row.category"/>
                    </template>
                </el-table-column>
                <el-table-column label="流程描述" align="center" prop="description"/>
                <el-table-column label="部署时间" align="center" prop="deploymentTime">
                    <template slot-scope="scope">
                        <span>{{ parseTime(scope.row.deploymentTime) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="流程定义" align="center" prop="resourceName" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="readResourceXml(scope.row.id,scope.row.resourceName)">{{scope.row.resourceName}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="流程图" align="center" prop="diagramResourceName" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <el-link type="primary" @click="readResourceImg(scope.row.id,scope.row.diagramResourceName)">{{scope.row.diagramResourceName}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="流程定义状态" align="center" prop="suspensionState" width="150">
                    <template slot-scope="scope">
                        <dict-tag :options="dict.type.oa_definition_suspendactive_state" :value="scope.row.suspensionState"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200">
                    <template slot-scope="scope">
                        <el-button v-show="scope.row.suspensionState==1" style="color: #ffba00" size="mini" type="text" icon="el-icon-video-pause"
                                   @click="suspendOrActiveApply(scope.row.id,scope.row.suspensionState)" v-hasPermi="['oa:definition:edit']">挂起</el-button>
                        <el-button v-show="scope.row.suspensionState==2" style="color: #13ce66" size="mini" type="text" icon="el-icon-video-play"
                                   @click="suspendOrActiveApply(scope.row.id,scope.row.suspensionState)" v-hasPermi="['oa:definition:edit']">激活</el-button>
<!--                        <el-button size="mini" type="text" icon="el-icon-refresh"-->
<!--                                   @click="convert2Model(scope.row)" v-hasPermi="['oa:definition:edit']">转为流程图</el-button>-->
                        <el-button size="mini" type="text" icon="el-icon-delete"
                                   @click="handleDelete(scope.row)" v-hasPermi="['oa:definition:remove']">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
        </TableCard>
        <!-- 流程图图片弹窗 -->
        <el-dialog :title="title" :visible.sync="showReadFlowImg" append-to-body>
            <div>
                <el-image :src="'data:image/png;base64,'+flowImageBase64"></el-image>
            </div>
        </el-dialog>
        <!-- 流程xml预览 -->
        <el-dialog :title="xmlTitle" :visible.sync="showXmlDialog" append-to-body>
            <el-input type="textarea" :rows="30" placeholder="请输入内容" v-model="xmlData"></el-input>
        </el-dialog>
    </div>
</template>

<script>
import {listDefinition, getDefinition, delDefinition, addDefinition, updateDefinition,
    convert2Model, suspendOrActiveApply,readResourceImg,readResourceXml} from "@/api/workflow/definition";
export default {
    name: "Definition",
    dicts: ['oa_definition_suspendactive_state','oa_customform_category'],
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
            // 流程定义表格数据
            definitionList: [],
            // 弹出层标题
            title: "",
            xmlData:"",
            xmlTitle:"",
            // 是否显示弹出层
            showReadFlowImg: false,
            showXmlDialog:false,
            flowImageBase64:"",
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                rev: null,
                category: null,
                name: null,
                key: null,
                version: null,
                deploymentId: null,
                resourceName: null,
                dgrmResourceName: null,
                description: null,
                hasStartFormKey: null,
                hasGraphicalNotation: null,
                suspensionState: null,
                tenantId: null,
                engineVersion: null,
                derivedFrom: null,
                derivedFromRoot: null,
                derivedVersion: null
            },
            // 表单参数
            form: {},
            // 表单校验
            rules: {
                key: [
                    {required: true, message: "流程KEY不能为空", trigger: "blur"}
                ],
                version: [
                    {required: true, message: "流程版本不能为空", trigger: "blur"}
                ],
                derivedVersion: [
                    {required: true, message: "$comment不能为空", trigger: "blur"}
                ]
            },
            cmOptions: {
                tabSize: 4,// tab的空格个数
                theme: 'dracula',//主题样式
                lineNumbers: true,//是否显示行数
                lineWrapping: true, //是否自动换行
                styleActiveLine: true,//line选择是是否加亮
                matchBrackets: true,//括号匹配
                mode: "vue", //实现javascript代码高亮
                readOnly: false//只读
            }
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询流程定义列表 */
        getList() {
            this.loading = true;
            listDefinition(this.queryParams).then(response => {
                console.log("返回的列表数据："+JSON.stringify(response))
                this.definitionList = response.rows;
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
                rev: null,
                category: null,
                name: null,
                key: null,
                version: null,
                deploymentId: null,
                resourceName: null,
                dgrmResourceName: null,
                description: null,
                hasStartFormKey: null,
                hasGraphicalNotation: null,
                suspensionState: null,
                tenantId: null,
                engineVersion: null,
                derivedFrom: null,
                derivedFromRoot: null,
                derivedVersion: null
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
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.deploymentId || this.ids;
            this.$modal.confirm('是否确认删除流程定义编号为"' + ids + '"的数据项？').then(function () {
                return delDefinition(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('oa/definition/export', {
                ...this.queryParams
            }, `definition_${new Date().getTime()}.xlsx`)
        },
        /** 转模型 **/
        convert2Model(row){
            this.$modal.confirm('确认要转换为模型吗？').then(()=> {
                convert2Model(row.id).then(res=>{
                    if(200==res.code){
                        this.$modal.msgSuccess("转换成功");
                    }
                })
            }).then((res) => {
                this.getList();
            }).catch(() => {
            });
        },
        /** 暂停、激活 */
        suspendOrActiveApply(id,status){
            let suspendOrActive = status === '2' ? '激活' : '挂起' ;
            this.$modal.confirm('确认要"' + suspendOrActive + '"流程定义吗？').then( (res)=> {
                let data = {};
                data.id = id;
                data.suspensionState = status;
                suspendOrActiveApply(data).then(res=>{
                    console.log("第一个then："+JSON.stringify(res))
                    if(200==res.code){
                        this.$modal.msgSuccess(suspendOrActive+"成功");
                        this.getList();
                    }
                })
            }).then(()=>{
                this.getList();
            }).catch(() => {
            });
        },
        /*** 读流程图**/
        readResourceImg(id,resourceName){
            readResourceImg(id,resourceName).then(res=>{
                console.log(res);
                if(200==res.code){
                    this.title = resourceName;
                    this.flowImageBase64 = res.data;
                    this.showReadFlowImg = true;
                }
            })
        },
        /*** 读xml**/
        readResourceXml(id,resourceName){
            readResourceXml(id,resourceName).then(res=>{
                console.log(res);
                if(200==res.code){
                    this.xmlTitle = resourceName;
                    this.xmlData = res.data;
                    this.showXmlDialog = true;
                }
            })
        }
    }
};
</script>
