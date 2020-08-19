import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'

const debug = process.env.NODE_ENV !== 'production'
// const USER_LOGIN = 'userLogin'
// const USER_LOGOUT = 'userLogout'
const AUTH_TOKEN_NAME = "token"
const SECURITY_CONTEXT_UPDATE = 'updateSecurityContext'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: debug, // 运行模式
  plugin: debug ? [createLogger] : [],

  state: {
    securityContext: null, // {token, principal}
    navigation: {}
  },

  getters: {
    securityContext: state => state.securityContext,
    navigation: state => state.navigation,
    isLogin: state => state.securityContext != null
  },

  actions: {
    [SECURITY_CONTEXT_UPDATE] (store, data) {
      store.commit(SECURITY_CONTEXT_UPDATE, {data})
    },

    // login (context) {
    //   Vue.http.get('/api/login', (res) => {
    //     context.commit(USER_LOGIN, res.body)
    //   })
    // },
    // logout (context) {
    //   context.commit(USER_LOGOUT, {})
    // }
  },

  mutations: {
    [SECURITY_CONTEXT_UPDATE] (state, {data}) {
      state.securityContext = data
      if (data) {
        Vue.$cookies.set(AUTH_TOKEN_NAME, data.token)
      } else {
        Vue.$cookies.remove(AUTH_TOKEN_NAME)
      }
    },

    // [USER_LOGIN] (state, {data}) {
    //   state.user = data
    // },
    // [USER_LOGOUT] (state, {data}) {
    //   state.user = null
    //   console.log(data)
    // }
  },

  modules: {} // 注入子模块
})
