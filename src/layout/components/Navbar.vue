<template>
    <div class="navbar">
        <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>

        <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav"/>
        <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav"/>

        <div class="right-menu">
            <!-- <template v-if="device!=='mobile'">

                <div class="topNavBtn">
                    <el-badge :value="messageCount" :max="99" class="message">
                        <el-button size="small" icon="el-icon-message-solid" type="text" @click="openMessageCenter">消息</el-button>
                    </el-badge>
                </div>

                <div class="topNavBtn">
                    <el-badge :value="notReadChatMessageCount" :max="99" class="message">
                        <el-button size="small" icon="el-icon-user-solid" type="text" @click="openCommunicateBook">通讯录</el-button>
                    </el-badge>
                </div>


                             <el-tooltip :content="item.name" effect="dark" placement="bottom" v-for="item in webList">-->
<!--                  <span>{{item.name}}</span>-->
<!--                  <TopSvgIcon :iconClass="item.class" :key="item.class" :url="item.url" class="right-menu-item hover-effect"></TopSvgIcon>-->
<!--              </el-tooltip>

                <search id="header-search" class="right-menu-item"/>

                <screenfull id="screenfull" class="right-menu-item hover-effect"/>

                <el-tooltip content="布局大小" effect="dark" placement="bottom">
                    <size-select id="size-select" class="right-menu-item hover-effect"/>
                </el-tooltip>

            </template> -->

            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
                <div class="avatar-wrapper">
                    <img :src="avatar" class="user-avatar">
                    <i class="el-icon-caret-bottom"/>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <router-link to="/user/profile">
                        <el-dropdown-item>个人中心</el-dropdown-item>
                    </router-link>
                    <el-dropdown-item @click.native="setting = true">
                        <span>布局设置</span>
                    </el-dropdown-item>
                    <el-dropdown-item divided @click.native="logout">
                        <span>退出登录</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <!--消息中心-->
        <el-drawer :visible.sync="showMessage" :modal="false" :size="400" append-to-body :show-close="false" :withHeader="false">
            <MessageCenter></MessageCenter>
        </el-drawer>

        <!--通讯录-->
        <el-drawer :visible.sync="showCommunicationBook" :modal="false" :size="400" append-to-body :show-close="false" :withHeader="false">
            <CommunicateBook @chat="chat" @subMessageCount="subMessageCount"></CommunicateBook>
        </el-drawer>

        <el-drawer :title="receiveNickName" :visible.sync="showChat" :size="420" append-to-body :modal="false" :show-close="false" style="margin-right:400px;">
            <iframe :src="chatUrl" style="width:100%;height:calc(100vh - 80px);border:none;"></iframe>
        </el-drawer>

    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import TopSvgIcon from '@/components/Fno/TopSvgIcon'

import CommunicateBook from '@/views/common/communicateCenter/index'
import MessageCenter from '@/views/common/messageCenter'
import {queryTopBarMessageCount,queryTodoTaskCount} from '@/api/common/sysMessage'
import {getChatNotReadMessageCount} from "@/api/common/commonApi"

export default {
    components: {
        Breadcrumb, TopNav, Hamburger, Screenfull, SizeSelect, Search, TopSvgIcon,
        CommunicateBook,MessageCenter
    },
    data(){
        return {
            showChat:false,
            receiveUserId:"",
            receiveNickName:"",
            sendUserId:"",
            chatUrl:"",
            webList:[

            ],
            messageCount:0,
            notReadChatMessageCount:0,
            showMessage:false,
            showCommunicationBook:false
        }
    },
    created() {
        // this.queryMessageTotalCount();
        // this.getTodoCount();
        //判断是否购买即时通讯
        // if(this.Global.modules.imModule){
        //     this.getChatNotReadMessageCount();
        // }
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'avatar',
            'device'
        ]),
        setting: {
            get() {
                return this.$store.state.settings.showSettings
            },
            set(val) {
                this.$store.dispatch('settings/changeSetting', {
                    key: 'showSettings',
                    value: val
                })
            }
        },
        topNav: {
            get() {
                return this.$store.state.settings.topNav
            }
        }
    },
    methods: {
        // 查询消息中心总消息数量
        queryMessageTotalCount(){
            queryTopBarMessageCount().then(res=>{
                this.messageCount = this.messageCount + res.data;
            })
        },
        // 待办数量
        getTodoCount(){
            queryTodoTaskCount().then(res=>{
                this.messageCount = this.messageCount + res.data;
            })
        },
        // 未读信息数量
        getChatNotReadMessageCount(){
            getChatNotReadMessageCount().then(res=>{
                if(200 == res.code){
                    this.notReadChatMessageCount = res.data;
                }
            })
        },
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        async logout() {
            this.$confirm('确定注销并退出系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch('LogOut').then(() => {
                    location.href = '/index';
                })
            }).catch(() => {
            });
        },
        openMessageCenter(){
            this.showMessage = true;
        },
        openCommunicateBook(){
            this.showCommunicationBook = true;
        },
        chat(data){
            this.showChat = true;
            this.receiveUserId = data.receiveUserId;
            this.sendUserId = data.sendUserId;
            this.receiveNickName = data.receiveNickName;
            this.chatUrl = "/chat/"+this.sendUserId+"/"+this.receiveUserId;
        },
        //更新消息数量
        subMessageCount(c){
            if(c>0){
                let newCount = this.notReadChatMessageCount - c;
                if(newCount>0){
                    this.notReadChatMessageCount = newCount;
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.navbar {
    height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

    .hamburger-container {
        line-height: 46px;
        height: 100%;
        float: left;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color: transparent;

        &:hover {
            background: rgba(0, 0, 0, .025)
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .topmenu-container {
        position: absolute;
        left: 50px;
    }

    .errLog-container {
        display: inline-block;
        vertical-align: top;
    }

    .right-menu {
        float: right;
        height: 100%;
        line-height: 50px;

        .size38 {
            width: 30px;
        }

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                    background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 30px;

            .avatar-wrapper {
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    cursor: pointer;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    cursor: pointer;
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }




        .topNavBtn{
            display: inline;
            display: inline-block;
            padding-right: 15px;
            vertical-align: text-bottom;
        }
    }
}
</style>
<style scoped>
/*消息中心角标*/
/deep/.topNavBtn .message .el-badge__content.is-fixed{
    top: 12px;
}

/deep/.el-drawer__body{
    padding: 0px;
}
</style>
