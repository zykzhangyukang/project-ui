<template>
    <a-layout id="home">
        <a-layout-sider :style="{ overflow: 'auto', background:'#001529', height: '100vh', position: 'fixed', left: 0 }">
            <div class="logo" @click="$router.push('/welcome')"/>
            <a-menu theme="dark" mode="inline" :defaultOpenKeys="defaultOpenKeys" :defaultSelectedKeys="defaultSelectedKeys"  :selectedKeys="selectedKeys">
                <a-sub-menu v-for="menu in menus" :key="menu.funcKey">
                    <span slot="title"><a-icon :type="menu.funcIcon"/><span>{{menu.funcName}}</span></span>
                    <!-- 子菜单 -->
                    <template v-if="menu.children">
                        <a-menu-item v-for="item in menu.children" :key="item.funcKey"
                                     @click="routerTo(menu.funcKey,item.funcKey)">
                            <a-icon :type="item.funcIcon"/>
                            <span>{{item.funcName}}</span>
                        </a-menu-item>
                    </template>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout :style="{ marginLeft: '200px' }">
            <a-layout-header :style="{ background: '#fff', padding: 0 }"/>
            <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' ,minHeight: '90vh'}">
                <a-card>
                    <router-view></router-view>
                </a-card>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
    import * as API from "../util/api";

    export default {
        data() {
            return {
                menus: [],
                defaultOpenKeys:[],
                defaultSelectedKeys:[],
                selectedKeys:[],
                openKeys:[],
            }
        },
        methods: {
            getAllConst() {
                this.$sendAjax.doGet(API.authConst).then((data) => {
                    this.$store.commit('saveAllConst', data.result);
                })
            },
            getUserInfo() {
                this.$sendAjax.doGet(API.authInfo).then((res) => {
                    // 保存用户信息和菜单信息.
                    this.$store.commit('saveUserInfo', res.result);
                    // 菜单信息
                    this.menus = res.result.menus;
                })
            },
            /**
             * 点击菜单路由跳转
             * @param menu 一级目录key
             * @param item 二级目录key
             */
            routerTo(menu, item) {
                this.$router.push(`/${menu}/${item}`)
            },
        },
        created() {
            this.getAllConst();
            this.getUserInfo();
        },
        watch: {
            $route: {
                handler(newVal, oldVal) {

                    // 记录当前打开的一级目录,二级目录key
                    const one = newVal.path.split('/')[1];
                    const two = newVal.path.split('/')[2];

                    window.localStorage.setItem(API.DEFAULT_OPEN_KEY,one);
                    window.localStorage.setItem(API.DEFAULT_SELECT_KEY,two);

                    if(two){

                        this.selectedKeys =[two];
                    }else {

                        this.selectedKeys = [];
                    }
                },
                deep: true
            }
        },
    }
</script>
<style>
    #home .logo {
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
        cursor: pointer;
    }
</style>