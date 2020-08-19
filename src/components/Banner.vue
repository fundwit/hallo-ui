<template>
    <div>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1">
                <router-link :to="{name: 'Root'}" tag="span" class="link-element">
                    Home
                </router-link>
            </el-menu-item>

            <el-menu-item index="7" class="float-right" v-if="!isLogin">
                <router-link :to="{name: 'Register'}" tag="span" class="link-element">
                    Sign Up
                </router-link>
            </el-menu-item>
            <el-menu-item index="8" class="float-right" v-if="!isLogin">
                <router-link :to="{name: 'Login'}" tag="span" class="link-element">
                    Sign In
                </router-link>
            </el-menu-item>

            <el-submenu index="9" class="float-right" v-if="isLogin">
                <template slot="title">{{securityContext.principal.username}}</template>
                <el-menu-item index="2-1">
                    <router-link :to="{name: 'Profile'}" tag="span" class="link-element">
                    Profile
                    </router-link>
                </el-menu-item>
                <el-menu-item index="2-2" @click="logout">Logout</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    export default {
        name: 'Banner',
        data () {
            return {
                activeIndex: '1',
                activeIndex2: '1'
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
            logout () {
                this.$confirm('确认登出？')
                    .then(() => {
                        this.$store.dispatch('updateSecurityContext', null)
                    })
                    .catch(() => {
                        // canceled
                    });
            },
        }
    }
</script>

<style scoped>
    .float-right {
        float: right !important;
    }
    .link-element {
        display: inline-block;
    }
</style>
