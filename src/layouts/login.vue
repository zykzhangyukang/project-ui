<template>
    <div id="login">
        <a-card id="login_card">
            <h1 id="login_title">系统登入</h1>
            <a-form
                    id="loginForm"
                    :model="loginForm"
                    name="normal_login"
                    class="login-form"
            >
                <a-form-item
                        name="username"
                >
                    <a-input  size="large" v-model:value="loginForm.username">
                        <template #prefix>
                            <a-icon type="user" />
                        </template>
                    </a-input>
                </a-form-item>

                <a-form-item
                        name="password"
                >
                    <a-input-password  size="large" v-model:value="loginForm.password">
                        <template #prefix>
                            <a-icon type="lock" />
                        </template>
                    </a-input-password>
                </a-form-item>

                <a-form-item>
                    <a-button :loading="loading" @click="login" size="large" style="width: 100%"  type="primary" html-type="submit" class="login-form-button">
                       立即登入
                    </a-button>
                </a-form-item>
            </a-form>
        </a-card>
    </div>
</template>

<script>
    import * as API from "../util/api";

    export default {
        name: "Login.vue",
        data(){
            return {
                loginForm:{
                    username: 'admin',
                    password: '123456',
                },
                loading: false,
            }
        },
        methods:{
            login(){
                let username = this.loginForm.username;
                let password = this.loginForm.password;
                if(!username){
                    return this.$message.warning('请您输入登入账号！');
                }
                if(!password){
                    return this.$message.warning('请您输入登入密码！');
                }

                // 登入接口
                this.loading = true;
                this.$sendAjax.doPost(API.authToken,this.loginForm , { emulateJSON: true }).then((res)=>{

                    // 保存token
                    window.localStorage.setItem(API.AUTH_TOKEN,res.result.token);

                    this.$router.push('/welcome');

                }).finally(e=>{
                    this.loading = false;
                });
            },
            getUserInfo() {
                this.$sendAjax.doGet(API.authInfo).then((res)=>{
                    this.$store.commit('saveUserInfo',res.result);
                })
            }
        },
        created() {

        }
    }
</script>

<style scoped>
    #login {
        width: 100%;
        height: 100%;
        background: #eeeeee;
        position: relative;
    }

    #login_card {
        width: 400px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -250px;
        margin-left: -200px;
    }

    #login_title{
       text-align: center;
        font-size: 25px;
        font-weight: 500;
        margin-bottom: 30px;
    }

</style>