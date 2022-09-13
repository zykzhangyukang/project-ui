<template>
    <div>
        <a-form class="ant-advanced-search-form" :form="form" @submit="getTableList" layout="inline">
            <a-row :gutter="1">
                <a-col
                        :span="5"
                >
                    <a-form-item label="角色名称">
                        <a-input v-model="form.roleName" allowClear  />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col
                        :span="24"
                >
                    <a-button icon="search" type="primary" @click="searchHandle" :loading="loading" v-permission="'rolePage'" >
                        查询
                    </a-button>

                    <a-button icon="reload" :style="{ marginLeft: '8px' }" @click="reset">
                        重置
                    </a-button>

                    <a-button icon="plus" :style="{ marginLeft: '8px' }" @click="roleAddModal.visible = true" v-permission="'roleSave'">
                        新增
                    </a-button>
                    <a-button icon="edit" :style="{ marginLeft: '8px' }" @click="openRoleEdit" v-permission="'roleUpdate'">
                        编辑
                    </a-button>
                    <a-button :style="{ marginLeft: '8px' }" @click="openRoleAssignModal" v-permission="'roleAssign'">
                        分配用户
                    </a-button>
                    <a-button icon="delete" :style="{ marginLeft: '8px' }"  @click="del()" v-permission="'roleDelete'">
                        删除
                    </a-button>
                    <a-button :style="{ marginLeft: '8px' }"  @click="openRoleAuthModal" v-permission="'roleAuth'">
                        分配功能
                    </a-button>
                </a-col>
            </a-row>
        </a-form>
        <a-table
                :currentRow="selectItem"
                :rowKey="item => item.roleId"
                :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
                style="margin-top: 10px"
                :columns="columns"
                :data-source="dataList"
                :loading="loading"
                :pagination="false"
                size="middle"
        >
            <template slot="userNameList" slot-scope="userNameList" >
                <span>
                     <a-badge :status="userNameList && userNameList.length >0 ?'success': 'default'" >
                       <a-button icon="unordered-list" :size="'small'" @click="openRoleUserListModal(userNameList)" ></a-button>
                     </a-badge>
                </span>

            </template>
        </a-table>

        <a-pagination style="margin-top: 10px" v-model="form.currentPage" :page-size="form.pageSize" :total="total" @change="handleTableChange" show-less-items />

        <role-auth :role-auth-modal="roleAuthModal" v-if="roleAuthModal.visible" @authFuncSuccess="authFuncSuccess"></role-auth>
        <role-add :role-add-modal="roleAddModal" @addSuccess="addSuccess"></role-add>
        <role-edit :role-edit-modal="roleEditModal" v-if="roleEditModal.visible" @editSuccess="editSuccess"></role-edit>
        <role-user-list :role-user-list-modal="roleUserListModal" ></role-user-list>
        <role-assign :role-assign-modal="roleAssignModal" v-if="roleAssignModal.visible" @assignSuccess="assignSuccess"></role-assign>

    </div>
</template>


<script>
    import * as API from "../../../util/api";
    import roleAdd from './role-add';
    import roleEdit from './role-edit'
    import roleUserList from './role-user-list'
    import roleAssign from  './role-assign'
    import roleAuth from  './role-auth'
    import permission from "../../../util/permission";
    export default {
        directives:{
            permission
        },
        components:{
            roleAdd,
            roleEdit,
            roleUserList,
            roleAssign,
            roleAuth,
        },
        data() {
            return {
                total: 0,
                selectItem: null,
                roleAssignModal:{
                    visible: false,
                },
                roleAddModal:{
                    visible: false,
                },
                roleEditModal:{
                    visible: false,
                },
                roleAuthModal:{
                    visible: false,
                },
                roleUserListModal:{
                    visible: false,
                },
                loading: false,
                form:{
                    currentPage:1,
                    pageSize: 10,
                    roleStatus: ''
                },
                selectedRowKeys:[],
                dataList:[],
                columns: [
                    {
                        title: '角色名称',
                        dataIndex: 'roleName',
                    },
                    {
                        title: '角色描述',
                        dataIndex: 'roleDesc',
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                    },
                    {
                        title: '修改时间',
                        dataIndex: 'updateTime',
                    },
                    {
                        title: '用户列表',
                        dataIndex: 'userNameList',
                        width: '10%',
                        scopedSlots: { customRender: 'userNameList' },
                    },
                ]
            };
        },
        methods: {
            reset(){
                this.form = {
                    currentPage:1,
                    pageSize: 10,
                    roleName: ''
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
                this.$sendAjax.doGet(API.userRolePage,{params}).then((data) => {
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
                    title: '您确定要删除该角色?',
                    okText: '确认',
                    cancelText: '取消',
                    content: '这个角色将从系统中彻底移出，不可恢复!',
                    onOk() {
                        const params = {roleId: _this.selectedRowKeys[0]};
                        _this.loading=true;
                        _this.$sendAjax.doGet(API.userRoleDelete,{params}).then(({data}) => {
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
                this.roleAddModal.visible=false;
                this.getTableList();
            },
            openRoleEdit(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录进行编辑');
                }
                this.roleEditModal.roleId = this.selectedRowKeys[0];
                this.roleEditModal.visible = true;
            },
            openRoleAssignModal(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录进行编辑');
                }
                this.roleAssignModal.roleId = this.selectedRowKeys[0];
                this.roleAssignModal.visible = true;
            },
            openRoleAuthModal(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录进行操作');
                }
                this.roleAuthModal.roleId = this.selectedRowKeys[0];
                this.roleAuthModal.visible = true;
            },
            openRoleUserListModal(userNameList){
                this.roleUserListModal.roleId = this.selectedRowKeys[0];
                this.roleUserListModal.visible = true;
                this.roleUserListModal.userNameList = userNameList;
            },
            editSuccess(){
                this.roleEditModal.visible=false;
                this.getTableList();
            },
            assignSuccess(){
                this.roleAssignModal.visible=false;
                this.getTableList();
            },
            authFuncSuccess(){
                this.roleAuthModal.visible=false;
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