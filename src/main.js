import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import sendAjax from './util/networking'
import 'ant-design-vue/dist/antd.css';
import VueResource from 'vue-resource'
import interceptors from "./util/interceptors";

Vue.prototype.$sendAjax = sendAjax;
Vue.config.productionTip = false

Vue.use(Antd);
Vue.use(VueResource);

// http拦截器
interceptors(store,router);


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
