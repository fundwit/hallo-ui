<template>
    <div>
        <banner/>
        <div>
            <div v-if="isLogin">
                用户 {{securityContext.principal.name}}
            </div>
            <div v-if="!isLogin">
                请先登录
            </div>
        </div>
    </div>
</template>

<script>
    import Banner from "@/components/Banner"
    import {mapGetters} from "vuex";
    export default {
        name: 'Profile',
        components: {
            Banner
        },
        data () {
            return {
            }
        },
        computed: {
            ...mapGetters([
                'securityContext',
                'navigation',
                'isLogin'
            ])
        },
    }
</script>

<style scoped>
</style>
