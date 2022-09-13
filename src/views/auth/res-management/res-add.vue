<template>
    <a-modal
            width="650px"
            title="新增资源"
            :cancelText="'取消'"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="resAddModal.visible"
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
                    <a-form-model-item ref="resName"  label="资源名称" prop="resName" >
                        <a-input placeholder="资源名称" style="width: 500px" v-model="form.rescName"/>
                    </a-form-model-item>
                </a-col>
            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">
                <a-col
                        :span="24"
                >

                    <a-form-model-item ref="resUrl"  label="资源名称" prop="resUrl" >
                        <a-input placeholder="资源url" style="width: 500px" v-model="form.rescUrl"/>
                    </a-form-model-item>

                </a-col>
            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">
                <a-col
                        :span="12"
                >

                    <a-form-item label="所属项目">
                        <a-select style="width: 180px"   v-model="form.rescDomain">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="item in rescDomainG" :value="item.code" :key="item.code">
                                {{rescDomainGName[item.code]}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                </a-col>
                <a-col
                        :span="12"
                >

                    <a-form-item label="请求方式">
                        <a-select style="width: 180px"   v-model="form.methodType">
                            <a-select-option value="">请选择</a-select-option>
                            <a-select-option v-for="item in methodTypeG" :value="item.code" :key="item.code">
                                {{methodTypeGName[item.code]}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>

                </a-col>
            </a-row>
        </a-form-model>
    </a-modal>
</template>

<script>
    import * as API from "../../../util/api";
    import Common from "../../../util/common";

    export default {
        name: "res-add.vue",
        props:{
            resAddModal:{
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
                    rescName: '',
                    rescUrl: '',
                    rescDomain: '',
                },
            }
        },
        computed: {
            rescDomainG(){
                return  Common.methods.getConst('project_domain',this.$store.state.authProject);
            },
            rescDomainGName(){
                return Common.methods.formatConst(this.rescDomainG);
            },
            methodTypeG(){
                return  Common.methods.getConst('method_type',this.$store.state.authProject);
            },
            methodTypeGName(){
                return Common.methods.formatConst(this.methodTypeG);
            }
        },
        methods:{
            handleCancel(){
                this.resAddModal.visible = false;
                this.form = {
                    rescName: '',
                    rescUrl: '',
                    rescDomain: '',
                };
            },
            handleOk(){
                this.loading = true;
                this.$sendAjax.doPost(API.userRescSave,this.form, {emulateJSON: true}).then((data)=>{
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