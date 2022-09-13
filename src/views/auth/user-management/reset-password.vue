<template>
    <a-modal
            width="400px"
            title="修改密码"
            :cancelText="'取消'"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="restPasswordModal.visible"
            @cancel="handleCancel"
            @ok="handleOk"
    >
        <a-form-model
                ref="ruleForm"
                :model="form"

        >

                <a-input-password size="large"  placeholder="请输入登入密码" v-model="form.password" type="password"/>

             <br/> <br/>

               <a-input-password size="large" placeholder="请再一次输入登入密码" v-model="form.confirm" type="password"/>

        </a-form-model>
    </a-modal>
</template>

<script>
    import * as API from '../../../util/api'
    export default {
        name: "reset-password.vue",
        props:{
            restPasswordModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                loading:false,
                form:{
                    password:'',
                    confirm: '',
                },
            }
        },
        methods:{
            handleCancel(){
                this.restPasswordModal.visible = false;
                this.form = {};
            },
            handleOk(){
                if(!this.form.password || this.form.password.length < 6){
                    return this.$message.warning('密码不能为空且不能小于6个字符');
                }
                if(!this.form.confirm){
                    return this.$message.warning('确认密码不能为空');
                }
                if(this.form.password.trim() !== this.form.confirm){
                    return this.$message.warning('两次输入的密码不一致');
                }
                this.loading = true;
                this.$sendAjax.doPost(API.authUserUpdatePwd,{password: this.form.password,userId: this.restPasswordModal.userId} , { emulateJSON: true }).then(({data:res})=>{
                    this.form = {};
                    this.$emit('updatePwdSuccess')
                    return this.$message.success('修改密码成功');
                }).finally(()=>{
                    this.loading=false;
                })
            }
        },
        created() {
        }
    }
</script>

<style scoped>

</style>