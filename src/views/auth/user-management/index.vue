<template>
   <div>
         <a-form class="ant-advanced-search-form" :form="form" @submit="getTableList" layout="inline">
            <a-row >
               <a-col
                       :span="4"
               >
                  <a-form-item label="用户账号">
                     <a-input v-model="form.username"   />
                  </a-form-item>
               </a-col>
               <a-col
                       :span="4"
               >
                  <a-form-item label="真实姓名">
                     <a-input v-model="form.realName" />
                  </a-form-item>
               </a-col>
               <a-col
                       :span="4"
               >
                  <a-form-item label="用户状态">
                     <a-select style="width: 180px"   v-model="form.userStatus" @change="getTableList">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option v-for="item in userStatusG" :value="item.code" :key="item.code">
                           {{userStatusGName[item.code]}}
                        </a-select-option>
                     </a-select>
                  </a-form-item>
               </a-col>
               <a-col
                       :span="4"
               >
                  <a-form-item label="部门">
                     <a-select style="width: 180px"   v-model="form.deptCode" @change="getTableList" >
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option v-for="item in deptList" :value="item.deptCode" :key="item.deptCode">
                           {{item.deptName}}
                        </a-select-option>
                     </a-select>
                  </a-form-item>
               </a-col>
            </a-row>
            <a-row>
               <a-col :span="24" :style="{ textAlign: 'left' }">
                  <a-button icon="search" type="primary" @click="searchHandle" v-permission="'userPage'"  :loading="loading">
                     查询
                  </a-button>

                  <a-button icon="reload" :style="{ marginLeft: '8px' }"  @click="reset">
                     重置
                  </a-button>

                  <a-button icon="plus" :style="{ marginLeft: '8px'  }" v-permission="'userSave'" @click="userAddModal.visible = true">
                     新增
                  </a-button>
                  <a-button icon="edit" :style="{ marginLeft: '8px'  }" v-permission="'userUpdate'" @click="openUserEdit">
                     编辑
                  </a-button>
                  <a-button :style="{ marginLeft: '8px' }"  @click="openUserAssign" v-permission="'userAssign'">
                     分配角色
                  </a-button>
                  <a-button icon="delete" :style="{ marginLeft: '8px' }"  @click="del()" v-permission="'userDelete'">
                     删除
                  </a-button>
                  <a-button icon="check" :style="{ marginLeft: '8px'}" @click="enable" v-permission="'userEnable'">
                     启用
                  </a-button>
                  <a-button icon="info" :style="{ marginLeft: '8px'}" @click="disable" v-permission="'userDisable'">
                     禁用
                  </a-button>
                  <a-button icon="setting" :style="{ marginLeft: '8px'}" @click="openRestPasswordModal" v-permission="'userUpdatePwd'">
                     修改密码
                  </a-button>
               </a-col>
            </a-row>
         </a-form>
      <a-table
              :currentRow="selectItem"
              :rowKey="item => item.userId"
              :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
              style="margin-top: 10px"
              :columns="columns"
              :data-source="dataList"
              :loading="loading"
              size="middle"
              :pagination="false"
      >
         <template slot="userStatus" slot-scope="userStatus">
            <a-badge :status="userStatus===0?'error':'success'" />  {{userStatusGName[userStatus]}}
         </template>
         <template slot="roleList" slot-scope="userId">
            <a-button :size="'small'" type="link" icon="setting"  @click="showUserRoles(userId)"></a-button>
         </template>
      </a-table>

      <a-pagination style="margin-top: 10px" v-model="form.currentPage" :page-size="form.pageSize" :total="total" @change="handleTableChange" show-less-items />
      <user-edit :user-edit-modal="userEditModal" v-if="userEditModal.visible" @editSuccess="editSuccess"></user-edit>
      <user-add :user-add-modal="userAddModal" v-if="userAddModal.visible" @addSuccess="addSuccess"></user-add>
      <user-assign :user-assign-modal="userAssignModal" v-if="userAssignModal.visible" @assignSuccess="assignSuccess"></user-assign>
      <rest-password :rest-password-modal="restPasswordModal" @updatePwdSuccess="updatePwdSuccess"></rest-password>
   </div>
</template>


<script>
   import Common from '../../../util/common'
   import userAdd from './user-add'
   import userAssign from './user-assign'
   import restPassword from './reset-password'
   import userEdit from './user-edit'
   import * as API from "../../../util/api";
   import permission from "../../../util/permission";
    export default {
         directives:{
            permission
         },
         components:{
            userAdd,
            userEdit,
            userAssign,
            restPassword
         },
        data() {
            return {
               total: 500,
               deptList: [],
               selectItem: null,
               userAssignModal:{
                  visible: false,
               },
               userAddModal:{
                  visible: false,
               },
               restPasswordModal:{
                  visible: false,
               },
               userEditModal:{
                  visible: false,
               },
               loading: false,
               form: {
                  currentPage: 1,
                  pageSize: 9,
                  username: '',
                  realName: '',
                  userStatus: '',
                  deptCode: '',
               },
               selectedRowKeys:[],
               dataList:[],
               columns: [
                  {
                     title: '用户账号',
                     dataIndex: 'username',
                     width: '15%',
                  },
                  {
                     title: '真实姓名',
                     width: '15%',
                     dataIndex: 'realName',
                  },
                  {
                     title: '角色设置',
                     dataIndex: 'userId',
                     width: '10%',
                     scopedSlots: { customRender: 'roleList' },
                  },
                  {
                     title: '用户状态',
                     dataIndex: 'userStatus',
                     width: '15%',
                     scopedSlots: { customRender: 'userStatus' },
                  },
                  {
                     title: '部门',
                     dataIndex: 'deptName',
                     width: '15%',
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
            userStatusG(){
               return  Common.methods.getConst('user_status_group',this.$store.state.authProject);
            },
           userStatusGName(){
               return Common.methods.formatConst(this.userStatusG);
           }
        },
        updated() {
        },
        methods: {
           reset() {
              this.form = {
                 currentPage: 1,
                 pageSize: 9,
                 username: '',
                 realName: '',
                 userStatus: '',
                 deptCode: '',
              };
              this.selectedRowKeys = [];
              this.getTableList();
           },
           searchHandle(){
              this.form.currentPage = 1;
              this.getTableList();
           },
           getTableList(){
              const params = {};
              Object.keys(this.form).forEach(key=>{
                 params[key] = this.form[key];
              })


              this.loading = true;
              this.$sendAjax.doGet(API.authUserPage,{params}).then(data=>{
                 this.dataList = data.result.dataList;
                 this.total = data.result.totalRow;
                 this.selectedRowKeys = [];
              }).finally(()=>{
                 this.loading =false;
              })
           },
           getDeptList(){
              this.$sendAjax.doGet(API.authDeptList).then((data)=>{
                 this.deptList = data.result;
              })
           },
           del() {
              if (this.selectedRowKeys.length !== 1) {
                 return this.$message.warning('请选择一条记录删除');
              }
              const _this = this;
              this.$confirm({
                 title: '您确定要删除该用户?',
                 okText: '确认',
                 cancelText: '取消',
                 content: '这个用户将从系统中彻底移出，不可恢复!',
                 onOk() {
                    _this.loading=true;
                    const params = {userId: _this.selectedRowKeys[0]}
                    _this.$sendAjax.doGet(API.authUserDelete,{params}).then(() => {
                       _this.$message.success('删除成功！')
                       _this.getTableList();
                    }).finally(()=>{
                       _this.loading=false;
                    });
                 },
                 onCancel() {},
              });
           },
           enable() {
              if (this.selectedRowKeys.length !== 1) {
                 return this.$message.warning('请选择一条记录启用');
              }
              const _this = this;
              this.$confirm({
                 title: '您确定要启用该用户?',
                 okText: '确认',
                 cancelText: '取消',
                 content: '是否将用户恢复正常',
                 onOk() {
                    _this.loading=true;
                    _this.$sendAjax.doGet(API.authUserEnable+'?userId='+_this.selectedRowKeys[0]).then(({data: res}) => {
                       _this.$message.success('启用成功！')
                       _this.getTableList();
                    }).finally(()=>{
                       _this.loading=false;
                    });
                 },
                 onCancel() {},
              });
           },
           showUserRoles(userId){
              const _this = this;
              const params = {"userId": userId};
              this.$sendAjax.doGet(API.authUserRoleNames, {params}).then((data) => {
                 this.$confirm({
                    title: '角色信息',
                    okText: '分配角色',
                    cancelText: '取消关闭',
                    content: data.result && data.result.length > 0  ? JSON.stringify(data.result) : '暂未分配',
                    onOk() {
                       _this.userAssignModal.userId = userId;
                       _this.userAssignModal.visible = true;
                    },
                    onCancel() {},
                 });

              }).finally(()=>{
                 this.loading=false;
              });
           },
           disable() {
              if (this.selectedRowKeys.length !== 1) {
                 return this.$message.warning('请选择一条记录禁用');
              }
              const _this = this;
              this.$confirm({
                 title: '您确定要禁用该用户?',
                 okText: '确认',
                 cancelText: '取消',
                 content: '这个用户将从系统中禁用，不可正常使用!',
                 onOk() {
                    const params = {userId: _this.selectedRowKeys[0]};
                    _this.loading=true;
                    _this.$sendAjax.doGet(API.authUserDisable,{params}).then(() => {
                       _this.$message.success('禁用成功！')
                       _this.getTableList();
                    }).finally(()=>{
                       _this.loading=false;
                    });
                 },
                 onCancel() {},
              });
           },
           openUserAssign(){
              if (this.selectedRowKeys.length !== 1) {
                 return this.$message.warning('请选择一条记录进行分配');
              }
              this.userAssignModal.userId = this.selectedRowKeys[0];
              this.userAssignModal.visible = true;
           },
           openRestPasswordModal(){
              if (this.selectedRowKeys.length !== 1) {
                 return this.$message.warning('请选择一条记录进行修改密码');
              }
              this.restPasswordModal.visible = true;
              this.restPasswordModal.userId = this.selectedRowKeys[0];
           },
           openUserEdit(){
              if (this.selectedRowKeys.length !== 1) {
                 return this.$message.warning('请选择一条记录进行编辑');
              }
              this.userEditModal.userId = this.selectedRowKeys[0];
              this.userEditModal.visible = true;
           },
           onSelectChange(rowKeys){
              this.selectedRowKeys = rowKeys;
           },
           handleTableChange(currentPage,pageSize) {
              this.form.currentPage = currentPage;
              this.pageSize = pageSize;
              this.getTableList();
           },
           addSuccess(){
              this.userAddModal.visible=false;
              this.getTableList();
           },
           editSuccess(){
              this.userEditModal.visible=false;
              this.getTableList();
           },
           assignSuccess(){
              this.userAssignModal.visible=false;
              this.getTableList();
           },
           updatePwdSuccess(){
              this.restPasswordModal.visible=false;
              this.getTableList();
           },
        },
       created() {
            this.getTableList();
            this.getDeptList();
       }
    };
</script>
<style>
</style>