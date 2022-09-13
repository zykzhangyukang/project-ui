<template>
    <a-modal
            width="650px"
            title="编辑角色"
            :cancelText="'取消'"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="roleEditModal.visible"
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
                            :span="24"
                    >
                        <a-form-model-item ref="roleName"  label="角色名称" prop="roleName" >
                            <a-input placeholder="角色名称" style="width: 500px" v-model="form.roleName"/>
                        </a-form-model-item>
                    </a-col>
                </a-row>
                <a-row :gutter="2" style="margin-top: 10px">
                    <a-col
                            :span="24"
                    >
                        <a-form-model-item ref="roleDesc"  label="角色描述" prop="roleDesc" >
                            <a-textarea
                                    style="width: 500px"
                                    v-model="form.roleDesc"
                                    placeholder="角色描述信息"
                                    :auto-size="{ minRows: 3, maxRows: 5 }"
                            />
                        </a-form-model-item>

                    </a-col>
                </a-row>
            </a-form-model>
        </a-spin>
    </a-modal>
</template>

<script>
    import * as API from "../../../util/api";
    export default {
        name: "role-edit.vue",
        props:{
            roleEditModal:{
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

        },
        methods:{
            handleCancel(){
                this.roleEditModal.visible = false;
                this.form = {};
            },
            handleOk(){
                this.loading = true;
                this.$sendAjax.doPost(API.userRoleUpdate,this.form,{emulateJSON: true}).then(()=>{
                    this.form = {};
                    this.$emit('editSuccess')
                }).finally(()=>{
                    this.loading=false;
                })
            },
            select(roleId){
                this.loading = true;
                const params = {roleId: roleId};
                this.$sendAjax.doGet(API.userRoleSelect,{params}).then((data)=>{
                    this.form = data.result;
                }).finally(()=>{
                    this.loading=false;
                })
            }
        },
        created() {
            this.select(this.roleEditModal.roleId);
        }
    }
</script>

<style scoped>

</style>