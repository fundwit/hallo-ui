<template>
    <div>
        <banner/>

        <el-row :gutter="20" :style="{margin: '2em'}">
            <el-col :span="12" :offset="6">
                <el-card shadow="always">
                    <div slot="header" class="clearfix">
                        <span>登录</span>
                    </div>
                    <el-form ref="form" :model="loginRequest" label-width="80px" v-if="!isLogin">
                        <el-form-item label="用户名">
                            <el-input placeholder="请输入用户名" v-model="loginRequest.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input placeholder="请输入密码" v-model="loginRequest.secret" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">登录</el-button>
                        </el-form-item>
                    </el-form>

                    <div v-if="isLogin">
                        用户 {{securityContext.principal.name}} 已登录
                    </div>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Banner from "@/components/Banner"
    import {mapGetters} from "vuex";
    import halloClient from "@/halloClient";

    export default {
        name: 'Login',
        components: {
            Banner
        },
        data() {
            return {
                loginRequest: {
                    name: '',
                    secret: '',
                }
            }
        },
        computed: {
            ...mapGetters([
                'securityContext',
                'navigation',
                'isLogin'
            ])
        },
        methods: {
            onSubmit() {
                halloClient.login(this.loginRequest.name, this.loginRequest.secret).then(response => {
                    let body = response.data
                    let securityContext = {token: body.token, principal: {name: body.principal.name}}
                    this.$store.dispatch('updateSecurityContext', securityContext)
                    this.logining = false;
                }).catch((error) => {
                    // 异常： 认证失败 (401)
                    // 异常： 服务不可用 (其他错误码，请求发送失败)
                    this.$store.dispatch('updateSecurityContext', null)
                    console.log(error)
                });
            }
        }
    }
</script>

<style scoped>
</style>
