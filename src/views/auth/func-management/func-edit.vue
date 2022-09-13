<template>
    <a-modal
            width="650px"
            title="编辑功能"
            :cancelText="'取消'"
            :okText="'提交'"
            :mask-closable="false"
            :confirm-loading="loading"
            :visible="funcEditModal.visible"
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
                        <a-form-model-item ref="parentFuncName"  label="父级功能" prop="parentFuncName" >
                            <a-input placeholder="父级功能"  disabled="" v-model="form.parentFuncName"/>
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

                        <a-form-model-item ref="funcKey"  label="功能Key " prop="funcKey" >
                            <a-input  v-model="form.funcKey"/>
                        </a-form-model-item>


                    </a-col>

                    <a-col
                            :span="12"
                    >

                        <a-form-model-item ref="funcName"  label="功能名称" prop="funcName" >
                            <a-input   v-model="form.funcName"/>
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
                                v-model="rescIdList"
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
        </a-spin>
    </a-modal>
</template>

<script>
    import * as API from "../../../util/api";
    import Common from "../../../util/common";
    import debounce  from '../../../util/debounce'
    export default {
        name: "func-edit.vue",
        props:{
            funcEditModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                rescIdList:[],
                resDataList:[],
                loading: false,
                form:{},
            }
        },
        computed:{
            funcTypeG(){
                return  Common.methods.getConst('func_type_group',this.$store.state.authProject);
            },
            funcTypeGName(){
                return Common.methods.formatConst(this.funcTypeG);
            }
        },
        methods:{
            handleCancel(){
                this.funcEditModal.visible = false;
                this.form = {};
            },
            handleOk(){
                this.loading = true;
                const params = {
                    funcId: this.form.funcId,
                    funcName: this.form.funcName,
                    funcKey: this.form.funcKey,
                    funcType: this.form.funcType,
                    funcSort: this.form.funcSort,
                    dirHide: this.form.dirHide,
                    rescIdList: this.rescIdList,
                }
                this.$sendAjax.doPost(API.userFuncUpdate,params,{emulateJSON: false}).then(()=>{
                    this.form = {};
                    this.$emit('editSuccess')
                }).finally(()=>{
                    this.loading=false;
                })
            },
            select(funcId){
                this.loading = true;
                const params = {funcId: funcId};
                this.$sendAjax.doGet(API.userFuncSelect,{params}).then((data)=>{
                    this.form = data.result;
                    this.resDataList = data.result.rescVOList;
                    this.rescIdList = data.result.rescIdList;
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
                this.rescIdList = value;
            },
        },
        created() {
            this.select(this.funcEditModal.funcId);
        }
    }
</script>

<style scoped>

</style>