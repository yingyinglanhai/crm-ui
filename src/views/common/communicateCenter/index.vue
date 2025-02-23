<template>
    <div class="communicateBook">
        <el-tabs type="border-card" :tab-position="'top'" v-model="defaultTab" style="height: 100vh" :stretch="true">
            <!-- <el-tab-pane name="sysCommBook">
                <span slot="label"><i class="el-icon-s-management"></i> 企业通讯录</span>
                <el-row style="padding-bottom: 5px">
                    <el-input v-model="sysBookQuery.nickName" placeholder="请输入联系人名称" clearable @input="querySysBook"></el-input>
                </el-row>
                <div class="userContainer">
                    <div v-for="user in sysBookList" class="user" @click="openChat(user.userId,user.nickName)">
                        <PLAvatar :avatar="user.avatar" :nickName="user.nickName" :size="60" :messageCount="user.notReadCount"></PLAvatar>
                        <div class="info">
                            <div class="left">
                                <i class="el-icon-user-solid" :class="user.sex=='1'?'woman':'man'"></i>
                                <span class="userName">{{user.nickName}}</span>
                                <div class="item">
                                    <i class="el-icon-phone"></i>
                                    <span class="content">{{user.phone}}</span>
                                </div>
                                <span class="item">
                                    <i class="el-icon-s-promotion"></i>
                                    <span class="content">{{user.email}}</span>
                                </span>
                            </div>
                            <div class="right">
                                <div class="item">{{user.deptName}}</div>
                                <div class="item">{{user.post}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <pagination v-show="sysTotal>0" :total="sysTotal"
                            :layout="layout"
                            :pager-count="5"
                            small
                            :background="false"
                            :page.sync="sysBookQuery.pageNum"
                            :limit.sync="sysBookQuery.pageSize" @pagination="querySysBook"/>
            </el-tab-pane> -->
            <el-tab-pane name="selfCommBook">
                <span slot="label"><i class="el-icon-phone"></i> 个人通讯录</span>
                    <el-input v-model="myBookQuery.name" placeholder="请输入联系人名称" class="queryComm"
                              clearable
                              @input="queryMyCommBook"></el-input>
                    <i class="el-icon-circle-plus-outline addCommBook" @click="handleAdd"></i>

                <div class="userContainer">
                    <div v-for="user in selfBookList" class="user"
                         v-contextmenu:contextMenu
                         @contextmenu.prevent.stop="rightClick(user.id)" @click="viewCommInfo(user.id)">
                        <PLAvatar :avatar="user.avatar" :nickName="user.name" :size="60"></PLAvatar>
                        <div class="info">
                            <div class="left">
                                <i class="el-icon-user-solid" :class="user.sex=='1'?'woman':'man'"></i>
                                <span class="userName">{{user.name}}</span>
                                <div class="item">
                                    <i class="el-icon-phone"></i>
                                    <span class="content">{{user.phone}}</span>
                                </div>
                                <span class="item">
                                    <i class="el-icon-s-promotion"></i>
                                    <span class="content">{{user.email}}</span>
                                </span>
                            </div>
                            <div class="right">
                                <div class="item">{{user.companyName}}</div>
                                <div class="item">{{user.post}}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <pagination v-show="myTotal>0" :total="myTotal"
                            :layout="layout"
                            :pager-count="5"
                            small
                            :background="false"
                            :page.sync="myBookQuery.pageNum"
                            :limit.sync="myBookQuery.pageSize" @pagination="queryMyCommBook"/>
            </el-tab-pane>

        </el-tabs>



<!--        新增个人通讯录-->
        <el-dialog :title="title" :visible.sync="showAddNewComm" width="1000px" append-to-body>
            <el-card shadow="never">
                <el-form ref="form" :model="form" :rules="rules" label-width="120px" :disabled="myCommDialogReadonly">
                    <el-row>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="头像地址" style="min-height: 205px;">
                                <!--  1、ID为空的时候（新增）：需要上传头像 。2、ID不为空的时候(修改)，并且头像为空，需要上传头像。
                                总结，只有只读，头像为空的时候，显示avatar，其他时候都显示upload， -->
                                <image-upload v-if="!(myCommDialogReadonly && util.isEmpty(form.avatar))"
                                              v-model="form.avatar" :limit="1" :disabled="myCommDialogReadonly"/>
                                <el-avatar v-if="myCommDialogReadonly && util.isEmpty(form.avatar)" :size="75"
                                           :style="`font-size: 20px;background-color: ${extractColorByName(form.name)}`"
                                           shape="circle">
                                    {{form.name?form.name.substr(0,1):'空'}}
                                </el-avatar>
                            </el-form-item>
                            <el-form-item label="公司名称" prop="companyName">
                                <el-input v-model="form.companyName" placeholder="请输入公司名称"/>
                            </el-form-item>
                            <el-form-item label="公司地址" prop="companyAddress">
                                <el-input v-model="form.companyAddress" placeholder="请输入公司地址"/>
                            </el-form-item>
                        </el-col>
                        <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
                            <el-form-item label="姓名" prop="name">
                                <el-input v-model="form.name" placeholder="请输入姓名"/>
                            </el-form-item>
                            <el-form-item label="电话" prop="phone">
                                <el-input v-model="form.phone" placeholder="请输入电话"/>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="form.email" placeholder="请输入邮箱"/>
                            </el-form-item>
                            <el-form-item label="身份证号" prop="idNum">
                                <el-input v-model="form.idNum" placeholder="请输入身份证号"/>
                            </el-form-item>
                            <el-form-item label="出生年月" prop="birthDate">
                                <el-date-picker clearable v-model="form.birthDate" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生年月">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="联系地址" prop="address">
                                <el-input v-model="form.address" placeholder="请输入联系地址"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                            <el-form-item label="备注" prop="remark">
                                <el-input v-model="form.remark" type="textarea" :rows="5" placeholder="请输入内容"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>


        <v-contextmenu ref="contextMenu">
            <v-contextmenu-item @click="handleUpdate" ><i class="el-icon-edit-outline"></i><span>修改</span></v-contextmenu-item>
            <v-contextmenu-item @click="collect" ><i class="el-icon-star-off"></i><span>收藏</span></v-contextmenu-item>
            <v-contextmenu-item @click="queryMyCommBook" ><i class="el-icon-refresh-right"></i><span>刷新</span></v-contextmenu-item>
            <v-contextmenu-item @click="handleDelete" ><i class="el-icon-close"></i><span>删除</span></v-contextmenu-item>
        </v-contextmenu>

        <el-drawer title="管理员" :visible.sync="showChat" width="620px" append-to-body>
            <iframe :src="chatUrl" style="width:600px;height:700px;border:none;"></iframe>
        </el-drawer>


    </div>
</template>

<script>
import {querySysCommunicateBook, listHomeBook,getCommunicateBook, delCommunicateBook, addCommunicateBook, updateCommunicateBook} from '@/api/common/communicateBook'
import {getInfo} from '@/api/login'
import PLAvatar from '@/components/Fno/PLAvatar'
export default {
    name: "communicateBook",
    components:{PLAvatar},
    dicts: ['sys_user_sex'],
    data() {
        return {
            currentLoginUserId:"",
            showChat:false,
            chatUrl:"/chat",
            fit:"cover",
            baseUrl: process.env.VUE_APP_BASE_API,
            defaultTab:'selfCommBook',
            sysBookList:[],
            selfBookList:[],
            // sysCommUserName:"",
            // myCommUserName:"",
            layout:'prev, pager, next',
            sysTotal:0,
            sysBookQuery:{
                nickName:"",
                pageNum: 1,
                pageSize: 10,
            },
            myTotal:0,
            myBookQuery:{
                name:"",
                pageNum: 1,
                pageSize: 20,
            },
            // 弹出层标题
            title: "",
            // 弹窗是否可编辑
            myCommDialogReadonly:false,
            // 添加和修改
            showAddNewComm:false,
            // 表单参数
            form: {
                avatar:"",
                name:""
            },
            // 表单校验
            rules: {
                name: [
                    {required: true, message: "姓名不能为空", trigger: "blur"}
                ],
            },
            rightClickUserId:null
        }
    },
    created() {
        //获取企业通讯录
        //this.querySysBook();
        //查询个人通讯录
        this.queryMyCommBook();
        this.getCurrentLoginInfo();
    },
    methods:{
        getCurrentLoginInfo(){
            getInfo().then(res=>{
                this.currentLoginUserId = res.user.userId;
            })
        },
        querySysBook(){
            querySysCommunicateBook(this.sysBookQuery).then(res=>{
                this.sysBookList = res.rows;
                this.sysTotal = res.total;
            })
        },
        queryMyCommBook(){
            // let data = {
            //     name : this.myCommUserName
            // }
            listHomeBook(this.myBookQuery).then(res=>{
                this.selfBookList = res.rows;
                this.myTotal = res.total;
            })
        },
        extractColorByName(name) {
            var temp = [];
            temp.push("#");
            if(name){
                for (let index = 0; index < name.length; index++) {
                    temp.push(parseInt(name[index].charCodeAt(0), 10).toString(16));
                }
                return temp.slice(0, 5).join('').slice(0, 4);
            }else{
                return "#666";
            }
        },
        // 取消按钮
        cancel() {
            this.showAddNewComm = false;
            this.myBookQuery.name = "";
        },
        //
        collect(){
            this.$modal.msgError("开发中.....或，未部署，请联系管理员。");
        },
        /** 提交按钮 */
        submitForm() {
            this.$refs["form"].validate(valid => {
                if (valid) {
                    if (this.form.id != null) {
                        updateCommunicateBook(this.form).then(response => {
                            this.$modal.msgSuccess("修改成功");
                            this.showAddNewComm = false;
                            this.queryMyCommBook();
                        });
                    } else {
                        addCommunicateBook(this.form).then(response => {
                            this.$modal.msgSuccess("新增成功");
                            this.showAddNewComm = false;
                            this.queryMyCommBook();
                        });
                    }
                }
            });
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.myCommDialogReadonly = false;
            this.showAddNewComm = true;
            this.title = "添加通讯录";
        },
        /** 修改按钮操作 */
        handleUpdate() {
            this.reset();
            const id = this.rightClickUserId;
            getCommunicateBook(id).then(response => {
                this.form = response.data;
                this.myCommDialogReadonly = false;
                this.showAddNewComm = true;
                this.title = "修改通讯录";
            });
        },
        // 查看详情
        viewCommInfo(id){
            this.reset();
            getCommunicateBook(id).then(response => {
                this.form = response.data;
                this.myCommDialogReadonly = true;
                this.showAddNewComm = true;
                this.title = "我的通讯录";
            });
        },
        /** 删除按钮操作 */
        handleDelete() {
            const ids = this.rightClickUserId;
            this.$modal.confirm('是否确认删除个人通讯录编号为"' + ids + '"的数据项？').then(function () {
                return delCommunicateBook(ids);
            }).then(() => {
                this.queryMyCommBook();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => {
            });
        },

        rightClick(id){
            this.rightClickUserId = id;
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
                userId: null,
                avatar: null,
                name: null,
                birthDate: null,
                idNum: null,
                phone: null,
                email: null,
                remark: null,
                companyName: null,
                companyAddress: null,
                updateTime: null,
                createTime: null,
                address: null
            };
            this.resetForm("form");
        },
        openChat(userId,receiveNickName){
            //消除红色消息数量
            this.sysBookList.forEach(item=>{
                if(userId==item.userId){
                    if(item.notReadCount>0){
                        this.$emit("subMessageCount",item.notReadCount)
                        item.notReadCount = 0;
                    }
                }
            })
            // this.showChat = true;
            this.$emit("chat", {"receiveUserId":userId,"sendUserId":this.currentLoginUserId,"receiveNickName":receiveNickName})
        },
        closeChat(){
            this.showChat = false;
        }

    }

}
</script>
<style lang="scss" scoped>
    .communicateBook{
        .userContainer{
            display: flex;
            flex-direction: column;
            padding-top: 10px;
            overflow-y: scroll;
            margin-left: -15px;
            height: calc(100vh - 170px);
            .user{
                display: flex;
                flex-direction: row;
                padding: 10px;
                cursor: pointer;
                .avatar{

                }
                .info{
                    padding-left: 15px;
                    color: #606266;
                    width: 290px;
                    display: flex;
                    flex-direction: row;
                    .left{
                        width: 155px;
                        .userName{
                            font-size: 16px;
                            display: block;
                        }
                        .woman{
                            color: #f56c6c;
                        }
                        .man{
                            color: #36a3f7;
                        }

                        .item{
                            text-align: left;
                            display: flex;
                            justify-content: left;
                            align-items: center;
                        }
                    }
                    .right{
                        width: 120px;
                        padding-right: 10px;
                        .item{
                            text-align: right;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }

                    .item{
                        font-size: 12px;
                        color: #aaaaaa;
                        padding: 5px 0px;
                        white-space: nowrap;
                        .content{
                            overflow: hidden;
                            padding-left: 3px;
                            width: 150px;
                            text-overflow: ellipsis;
                            display: inline-block;
                        }
                    }
                }
            }
            .user:hover{
                background-color: #eeeeee;

            }
        }


        .addCommBook{
            margin-left: 10px;
            font-size: 20px;
            cursor: pointer;
            color: #999999
        }

        .queryComm{
            width: calc(100% - 30px);
        }
    }


    .v-contextmenu {
        width: 150px;
        .v-contextmenu-item{
            padding: 10px 15px 10px 0px;
            text-align: center;
            width: 150px;
            color: #606266;
            span{
                padding-left: 5px;
            }
        }
    }
</style>
<style scoped>
    /deep/.communicateBook .el-upload__tip{
        margin-top: -7px;
    }

    /deep/.el-dialog__body {
        padding: 10px !important;
    }
</style>
