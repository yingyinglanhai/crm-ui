<template>
    <div>
        <div class="todoInfo" @click="goTodoList">
            <span class="info">
                您有待处理任务<span style="font-size: 18px;color: #f56c6c;font-weight: bold;">{{todoTaskCount}}</span>条，请您及时处理
            </span>
        </div>

        <el-tabs type="border-card" :tab-position="'top'" v-model="defaultTab" style="height: calc(100vh - 70px)" :stretch="true">
            <el-tab-pane name="notRead">
                <span slot="label">
                    <el-badge :value="notReadTotal?notReadTotal:0" :max="99" class="notReadMessageCount">
                        <i class="el-icon-s-management"></i> 未读消息
                    </el-badge>
                </span>
                <div style="text-align: right;">
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="allMessageRead()">
                        全部已读
                    </el-button>
                </div>

                <div style="border: 1px solid #EBEEF5">
                    <el-table :border="false" v-loading="notReadLoading" :data="notReadMessageList" @row-click="openMessageDialog"
                              height="calc(100vh - 235px)"
                              :show-header="false">
                        <el-table-column label="发件人标题" align="left" prop="title">
                            <template slot-scope="scope">
                                <div class="row">
                                    <div class="title">
                                        {{scope.row.title}}
                                    </div>
                                    <div class="content">
                                        {{scope.row.content}}
                                    </div>
                                    <div class="time">
                                        {{parseTime(scope.row.sendTime, '{y}-{m}-{d}')}}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>


                <pagination v-show="notReadTotal>0" :total="notReadTotal"
                            :layout="layout"
                            :pager-count="5"
                            small
                            :background="false"
                            :page.sync="notReadQuery.pageNum"
                            :limit.sync="notReadQuery.pageSize" @pagination="getNotReadMessageList"/>
            </el-tab-pane>
            <el-tab-pane name="haveRead">
                <span slot="label"><i class="el-icon-s-management"></i> 已读消息</span>

                <div style="border: 1px solid #EBEEF5">
                    <el-table :border="false" v-loading="haveReadLoading" :data="haveReadMessageList" @row-click="openMessageDialog"
                              height="calc(100vh - 207px)"
                              :show-header="false">
                        <el-table-column label="发件人标题" align="left" prop="title">
                            <template slot-scope="scope">
                                <div class="row">
                                    <div class="title">
                                        {{scope.row.title}}
                                    </div>
                                    <div class="content">
                                        {{scope.row.content}}
                                    </div>
                                    <div class="time">
                                        {{parseTime(scope.row.sendTime, '{y}-{m}-{d}')}}
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <pagination v-show="haveReadTotal>0" :total="haveReadTotal"
                            :layout="layout"
                            :pager-count="5"
                            small
                            :background="false"
                            :page.sync="haveReadQuery.pageNum" :limit.sync="haveReadQuery.pageSize" @pagination="getHaveReadMessageList"/>

            </el-tab-pane>
        </el-tabs>


        <el-dialog :visible.sync="showMessageDialog" width="800px" append-to-body>
            <div style="min-height: 500px">
                <div style="font-weight: bold;text-align: center">{{showMessage.title}}</div>
                <div style="font-weight: bold;text-align: right;color: #aaaaaa;">{{parseTime(showMessage.sendTime, '{y}-{m}-{d}')}}</div>
                <div style="text-align: left">{{showMessage.content}}</div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {queryTodoTaskCount, listSysMessage, allMessageRead, readSysMessage} from '@/api/common/sysMessage'
export default {
    data() {
        return {
            todoTaskCount:0,
            defaultTab:"notRead",
            layout:'prev, pager, next',

            // 遮罩层
            notReadLoading: true,
            // 总条数
            notReadTotal: 0,
            // 站内信表格数据
            notReadMessageList: [],
            haveReadLoading: true,
            haveReadTotal: 0,
            haveReadMessageList: [],


            notReadQuery: {
                pageNum: 1,
                pageSize: 30,
                orderByColumn: "sendTime",
                isAsc: "descending",
                ifRead: "N"
            },
            haveReadQuery: {
                pageNum: 1,
                pageSize: 30,
                orderByColumn: "sendTime",
                isAsc: "descending",
                ifRead: "Y"
            },
            showMessageDialog:false,
            showMessage:{}
        }
    },
    created() {
        this.getTodoTaskCount();

        this.getNotReadMessageList();
        this.getHaveReadMessageList();
    },
    methods:{
        //待办数量
        getTodoTaskCount(){
            queryTodoTaskCount().then(res=>{
                this.todoTaskCount = res.data;
            })
        },
        //跳转到待办
        goTodoList(){
            this.$router.push({path: "/mySpace/myTask"})
        },
        //全部已读
        allMessageRead(){
            this.$modal.confirm('将站内信全部标记为已读吗？').then( ()=> {
                allMessageRead().then(res=>{
                    this.getNotReadMessageList();
                    this.getHaveReadMessageList();
                })
            })
        },



        //获取未读的消息
        getNotReadMessageList(){
            this.notReadLoading = true;
            listSysMessage(this.notReadQuery).then(response => {
                this.notReadMessageList = response.rows;
                this.notReadTotal = response.total;
                this.notReadLoading = false;
            });
        },
        //查询已读消息
        getHaveReadMessageList(){
            this.haveReadLoading = true;
            listSysMessage(this.haveReadQuery).then(response => {
                this.haveReadMessageList = response.rows;
                this.haveReadTotal = response.total;
                this.haveReadLoading = false;
            });
        },
        openMessageDialog(row){
            this.showMessageDialog = true;
            this.showMessage = row;
            readSysMessage(row.id).then(res=>{
                this.getNotReadMessageList();
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .todoInfo{
        padding: 12px;
        border: 1px solid #dddddd;
        margin: 10px;
        border-radius: 10px;
        background-color: #f4f4f5;
        cursor: pointer;
        text-align: center;
        .info:hover{
            border-bottom: 1px solid #1ab394;
        }
        .info{
            padding: 0px 10px;
        }
    }

    .row{
        cursor: pointer;
        .title{
            text-align: left;
            font-size: 14px;
            font-weight: bold;
        }
        .content{
            text-align: left;
            font-size: 12px;
            color: #666666;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .time{
            text-align: right;
            font-size: 12px;
            color: #666666;
        }
    }

</style>
<style scoped>
/deep/.notReadMessageCount .el-badge__content.is-fixed{
    top: 10px;
    height: 20px;
    right: 0px;
}
</style>
