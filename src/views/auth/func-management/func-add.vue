<template>
    <a-modal
            width="650px"
            title="新增功能"
            :cancelText="'取消'"
            :okText="'提交'"
            :mask-closable="false"
            :confirm-loading="loading"
            :visible="funcAddModal.visible"
            @cancel="handleCancel"
            style="min-height: 850px"
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
                    <a-form-model-item ref="parentFuncName"  label="父级功能" prop="parentFuncName" >
                        <a-input placeholder="父级功能"  disabled="" v-model="funcAddModal.parentFuncName"/>
                    </a-form-model-item>
                </a-col>

                <a-col
                        :span="12"
                >
                    <a-form-model-item ref="funcType"  label="功能类型 " prop="funcType" >
                        <a-select style="width: 180px"   v-model="form.funcType">
                            <a-select-option v-for="item in funcTypeG" :value="item.code" :key="item.code">
                                {{funcTypeGName[item.code]}}
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>

                </a-col>


            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">


                <a-col
                        :span="12"
                >

                    <a-form-model-item ref="funcName"  label="功能名称" prop="funcName" >
                        <a-input   v-model="form.funcName"/>
                    </a-form-model-item>

                </a-col>

                <a-col
                        :span="12"
                >

                    <a-form-model-item ref="funcKey"  label="功能Key " prop="funcKey" >
                        <a-input  v-model="form.funcKey"/>
                    </a-form-model-item>
                </a-col>

            </a-row>
            <a-row :gutter="2" style="margin-top: 10px">

                <a-col
                        :span="12"
                >

                    <a-form-model-item ref="funcKey"  label="功能排序 " prop="funcKey" >
                        <a-input-number style="width: 175px" :min="1" :max="100" v-model="form.funcSort"/>
                    </a-form-model-item>


                </a-col>
                <a-col
                        :span="12"
                >

                    <a-form-model-item v-if="this.form.funcType && this.form.funcType ==='dir'" label="展示目录">
                        <a-radio-group v-model="form.dirHide">
                            <a-radio :value="false">
                                展示
                            </a-radio>
                            <a-radio :value="true">
                                隐藏
                            </a-radio>
                        </a-radio-group>
                    </a-form-model-item>

                </a-col>

            </a-row>

            <a-divider></a-divider>
            <a-row :gutter="2" style="margin-top: 10px">

                <a-form-model-item ref="funcKey"  label="资源搜索 " prop="funcKey" >
                <a-select
                        mode="multiple"
                        v-model="form.rescIdList"
                        allowClear
                        show-search
                        autoClearSearchValue
                        size="small"
                        placeholder="请输入url或者关键字进行资源搜索"
                        style="margin: 0px auto;width: 500px"
                        :default-active-first-option="false"
                        :show-arrow="true"
                        :filter-option="false"
                        :not-found-content="null"
                        @search="handleSearch"
                        @change="handleChange"
                >

                    <a-select-option v-for="resource in resDataList" :key="resource.rescId">
                        {{ resource.rescUrl +'  ('+resource.rescName+') ['+resource.methodType+']'}}
                    </a-select-option>

                </a-select>

                </a-form-model-item>

            </a-row>

        </a-form-model>
    </a-modal>
</template>

<script>
    import * as API from "../../../util/api";
    import Common from "../../../util/common";
    import debounce  from '../../../util/debounce'

    export default {
        name: "func-add.vue",
        props:{
            funcAddModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                resDataList: [],
                loading: false,
                form:{
                    parentId: '',
                    funcName: '',
                    funcKey: '',
                    funcType: '',
                    funcSort: 1,
                    dirHide: false,
                    rescIdList:[],
                },
            }
        },
        computed: {
            funcTypeG(){
                return  Common.methods.getConst('func_type_group',this.$store.state.authProject);
            },
            funcTypeGName(){
                return Common.methods.formatConst(this.funcTypeG);
            }
        },
        methods:{
            handleCancel(){
                this.funcAddModal.visible = false;
                this.form = {
                    funcName: '',
                    funcKey: '',
                    parentId: '',
                    funcSort: 1,
                    dirHide: 1,
                    rescIdList:[],
                };
                this.resDataList = [];
            },
            handleOk(){
                this.loading = true;
                this.form.parentId = this.funcAddModal.parentId;
                this.$sendAjax.doPost(API.userFuncSave,this.form, {emulateJSON: false}).then((data)=>{
                    this.form = {};
                    this.$emit('addSuccess')
                }).finally(()=>{
                    this.loading=false;
                })
            },
            handleSearch:debounce(function (value) {
                const params = {keyword: value};
                this.$sendAjax.doGet(API.userRescSearch,{params}).then((data)=>{
                    this.resDataList = data.result;
                }).finally(()=>{
                    this.loading=false;
                })
            },500),
            handleChange(value) {
                this.form.rescIdList = value;
            },
        },
    }
</script>

<style scoped>

</style>