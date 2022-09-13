<template>
    <div>
        <h1 style="width: 100%;margin-top: 50px;text-align: center;font-weight: 700">欢迎您登入XX系统</h1>
        <h2>当前用户:
            <a-tag style="margin-left: 10px">{{this.$store.state.userInfo.username}}</a-tag>
        </h2>
        <h2>用户姓名:
            <a-tag style="margin-left: 10px">{{this.$store.state.userInfo.realName}}</a-tag>
        </h2>
        <h2>部门信息:
            <a-tag style="margin-left: 10px">{{this.$store.state.userInfo.deptName}}</a-tag>
        </h2>
        <h2>用户角色:
            <a-tag style="margin-left: 10px">{{this.$store.state.userInfo.roles}}</a-tag>
        </h2>

        <a-button icon="logout" type="danger" @click="logout">退出系统</a-button>
        &nbsp;
        <a-button icon="login" type="primary" @click="refreshLogin">刷新登入</a-button>
    </div>
</template>

<script>
    import * as API from "../util/api";

    export default {
        name: "welcome.vue",
        data() {
            return {}
        },
        methods: {
            logout() {

                this.$sendAjax.doPost(API.authUserLogout, {emulateJSON: true}).then((res) => {
                    console.log("logout")
                });

                // 清除token,并且跳转到登入页
                window.localStorage.removeItem(API.AUTH_TOKEN);
                this.$router.push('/login');
            },
            refreshLogin(){
                this.$sendAjax.doPost(API.authUserRefreshLogin, {emulateJSON: true}).then((res) => {

                    // 重新设置新的token
                    window.localStorage.setItem(API.AUTH_TOKEN,res.result);
                });
            }
        }
    }
</script>

<style scoped>

</style>