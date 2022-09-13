<template>
    <a-modal
            width="650px"
            title="新增角色"
            :cancelText="'取消'"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="roleAddModal.visible"
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
    </a-modal>
</template>

<script>
    import * as API from "../../../util/api";

    export default {
        name: "role-add.vue",
        props:{
            roleAddModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                loading: false,
                form:{
                    roleName: '',
                    roleDesc: '',
                },
            }
        },
        methods:{
            handleCancel(){
                this.roleAddModal.visible = false;
                this.form = {};
            },
            handleOk(){
                this.loading = true;
                this.$sendAjax.doPost(API.userRoleSave,this.form, {emulateJSON: true}).then((data)=>{
                    this.form = {};
                    this.$emit('addSuccess')
                }).finally(()=>{
                    this.loading=false;
                })
            }
        },
    }
</script>

<style scoped>

</style>