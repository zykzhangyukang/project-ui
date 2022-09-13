<template>
    <a-modal
            width="650px"
            title="新增用户"
            :cancelText="'取消'"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="userAddModal.visible"
            @cancel="handleCancel"
            @ok="handleOk"
    >
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
                    <a-form-model-item ref="username" onautocomplete="false" label="用户账号" prop="username">
                        <a-input v-model="form.username"  />
                    </a-form-model-item>
                </a-col>
                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="password" label="登入密码" prop="username" >
                        <a-input type="password" v-model="form.password" />
                    </a-form-model-item>
                </a-col>

            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">
                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="realName" label="真实姓名" prop="realName">
                        <a-input v-model="form.realName" />
                    </a-form-model-item>
                </a-col>
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
            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">
                <a-col
                        :span="12"
                >
                    <a-form-item label="所属部门">
                        <a-select style="width: 180px"   v-model="form.deptCode">
                            <a-select-option v-for="item in deptList" :value="item.deptCode" :key="item.deptCode">
                                {{item.deptName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form-model>
    </a-modal>
</template>

<script>
    import * as API from '../../../util/api'
    import Common from "../../../util/common";

    export default {
        name: "user-add.vue",
        props:{
            userAddModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                deptList: [],
                loading: false,
                form:{},
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
            getDeptList(){
                this.$sendAjax.doGet(API.authDeptList).then((data) => {
                    this.deptList = data.result;
                }).finally(()=>{
                });
            },
            handleCancel(){
                this.userAddModal.visible = false;
                this.form = {};
            },
            handleOk(){
                this.loading = true;
                this.$sendAjax.doPost(API.authUserSave,this.form , { emulateJSON: true }).then(({data:res})=>{
                    this.form = {};
                    this.$emit('addSuccess')
                }).finally(()=>{
                    this.loading=false;
                })
            }
        },
        created() {
            this.getDeptList();
        }
    }
</script>

<style scoped>

</style>