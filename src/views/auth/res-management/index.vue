<template>
    <div>
        <a-form class="ant-advanced-search-form" :form="form" @submit="getTableList" layout="inline">
            <a-row :gutter="0">
                <a-col
                        :span="4"
                >
                    <a-form-item label="资源名称">
                        <a-input v-model="form.rescName"   />
                    </a-form-item>
                </a-col>
                <a-col
                        :span="4"
                >
                    <a-form-item label="资源url">
                        <a-input v-model="form.rescUrl"   />
                    </a-form-item>
                </a-col>
                <a-col
                        :span="4"
                >
                    <a-form-item label="所属项目">
                        <a-select style="width: 180px"   v-model="form.rescDomain" @change="getTableList">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option v-for="item in rescDomainG" :value="item.code" :key="item.code">
                                {{rescDomainGName[item.code]}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col
                        :span="4"
                >
                    <a-form-item label="请求方式">
                        <a-select style="width: 180px"   v-model="form.methodType" @change="getTableList">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option v-for="item in methodTypeG" :value="item.code" :key="item.code">
                                {{methodTypeGName[item.code]}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col
                        :span="24"
                >
                    <a-button icon="search" type="primary" @click="searchHandle"  :loading="loading" v-permission="'rescPage'">
                        查询
                    </a-button>

                    <a-button icon="reload" :style="{ marginLeft: '8px' }" @click="reset">
                        重置
                    </a-button>

                    <a-button icon="plus" :style="{ marginLeft: '8px' }" @click="resourceAddModal.visible = true" v-permission="'rescSave'">
                        新增
                    </a-button>
                    <a-button icon="edit" :style="{ marginLeft: '8px' }" @click="openRoleEdit" v-permission="'rescUpdate'">
                        编辑
                    </a-button>
                    <a-button icon="delete" :style="{ marginLeft: '8px' }"  @click="del()" v-permission="'rescDelete'">
                        删除
                    </a-button>
                </a-col>
            </a-row>
        </a-form>
        <a-table
                :currentRow="selectItem"
                :rowKey="item => item.rescId"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
                style="margin-top: 10px"
                :columns="columns"
                :data-source="dataList"
                :loading="loading"
                :pagination="false"
                size="middle"
        >
            <template slot="rescDomain" slot-scope="rescDomain">
                {{rescDomainGName[rescDomain]}}
            </template>
            <template slot="methodType" slot-scope="methodType">
               <a-tag v-if="methodType==='get' " color="blue" > {{methodTypeGName[methodType]}}</a-tag>
                <a-tag v-if="methodType==='post'" color="green"> {{methodTypeGName[methodType]}}</a-tag>
                <a-tag v-if="methodType==='delete'" color="red"> {{methodTypeGName[methodType]}}</a-tag>
                <a-tag v-if="methodType==='put'" color="purple"> {{methodTypeGName[methodType]}}</a-tag>
            </template>
        </a-table>

        <a-pagination style="margin-top: 10px" v-model="form.currentPage" :page-size="form.pageSize" :total="total" @change="handleTableChange" show-less-items />

        <res-add :res-add-modal="resourceAddModal" @addSuccess = "addSuccess"></res-add>
        <res-edit :res-edit-modal="rescEditModal" @editSuccess="editSuccess" v-if="rescEditModal.visible"></res-edit>
    </div>
</template>


<script>
    import * as API from "../../../util/api";
    import Common from "../../../util/common";
    import resAdd from './res-add'
    import resEdit from './resc-edit'
    import permission from "../../../util/permission";
    export default {
        directives:{
            permission
        },
        components:{
          resAdd,
            resEdit
        },
        data() {
            return {
                total: 0,
                selectItem: null,
                rescAssignModal:{
                    visible: false,
                },
                resourceAddModal:{
                    visible: false,
                },
                rescEditModal:{
                    visible: false,
                },
                rescUserListModal:{
                    visible: false,
                },
                loading: false,
                form:{
                    currentPage:1,
                    pageSize: 10,
                    rescName: '',
                    rescUrl: '',
                    rescDomain: '',
                    methodType: '',
                },
                selectedRowKeys:[],
                dataList:[],
                columns: [
                    {
                        title: '资源名称',
                        dataIndex: 'rescName',
                        width: '15%',
                    },
                    {
                        title: '资源url',
                        dataIndex: 'rescUrl',
                        width: '20%',
                    },
                    {
                        title: '所属项目',
                        dataIndex: 'rescDomain',
                        scopedSlots: { customRender: 'rescDomain' },
                    },
                    {
                        title: '请求方式',
                        dataIndex: 'methodType',
                        scopedSlots: { customRender: 'methodType' },
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        width: '15%',
                    },
                    {
                        title: '修改时间',
                        dataIndex: 'updateTime',
                        width: '15%',
                    },
                ]
            };
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
        methods: {
            reset(){
                this.form = {
                    currentPage:1,
                    pageSize: 10,
                    rescName: '',
                    rescUrl: '',
                    rescDomain: '',
                    methodType: '',
                };
                this.getTableList();
            },
            searchHandle(){
                this.form.currentPage = 1;
                this.getTableList();
            },
            getTableList(){
                this.loading = true;

                const params = {};
                Object.keys(this.form).forEach(key=>{
                    params[key] = this.form[key];
                })

                this.$sendAjax.doGet(API.userRescPage,{params}).then((data) => {
                    this.dataList = data.result.dataList;
                    this.total = data.result.totalRow;
                    this.selectedRowKeys = [];
                }).finally(()=>{
                    this.loading=false;
                });
            },
            del() {
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录删除');
                }
                const _this = this;
                this.$confirm({
                    title: '您确定要删除该资源?',
                    okText: '确认',
                    cancelText: '取消',
                    content: '这个资源将从系统中彻底移出，不可恢复!',
                    onOk() {
                        const params = {rescId: _this.selectedRowKeys[0]};
                        _this.loading=true;
                        _this.$sendAjax.doGet(API.userRescDelete,{params}).then(() => {
                            _this.$message.success('删除成功！')
                            _this.getTableList();
                        }).finally(()=>{
                            _this.loading=false;
                        });
                    },
                    onCancel() {},
                });
            },
            onSelectChange(rowKeys){
                this.selectedRowKeys = rowKeys;
            },
            handleTableChange(currentPage,pageSize) {
                this.form.currentPage = currentPage;
                this.form.pageSize = pageSize;
                this.getTableList();
            },
            addSuccess(){
                this.resourceAddModal.visible=false;
                this.getTableList();
            },
            openRoleEdit(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录进行编辑');
                }
                this.rescEditModal.rescId = this.selectedRowKeys[0];
                this.rescEditModal.visible = true;
            },
            openRoleUserListModal(userNameList){
                this.rescUserListModal.visible = true;
                this.rescUserListModal.userNameList = userNameList;
            },
            editSuccess(){
                this.rescEditModal.visible=false;
                this.getTableList();
            },
        },
        created() {
            this.getTableList();
        }
    };
</script>
<style>
</style>