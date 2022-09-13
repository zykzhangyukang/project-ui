<template>
    <a-modal
            width="650px"
            title="编辑用户"
            :cancelText="'取消'"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="userEditModal.visible"
            @cancel="handleCancel"
            @ok="handleOk"
    >
        <a-spin tip="加载中..." :spinning="loading">
        <a-form-model
                style="min-height: 100px"
                ref="ruleForm"
                :model="form"
                layout="inline"
        >
            <a-row :gutter="2">
                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="username" label="用户账号" prop="username" >
                        <a-input disabled="" v-model="form.username"/>
                    </a-form-model-item>
                </a-col>
                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="realName" label="真实姓名" prop="realName">
                        <a-input v-model="form.realName"/>
                    </a-form-model-item>
                </a-col>

            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">

                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="userStatus" label="用户状态" prop="userStatus">
                        <a-select style="width: 180px"  v-model="form.userStatus">
                            <a-select-option v-for="item in userStatusG" :value="item.code" :key="item.code">
                                {{item.name}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>

                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="deptCode" label="所属部门" prop="deptCode">
                        <a-select  style="width: 180px"  v-model="form.deptCode">
                            <a-select-option v-for="item in deptList" :value="item.deptCode" :key="item.deptCode">
                                {{item.deptName}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>
                </a-col>
            </a-row>
        </a-form-model>
        </a-spin>
    </a-modal>
</template>

<script>
    import * as API from '../../../util/api'
    import Common from "../../../util/common";

    export default {
        name: "user-edit.vue",
        props:{
            userEditModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                loading: false,
                form:{},
                deptList: [],
            }
        },
        computed:{
            userStatusG(){
                return  Common.methods.getConst('user_status_group',this.$store.state.authProject);
            },
            userStatusGName(){
                return Common.methods.formatConst(this.userStatusG);
            }
        },
        methods:{
            handleCancel(){
                this.userEditModal.visible = false;
                this.form = {};
            },
            handleOk(){
                this.loading = true;
                this.$sendAjax.doPost(API.authUserUpdate,this.form,{ emulateJSON: true }).then(({data:res})=>{
                    this.form = {};
                    this.$emit('editSuccess')
                }).finally(()=>{
                    this.loading=false;
                })
            },
            getDeptList(){
                this.loading = true;
                this.$sendAjax.doGet(API.authDeptList).then((data) => {
                    this.deptList = data.result;
                }).finally(()=>{
                    this.loading = false;
                });
            },
            select(userId){
                const params = {userId:userId};
                this.loading = true;
                this.$sendAjax.doGet(API.authUserSelect,{params}).then((data)=>{

                    this.form = data.result;
                }).finally(()=>{
                    this.loading=false;
                })
            }
        },
        created() {
            this.select(this.userEditModal.userId);
            this.getDeptList();
        }
    }
</script>

<style scoped>

</style>