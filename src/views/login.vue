<template>
    <div class="login">
        <el-carousel :interval="2000" arrow="always" height="100%" style="width: 100%;height: 100%;">
            <el-carousel-item v-for="item in bgArr" :key="item">
                <img :src="item" style="width: 100%;height: 100%">
            </el-carousel-item>
        </el-carousel>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">客户CRM系统</h3>
            <el-form-item prop="tenantName">
<!--                <el-input v-model="loginForm.tenantName" type="text" auto-complete="off" placeholder="公司">-->
<!--                    <svg-icon slot="prefix" icon-class="international" class="el-input__icon input-icon"/>-->
<!--                </el-input>-->
<!--                <el-autocomplete class="inline-input" v-model="companyName" :fetch-suggestions="queryCompanyTenant" placeholder="公司" @select="handleSelect">-->
<!--                    <svg-icon slot="prefix" icon-class="international" class="el-input__icon input-icon"/>-->
<!--                </el-autocomplete>-->

<!--                <el-select filterable remote style="width: 560px" v-model="loginForm.tenantName" placeholder="所属公司" :loading="searchLoading" :remote-method="searchCompanyTenant">-->
<!-- 
                <el-select filterable style="width: 100%" v-model="loginForm.tenantName" placeholder="所属公司">
                    <template slot="prefix">
                        <span style="padding-left: 5px;">
                            <i class="el-icon-s-cooperation"></i>
                        </span>
                    </template>
                    <el-option v-for="c in options" :key="c.name" :label="c.name" :value="c.name"/>
                </el-select> -->

            </el-form-item>
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号">
                    <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
                </el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码" @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaOnOff">
                <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%" @keyup.enter.native="handleLogin">
                    <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>
                </el-input>
                <div class="login-code">
                    <img :src="codeUrl" @click="getCode" class="login-code-img"/>
                </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
                <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
                    <span v-if="!loading">登 录</span>
                    <span v-else>登 录 中...</span>
                </el-button>
                <!--  
                <div style="float: right;" v-if="register">
                    <router-link class="link-type" :to="'/register'">立即注册</router-link>
                </div>
                -->
            </el-form-item>
        </el-form>
        <!--  底部  -->
        <div class="el-login-footer">
            <span>Copyright © 2024-2026 jinxiang.com All Rights Reserved.</span>
        </div>
    </div>
</template>

<script>
import {getCodeImg,queryCompanyTenant} from "@/api/login";
import Cookies from "js-cookie";
import {encrypt, decrypt} from '@/utils/jsencrypt'
export default {
    name: "Login",
    data() {
        return {
            bgArr:[
                // require("@/assets/images/bg/bg-img-oa.jpg"),
                // require("@/assets/images/bg/7.jpg"),
                // require("@/assets/images/bg/6.jpg"),
                // require("@/assets/images/bg/5.jpg"),
                // require("@/assets/images/bg/4.jpg"),
                // require("@/assets/images/bg/3.jpg"),
                // require("@/assets/images/bg/2.jpg"),
                // require("@/assets/images/bg/1.jpg"),
                // require("@/assets/images/bg/bg-img-7.jpg"),
                // require("@/assets/images/bg/bg-img-6.jpg"),
                //require("@/assets/images/bg/bg-img-5.jpg"),
                 require("@/assets/images/bg/bg-img-4.jpg"),
                // require("@/assets/images/bg/bg-img-3.jpg"),
                // require("@/assets/images/bg/bg-img-1.jpg"),

            ],
            codeUrl: "",
            companyName:"",
            options:[],
            searchLoading:false,
            loginForm: {
                tenantName: "锦翔信息科技有限公司",
                username: "admin",
                password: "123456",
                rememberMe: false,
                code: "",
                uuid: ""
            },
            loginRules: {
                tenantName: [
                    {required: true, trigger: "blur", message: "请输入需要登录的公司"}
                ],
                username: [
                    {required: true, trigger: "blur", message: "请输入您的账号"}
                ],
                password: [
                    {required: true, trigger: "blur", message: "请输入您的密码"}
                ],
                code: [{required: true, trigger: "change", message: "请输入验证码"}]
            },
            loading: false,
            // 验证码开关
            captchaOnOff: true,
            // 注册开关
            register: true,
            redirect: undefined
        };
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect;
            },
            immediate: true
        }
    },
    created() {
        this.getCode();
        this.getCookie();
        //this.searchCompanyTenant();
    },
    methods: {
        searchCompanyTenant(){
                this.searchLoading = true;
                let data = {
                    status:0
                }
                queryCompanyTenant(data).then(res=>{
                    this.searchLoading = false;
                    this.options = res.data;
                })
        },
        getCode() {
            getCodeImg().then(res => {
                this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
                if (this.captchaOnOff) {
                    this.codeUrl = "data:image/gif;base64," + res.img;
                    this.loginForm.uuid = res.uuid;
                }
            });
        },
        getCookie() {
            const tenantName = Cookies.get("tenantName");
            const username = Cookies.get("username");
            const password = Cookies.get("password");
            const rememberMe = Cookies.get('rememberMe')
            this.loginForm = {
                tenantName: tenantName === undefined ? this.loginForm.tenantName : tenantName,
                username: username === undefined ? this.loginForm.username : username,
                password: password === undefined ? this.loginForm.password : decrypt(password),
                rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
            };
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true;
                    if (this.loginForm.rememberMe) {
                        Cookies.set("tenantName", this.loginForm.tenantName, {expires: 30});
                        Cookies.set("username", this.loginForm.username, {expires: 30});
                        Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
                        Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
                    } else {
                        Cookies.remove("tenantName");
                        Cookies.remove("username");
                        Cookies.remove("password");
                        Cookies.remove('rememberMe');
                    }

                    let loginInfo = {
                        username:this.loginForm.username,
                        password:this.loginForm.password,
                        code:this.loginForm.code,
                        uuid:this.loginForm.uuid
                    }

                    this.$store.dispatch("Login", loginInfo).then(() => {
                        this.$router.push({path: this.redirect || "/"}).catch(() => {
                        });
                    }).catch(() => {
                        this.loading = false;
                        if (this.captchaOnOff) {
                            this.getCode();
                        }
                    });
                }
            });
        }
    }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background-size: cover;
}

.title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #707070;
}

.login-form {
    position: absolute;
    top: 150px;
    z-index: 999;
    border:1px solid #dddddd;
    border-radius: 6px;
    background: #ffffff;
    width: 400px;
    padding: 25px 25px 5px 25px;

    .el-input {
        height: 38px;

        input {
            height: 38px;
        }
    }

    .input-icon {
        height: 39px;
        width: 14px;
        margin-left: 2px;
    }
}

.login-tip {
    font-size: 13px;
    text-align: center;
    color: #bfbfbf;
}

.login-code {
    width: 33%;
    height: 38px;
    float: right;

    img {
        cursor: pointer;
        vertical-align: middle;
    }
}

.el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
}

.login-code-img {
    height: 38px;
}
</style>
