<template>
  <div id="app">
    <router-view v-if="!loading"/>
    <loading v-if="loading"/>
  </div>
</template>

<script>
  import Loading from "@/components/Loading"
  import {mapGetters} from "vuex";
  import halloClient from "@/halloClient";

  export default {
    name: 'App',
    components: {
      Loading
    },
    data () {
      return {
        loading: true
      }
    },
    computed: {
      ...mapGetters([
        'securityContext',
        'navigation',
        'isLogin'
      ])
    },
    mounted: function () {
      this.$nextTick(function () {
        if(this.$cookies.get("token")) {
          // fetch security context
          halloClient.currentSession(this.$cookies.get("token")).then(response => {
            let body = response.data
            let securityContext = {token: body.token, principal: {username: body.principal.username}}
            this.$store.dispatch('updateSecurityContext', securityContext)
            this.loading = false;
          }).catch((error) => {
            // 异常： token已失效 (401)
            // 异常： 服务不可用 (其他错误码，请求发送失败)
            this.$store.dispatch('updateSecurityContext', null)
            console.log(error)
            this.loading = false;
          });
        } else {
          // 未认证
          this.$store.dispatch('updateSecurityContext', null)
          this.loading = false;
        }
      })
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  margin: 0;
}
</style>
