import Vue from 'vue'
import VueRouter from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import * as API from "../util/api";
import dynamicRouters from "./dynamic";
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/welcome',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../layouts/login')
    }
]

const router = new VueRouter({
    routes
})


router.addRoutes(dynamicRouters)
router.beforeEach((to, from, next) => {

    let access_token = window.localStorage.getItem(API.AUTH_TOKEN);

    if (!access_token && to.path !== '/login') {

        return next('/login');
    } else {

        // 获取登入用户的菜单信息
        // console.log(store.state.userInfo.menus)
    }

    NProgress.start();
    next();
});

router.afterEach(() => {
    NProgress.done();
});


// 解决报错
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace
// push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}
// replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
    return originalReplace.call(this, location).catch(err => err)
}


export default router
