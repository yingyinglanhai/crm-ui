<template>
    <div class="selectUser">
        <el-row :gutter="10">
            <!--部门数据-->
            <el-col :span="6" :xs="24">
                <TableCard>
                    <div class="head-container">
                        <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search" style="margin-bottom: 20px"/>
                    </div>
                    <div class="head-container">
                        <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" default-expand-all highlight-current @node-click="handleNodeClick"/>
                    </div>
                </TableCard>
            </el-col>
            <!--用户数据-->
            <el-col :span="18" :xs="24">
                <TableCard>
                    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
                        <el-form-item label="用户名称" prop="userName">
                            <el-input v-model="queryParams.userName" placeholder="请输入用户名称" clearable style="width: 240px" @keyup.enter.native="handleQuery"/>
                        </el-form-item>
                        <el-form-item label="手机号码" prop="phonenumber">
                            <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 240px" @keyup.enter.native="handleQuery"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索
                            </el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                        </el-form-item>
                    </el-form>
                    <el-table :border="Global.tableShowBorder" v-loading="loading" :data="userList" ref="table" @select="select" @selection-change="handleSelectionChange" @row-click="clickRow">
                        <el-table-column type="selection" width="50" align="center"/>
                        <el-table-column label="用户名称" align="center" key="userName" prop="userName"   :show-overflow-tooltip="true"/>
                        <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"   :show-overflow-tooltip="true"/>
                        <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName" :show-overflow-tooltip="true"/>
<!--                        <el-table-column label="状态" align="center" key="status">-->
<!--                            <template slot-scope="scope">-->
<!--                                <el-switch v-model="scope.row.status" active-value="0" inactive-value="1" :disabled="true"></el-switch>-->
<!--                            </template>-->
<!--                        </el-table-column>-->
                    </el-table>
                    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>
                </TableCard>
            </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer" style="text-align: right; margin-top: 20px;margin-bottom:10px">
            <el-button type="primary" @click="selectUser" >确 认</el-button>
            <el-button @click="close">关 闭</el-button>
        </div>
    </div>
</template>

<script>
import {listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus} from "@/api/system/user";
import {getToken} from "@/utils/auth";
import {treeselect} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
    name: "SelectOneUser",
    dicts: ['sys_normal_disable', 'sys_user_sex'],
    components: {Treeselect},
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
            // 用户表格数据
            userList: null,
            // 部门树选项
            deptOptions: [],
            // 部门名称
            deptName: undefined,
            // 日期范围
            dateRange: [],
            // 职位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label"
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 20,
                userName: undefined,
                phonenumber: undefined,
                status: 0,
                deptId: undefined
            },
            selectedUser:{}
        };
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        this.getList();
        this.getTreeselect();
    },
    methods: {
        /** 查询用户列表 */
        getList() {
            this.loading = true;
            listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                    this.userList = response.rows;
                    this.total = response.total;
                    this.loading = false;


                    //回显
                    if(this.selectedUser){
                        console.log("是否需要回显")
                        console.log(this.selectedUser)
                        this.userList.forEach((item,index) => {
                            if(item.userId == this.selectedUser.userId){
                                this.$nextTick(() => {
                                    this.$refs.table.toggleRowSelection(item);
                                })
                            }
                        })
                    }

                }
            );
        },
        /** 查询部门下拉树结构 */
        getTreeselect() {
            treeselect().then(response => {
                this.deptOptions = response.data;
            });
        },
        // 筛选节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 节点单击事件
        handleNodeClick(data) {
            this.queryParams.deptId = data.id;
            this.handleQuery();
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.resetForm("queryForm");
            this.handleQuery();
        },
        // 多选框选中数据改变时候触发
        handleSelectionChange(selection) {
            if(selection && selection.length>0){
                // console.log("选中一行");
                // console.log(JSON.stringify(selection));
                // console.log(selection[selection.length - 1].nickName);
                this.selectedUser = selection[selection.length - 1];
            }

        },
        // 点击前面复选框时候触发
        select(selection, row) {
            // console.log("section:"+JSON.stringify(selection))
            // console.log("row:"+JSON.stringify(row))
            // 清除 所有勾选项
            this.$refs.table.clearSelection()
            // 当表格数据都没有被勾选的时候 就返回
            // 主要用于将当前勾选的表格状态清除
            if(selection.length == 0) return
            this.$refs.table.toggleRowSelection(row, true);
        },
        // 选择行的时候触发
        clickRow(row) {
            const users = this.selectedUser
            this.$refs.table.clearSelection()
            if(users && users.length == 1 ) {
                users.forEach(item => {
                    // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
                    if (item.userId == row.userId) {
                        this.$refs.table.toggleRowSelection(row, false);
                    }
                    // 不然就让当前的一行勾选
                    else {
                        this.$refs.table.toggleRowSelection(row, true);
                    }
                })
            }
            else {
                this.$refs.table.toggleRowSelection(row, true);
            }
        },
        selectUser(){
            this.$emit("selectedOneUser",this.selectedUser);
        },
        close(){
            console.log("关闭")
            this.$emit("closeSelectOneUser");
        }
    }
};
</script>
<style scoped>
/deep/ .el-table__header-wrapper  .el-checkbox{
    display:none
}
</style>
<style scoped lang="scss">
    .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
        box-shadow: none;
    }
    .selectUser{
        padding: 10px;
    }
</style>
