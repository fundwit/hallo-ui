<template>
    <div>
        <banner/>

        <el-row aria-label="loginForm" :gutter="20" :style="{margin: '2em'}">
            <el-col :span="12" :offset="6">
                <el-card shadow="always">
                    <div slot="header" class="clearfix">
                        <span>登录</span>
                    </div>
                    <el-form ref="form" :model="loginRequest" label-width="80px" v-if="!isLogin">
                        <el-form-item label="用户名">
                            <el-input aria-label="loginName" placeholder="请输入用户名" v-model="loginRequest.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input aria-label="loginSecret" placeholder="请输入密码" v-model="loginRequest.secret" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button aria-label="loginSubmit" type="primary" @click="onSubmit">登录</el-button>
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
    import Url from "url-parse"

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
                const loading = this.$loading({
                    lock: true,
                    text: 'Logging...',
                    spinner: 'el-icon-loading',
                    // background: 'rgba(0, 0, 0, 0.7)'
                });
                halloClient.login(this.loginRequest.name, this.loginRequest.secret).then(response => {
                    loading.close()
                    let body = response.data
                    let securityContext = {token: body.token, principal: {name: body.principal.name}}

                    // update cookie
                    this.$store.dispatch('updateSecurityContext', securityContext)

                    let url = Url(window.location.href, true)
                    if (url.query.url) {
                        setTimeout(() => {
                            window.location.href = decodeURIComponent(url.query.url)
                        }, 1000);
                    }
                }).catch((error) => {
                    loading.close()
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
