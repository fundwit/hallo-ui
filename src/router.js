import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from "@/pages/Home";
import Profile from "@/pages/Profile"
import Login from "@/pages/Login"
import Register from "@/pages/Register"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    base: __dirname,
    routes: [
        {
            path: '/', name: 'Root', component: Home,
            // meta: { title: ''},
            // redirect: 'home',
        },
        {
            path: '/profile', name: 'Profile', component: Profile
        },
        {
            path: '/login', name: 'Login', component: Login
        },
        {
            path: '/register', name: 'Register', component: Register
        }
    ]
})

router.beforeEach((to, from, next) => {
    // do something
    next();
})
// router.afterEach((to, from, next) => {
//     // do something
// })


export default router

