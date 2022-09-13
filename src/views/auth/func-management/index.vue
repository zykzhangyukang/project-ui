<template>
   <div>
       <a-row :gutter="10">
           <a-col  :span="3">
               <a-card id="left-menu">
                   <a-input-search style="margin-bottom: 8px" size="small" placeholder="功能搜索" @change="onChange" />
                   <a-tree  :show-line="true"
                            @click="treeSelect"
                            :auto-expand-parent="autoExpandParent"
                            :expanded-keys="expandedKeys"
                           :tree-data="funcTreeList"
                            @expand="onExpand"
                   >
                       <template slot="title" slot-scope="{ title }">
                                <span v-if="title.indexOf(searchValue) > -1">
                                  {{ title.substr(0, title.indexOf(searchValue)) }}
                                  <span style="color: #ff5500;">{{ searchValue }}</span>
                                  {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
                                </span>
                           <span v-else >{{ title }}</span>
                       </template>
                   </a-tree>
               </a-card>
           </a-col>
           <a-col  :span="20">
               <a-card>

                   <a-form class="ant-advanced-search-form"  layout="inline">
                       <a-row :gutter="0">
                           <a-col
                                   :span="5"
                           >
                               <a-form-item label="功能名称">
                                   <a-input v-model="form.funcName"   />
                               </a-form-item>
                           </a-col>
                           <a-col
                                   :span="5"
                           >
                               <a-form-item label="功能key">
                                   <a-input v-model="form.funcKey"    />
                               </a-form-item>
                           </a-col>
                           <a-col
                                   :span="5"
                           >
                               <a-form-item label="资源url">
                                   <a-input v-model="form.rescUrl"    />
                               </a-form-item>
                           </a-col>
                           <a-col
                                   :span="5"
                           >
                               <a-form-item label="功能类型">
                                   <a-select style="width: 180px"   v-model="form.funcType" @change="getTableList">
                                       <a-select-option value="">全部</a-select-option>
                                       <a-select-option v-for="item in funcTypeG" :value="item.code" :key="item.code">
                                           {{funcTypeGName[item.code]}}
                                       </a-select-option>
                                   </a-select>
                               </a-form-item>
                           </a-col>
                       </a-row>
                       <a-row>
                           <a-col
                                   :span="24"
                           >
                               <a-button icon="search" type="primary"  @click="searchHandle" v-permission="'funcPage'">
                                   查询
                               </a-button>

                               <a-button icon="reload" :style="{ marginLeft: '8px' }" @click="reset" >
                                   重置
                               </a-button>

                               <a-button icon="edit" :style="{ marginLeft: '8px' }" @click="openFuncEditModal" v-permission="'funcUpdate'">
                                   编辑
                               </a-button>
                               <a-button icon="delete" :style="{ marginLeft: '8px' }" @click="del()" v-permission="'funcDelete'">
                                   删除
                               </a-button>
                               <a-button icon="clear" :style="{ marginLeft: '8px' }" @click="delUserBind()" v-permission="'funcUserUnbind'">
                                   解绑用户
                               </a-button>
                               <a-button icon="clear" :style="{ marginLeft: '8px',marginRight: '8px' }" @click="delResourceBind()" v-permission="'funcRescUnbind'">
                                   解绑资源
                               </a-button>
                               <a-button icon="plus" type="success" v-if="form.parentFuncName" :style="{ marginLeft: '8px',color:'#f40' }"  @click="openFuncAddModal">
                                   {{form.parentFuncName}}
                               </a-button>
<!--                               <span v-if="form.parentFuncName"> 当前选中: <a-tag color="blue"> {{form.parentFuncName}}</a-tag></span>-->
                           </a-col>
                       </a-row>
                   </a-form>
                   <a-table
                           :currentRow="selectItem"
                           :rowKey="item => item.funcId"
                           :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, type: 'radio' }"
                           style="margin-top: 10px"
                           :columns="columns"
                           :data-source="dataList"
                           :loading="loading"
                           :pagination="false"
                           size="middle"
                   >
                       <template slot="rescVOList" slot-scope="rescVOList" >
                           <a-icon type="ordered-list" v-if="rescVOList && rescVOList.length>0" @click="openResListModal(rescVOList)">  </a-icon>
                           <span v-else></span>
                       </template>

                       <template slot="userVOList" slot-scope="userVOList" >
                          <span style="font-size: 6px;cursor: pointer;color: #1890ff;font-family: 宋体" @click="openUserListModal(userVOList)">{{userVOList.map(e=>e.realName).join(',')}}</span>
<!--                           <a-icon type="user" @click="openUserListModal(userVOList)">  </a-icon>-->
                       </template>

                       <template slot="funcType" slot-scope="funcType" >
                          <span>{{funcTypeGName[funcType]}}</span>
                       </template>
                       <template slot="dirHide" slot-scope="dirHide" >
                         <span v-if="dirHide===true">隐藏</span>
                         <span v-else-if="dirHide===false">展示</span>
                         <span v-else></span>
                       </template>
                   </a-table>

                   <a-pagination style="margin-top: 10px" v-model="form.currentPage" :page-size="form.pageSize" :total="total" @change="handleTableChange" show-less-items />

               </a-card>
           </a-col>
       </a-row>

       <func-edit :func-edit-modal="funcEditModal" v-if="funcEditModal.visible" @editSuccess="editSuccess"></func-edit>
       <func-add :func-add-modal="funcAddModal" @addSuccess="addSuccess"></func-add>
       <res-list :res-list-modal="resListModal"></res-list>
       <user-list :user-list-modal="userListModal" v-if="userListModal.visible"></user-list>
   </div>
</template>

<script>
    import * as API from "../../../util/api";
    import resList from './res-list'
    import userList from './user-list'
    import funcAdd from './func-add'
    import funcEdit from './func-edit'
    import Common from "../../../util/common";
    import permission from "../../../util/permission";
    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    export default {
        directives:{
            permission
        },
        name: "index",
        components:{
          resList,
            userList,
            funcAdd,
            funcEdit,
        },
        data(){
            return {
                visible: false,
                form: {
                    currentPage:1,
                    pageSize: 10,
                    parentId: '',
                    funcName: '',
                    funcKey: '',
                    parentFuncName: '',
                    rescUrl: '',
                    funcType:'',
                },
                searchValue:'',
                dataList:[],
                autoExpandParent:true,
                expandedKeys:[],
                funcTreeList: [],
                funcList: [],
                total: 0,
                selectItem: null,
                resourceAssignModal:{
                    visible: false,
                },
                funcEditModal:{
                    visible: false,
                },
                resourceAddModal:{
                    visible: false,
                },
                resListModal:{
                    visible: false,
                },
                funcAddModal:{
                    visible: false,
                },
                userListModal:{
                    visible: false,
                },
                loading: false,
                selectedRowKeys:[],
                columns: [
                    {
                        title: '功能名称',
                        dataIndex: 'funcName',
                    },
                    {
                        title: '功能KEY',
                        dataIndex: 'funcKey',
                        width: '15%',
                    },
                    {
                        title: '功能类型',
                        dataIndex: 'funcType',
                        scopedSlots: { customRender: 'funcType' },
                    },
                    {
                        title: '父级目录',
                        dataIndex: 'parentFuncName',
                    },
                   {
                        title: '资源列表',
                        dataIndex: 'rescVOList',
                        scopedSlots: { customRender: 'rescVOList' },
                        width: "100px",
                    }, {
                        title: '功能拥有者',
                        dataIndex: 'userVOList',
                        ellipsis: true,
                        scopedSlots: { customRender: 'userVOList' },
                        width: "180px",
                    }
                    ,{
                        title: '功能排序',
                        dataIndex: 'funcSort',
                        width: "80px",
                    },
                    {
                        title: '目录隐藏',
                        dataIndex: 'dirHide',
                        scopedSlots: { customRender: 'dirHide' },
                        width: "100px",
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        width: '13%',
                    },
                ]
            };
        },
        methods:{
            reset(){
                this.form = {
                    currentPage:1,
                    pageSize: 10,
                    parentId: '',
                    funcName: '',
                    funcKey: '',
                };
                this.selectedKeys = [];
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

                this.$sendAjax.doGet(API.userFuncPage,{params}).then((data) => {
                    this.dataList = data.result.dataList;
                    this.total = data.result.totalRow;
                    this.selectedRowKeys = [];
                }).finally(()=>{
                    this.loading=false;
                });
            },
            getFuncTree(){
                this.$sendAjax.doGet(API.userFuncListTree).then((data)=>{
                    this.funcTreeList = data.result.funcTreeVOList;
                    this.funcList = data.result.funcVOList;
                    //this.expandedKeys =  this.funcList.map(e=> e.key);
                    this.expandedKeys = ['root'];
                })
            },
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            onChange(e) {
                const value = e.target.value;
                const expandedKeys = this.funcList.map(item => {
                        if (item.title.indexOf(value) > -1) {
                            return getParentKey(item.key, this.funcTreeList);
                        }
                        return null;
                    })
                    .filter((item, i, self) => item && self.indexOf(item) === i);
                Object.assign(this, {
                    expandedKeys,
                    searchValue: value,
                    autoExpandParent: true,
                });

            },
            del() {
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录删除');
                }
                const _this = this;
                this.$confirm({
                    title: '您确定要删除该功能?',
                    okText: '确认',
                    cancelText: '取消',
                    content: '这个功能将从系统中彻底移出，不可恢复!',
                    onOk() {
                        _this.loading=true;
                        const params = {funcId: _this.selectedRowKeys[0]}
                        _this.$sendAjax.doGet(API.userFuncDelete,{params}).then(() => {
                            _this.$message.success('删除成功！')
                            _this.getTableList();
                        }).finally(()=>{
                            _this.loading=false;
                        });
                    },
                    onCancel() {},
                });
            },
            delUserBind(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录进行用户解绑');
                }
                const _this = this;
                this.$confirm({
                    title: '您确定要用户解绑?',
                    okText: '确认',
                    cancelText: '取消',
                    content: '将删除所有该功能-角色的关联!',
                    onOk() {
                        _this.loading=true;
                        const params = {funcId: _this.selectedRowKeys[0]}
                        _this.$sendAjax.doGet(API.userFuncDeleteUserBind,{params}).then(() => {
                            _this.$message.success('解绑用户成功！')
                            _this.getTableList();
                        }).finally(()=>{
                            _this.loading=false;
                        });
                    },
                    onCancel() {},
                });
            },
            delResourceBind(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录进行资源解绑');
                }
                const _this = this;
                this.$confirm({
                    title: '您确定要解绑资源?',
                    okText: '确认',
                    cancelText: '取消',
                    content: '将删除所有该功能-资源的关联!',
                    onOk() {
                        _this.loading=true;
                        const params = {funcId: _this.selectedRowKeys[0]}
                        _this.$sendAjax.doGet(API.userFuncDeleteResourceBind,{params}).then(() => {
                            _this.$message.success('解绑资源成功！')
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
            treeSelect(selectedKeys,node){
                this.form.parentId = node.value;
                this.form.parentFuncName = this.funcList.find(e=>e.value=== node.value).title;
                this.form.currentPage = 1;
                this.getTableList();
            },
            openResListModal(rescList){
                this.resListModal.visible = true;
                this.resListModal.rescList = rescList;
            },
            openUserListModal(userVOList){
                this.userListModal.visible = true;
                this.userListModal.userVOList = userVOList;
            },
            openFuncAddModal(){

                if(!this.form.parentId){
                    return this.$message.warning('请点击左侧功能节点,在节点下添加功能!');
                }
                this.funcAddModal.visible = true;
                this.funcAddModal.parentFuncName = this.form.parentFuncName;
                this.funcAddModal.parentId = this.form.parentId;
            },
            openFuncEditModal(){
                if (this.selectedRowKeys.length !== 1) {
                    return this.$message.warning('请选择一条记录编辑');
                }
                this.funcEditModal.visible = true;
                this.funcEditModal.funcId =  this.selectedRowKeys[0]
            },
            addSuccess(){
                this.funcAddModal.visible = false;
                this.getTableList();
            },
            editSuccess(){
                this.funcEditModal.visible=false;
                this.getTableList();
            },
        },
        computed:{
            funcTypeG(){
                return  Common.methods.getConst('func_type_group',this.$store.state.authProject);
            },
            funcTypeGName(){
                return Common.methods.formatConst(this.funcTypeG);
            }
        },
        created() {
            this.getFuncTree();
            this.getTableList();
        }
    }
</script>

<style scoped>
#left-menu{
    height: 80vh;
    overflow: auto;
}
</style>