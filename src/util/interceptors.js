import Vue from 'vue'
import * as API from "../util/api";

export default function (store, router) {


    Vue.http.interceptors.push((request, next) => {
        return next();
    })


    Vue.http.interceptors.push((request, next) => {

        // 携带token
        let token = window.localStorage.getItem(API.AUTH_TOKEN);
        if(token){
            request.headers.set(API.TOKEN_HEAD_NAME,token);
        }

        return next((response => {

            handleResponse(response, store, router);
            return response;
        }));
    })

}

function handleResponse(response, store, router) {

    const vm = new Vue();

    function extracted() {
        // 清除token
        window.localStorage.removeItem(API.AUTH_TOKEN);
        router.replace('/login');
    }

    if (response.status >= 400) {

        if (response.status === 401) {
            extracted();
        } else if (response.status === 403) {

            vm.$message.error('您没有访问该资源的权限');
        } else if (response.status === 404) {
            vm.$message.error('资源不存在');
        } else if (response.status === 408) {

            vm.$message.error(response.statusText ? response.statusText : `ERROR${response.url}`)
        }else {

            vm.$message.error(response.data.msg ? response.data.msg : `ERROR${response.url}`)
        }

    } else if (response.data.code !== 200) {

        if (response.data.code === 405) {

            vm.$message.warning(response.data.msg ? response.data.msg : `ERROR${response.url}`)
        } else if(response.data.code === 401){

            vm.$message.error(response.data.msg ? response.data.msg : '会话已过期请重新登入')
            router.replace('/login');
        }else {

            vm.$message.error(response.data.msg ? response.data.msg : `ERROR${response.url}`)
        }
    }

}