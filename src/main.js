import Vue from 'vue'
// import VueResource from 'vue-resource'

import App from './App.vue'

import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from "@/router";

import VueCookies from 'vue-cookies'

// import locale from 'element-ui/lib/locale/lang/en'
// Vue.use(ElementUI, {locale})
Vue.use(ElementUI)
Vue.use(VueCookies)

// Vue.use(VueResource)
// Vue.http.interceptors.push((req, next) => {
//   // before action
//   next((response) => {
//     // after action
//     return response
//   })
// })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

// new Vue({
//   el: '#app',
//   routes,
//   store,
//   components: { App },
//   template: '<App/>',
//
//   // vue-resource global config
//   // http: {
//   //   root: '/',
//   //   headers: {} // 对请求头重写与自定义
//   // }
// })



