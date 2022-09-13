import Vue from 'vue'
import NProgress from 'nprogress'

NProgress.configure({easing: 'ease', speed: 500, showSpinner: true});


export default {

    // basicUrl: 'http://119.91.30.131', // pro 配置后台接口的地址

    basicUrl: 'http://127.0.0.1', // dev 配置后台接口的地址

    httpMethod: {
        GET: 'get',
        POST: 'post',
        PUT: 'put',
        DELETE: 'delete',
        LOGIN: 'login', // 自定义登入
    },

    doGet(url, options = null) {
        return this.doRequest(url, this.httpMethod.GET, options);
    },

    doPost(url, body = null, options = null) {
        return this.doRequest(url, this.httpMethod.POST, body, options);
    },

    doPut(url, body = null, options = null) {
        return this.doRequest(url, this.httpMethod.PUT, body, options);
    },

    doDelete(url, body = null, options = null) {
        return this.doRequest(url, this.httpMethod.DELETE, null, options);
    },


    doRequest(url, method, body, options) {

        NProgress.start();
        let request = null;
        url = this.basicUrl + url;


        switch (method) {

            case this.httpMethod.GET: {
                request = Vue.http.get(url, body);
                break;
            }

            case this.httpMethod.POST: {
                request = Vue.http.post(url, body, options);
                break;
            }

            case this.httpMethod.PUT: {
                request = Vue.http.put(url, body, options);
                break;
            }

            case this.httpMethod.DELETE: {
                request = Vue.http.delete(url, options);
                break;
            }


            default: {
                break;
            }

        }

        return this.requestPromise(request);
    },


    requestPromise(request) {


        NProgress.done();

        return request.then((response) => {

                if (response.status === 200) {


                    if (response.body.code === 200) {

                        // 成功回调
                        return Promise.resolve(response.body);
                    }

                    // 失败回调
                    return Promise.reject(response.body);
                }

                return Promise.reject(response.statusText);
            },
            response => Promise.reject(response.statusText))
    },


};