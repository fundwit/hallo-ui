<template>
    <div>
        <banner/>

        <el-row :gutter="20" :style="{margin: '2em'}">
            <el-col :span="12" :offset="6">
                <el-card shadow="always">

                    <el-form ref="form" :model="loginRequest" label-width="80px" v-if="!isLogin">
                        <el-form-item label="用户名">
                            <el-input placeholder="请输入用户名" v-model="loginRequest.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input placeholder="请输入密码" v-model="loginRequest.secret" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">登录</el-button>
                        </el-form-item>
                    </el-form>

                    <div v-if="isLogin">
                        用户 {{securityContext.principal.username}} 已登录
                    </div>

                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import Banner from "@/components/Banner"
    import {mapGetters} from "vuex";
    export default {
        name: 'Login',
        components: {
            Banner
        },
        data() {
            return {
                loginRequest: {
                    username: '',
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
                // 认证
                let securityContext = {token: '123', principal: { username: this.loginRequest.username}}
                // 认证成功后，更新 store
                this.$store.dispatch('updateSecurityContext', securityContext)
            }
        }
    }
</script>

<style scoped>
</style>
