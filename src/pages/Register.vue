<template>
    <div>
        <banner/>
        <el-row :gutter="20" :style="{margin: '2em'}">
            <el-col :span="12" :offset="6">
                <el-card shadow="always">
                    <div slot="header" class="clearfix">
                        <span>注册</span>
                    </div>
                    <el-form ref="form" :model="registerRequest" label-width="80px" v-if="!registerSuccess">
                        <el-form-item label="用户名">
                            <el-input placeholder="请输入用户名" v-model="registerRequest.name"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input placeholder="请输入密码" v-model="registerRequest.secret" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="密码确认">
                            <el-input placeholder="请再次输入密码" v-model="registerRequest.secretConfirm" show-password></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">注册</el-button>
                        </el-form-item>
                    </el-form>

                    <div v-if="registerSuccess">
                        用户 {{registerRequest.name}} 已注册成功，请登录
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
        name: 'Register',
        components: {
            Banner
        },
        data() {
            return {
                registerSuccess: false,
                registerRequest: {
                    name: '',
                    secret: '',
                    secretConfirm: '',
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
                if(this.registerRequest.secret !== this.registerRequest.secretConfirm) {
                    console.log("secret not match")
                    return
                }

                // eslint-disable-next-line no-unused-vars
                halloClient.signUp(this.registerRequest.name, this.registerRequest.secret).then(response => {
                    this.registerSuccess = true
                }).catch((error) => {
                    console.log(error)
                    // 异常： 注册失败 (401)
                    // 异常： 服务不可用 (其他错误码，请求发送失败)
                });
            }
        }
    }
</script>

<style scoped>
</style>
