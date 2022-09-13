<template>
    <a-modal
            title="角色授权"
            :cancelText="'取消'"
            width="400px"
            :okText="'提交'"
            @cancel="handleCancel"
            @ok="handleOk"
            :visible="roleAuthModal.visible"
    >
        <div class="wrapper">
            <a-tree
                    v-model="checkedKeys"
                    :checkable="true"
                    :expanded-keys="expandedKeys"
                    :auto-expand-parent="autoExpandParent"
                    :selected-keys="selectedKeys"
                    :tree-data="treeData"
                    @expand="onExpand"
                    @select="onSelect"
                    @check ="onBusinessSelectChange"
            >
            </a-tree>
        </div>

        <role-auth-tips :role-auth-tips-modal="roleAuthTipsModal" @confirmAuth="confirmAuth"></role-auth-tips>
    </a-modal>


</template>

<script>
    import RoleAuthTips from './role-auth-tips'
    import * as API from "../../../util/api";

    export default {
        props: {
            roleAuthModal: {
                type: Object,
                visible: {
                    type: Boolean
                },
            }
        },
        components: {
            RoleAuthTips,
        },
        name: "role-auth.vue",
        data() {
            return {
                // 默认展开
                expandedKeys: ['root'],
                // 是否自动展开父节点
                autoExpandParent: true,
                // 当前复选框被选中的节点 父亲与儿子也在同一个数组 所有儿子被选中则父亲也被选中
                checkedKeys: [],
                // 当前被点击的节点
                selectedKeys: [],
                // 树的信息,只包括 所有父亲与孩子的title和key
                treeData:[],
                allSelectedNodes: [],
                deepNode:[],
                roleAuthTipsModal:{
                    visible: false,
                },
            };
        },
        watch: {
        },
        methods: {
            authFuncInit(roleId){
                const params = {roleId: roleId}
                this.$sendAjax.doGet(API.userRoleAuthInit, {params}).then((data) => {
                    this.treeData = data.result.allTreeList;
                    this.allSelectedNodes = data.result.funcKeyList;
                    this.deepList(this.treeData);
                    // 取交集
                    this.checkedKeys = [...new Set(this.deepNode)].filter((item) => new Set(eval(data.result.funcKeyList)).has(item));
                    this.expandedKeys = this.checkedKeys;
                }).finally(() => {
                    this.loading = false;
                })
            },
            handleCancel() {
                this.roleAuthModal.visible = false;
            },
            deepList(data){
                data.map((item) => {
                    if (item.children && item.children.length > 0) {
                        this.deepList(item.children);
                    } else {
                        //数组存放
                        this.deepNode.push(item.key);
                    }
                });
            },
            handleOk(){
                const params = {
                    funcKeyList: this.allSelectedNodes.map(e=>e).join(','),
                    roleId: this.roleAuthModal.roleId
                }
                this.$sendAjax.doPost(API.userRoleAuthFuncCheck, params , { emulateJSON: true }).then((res) => {

                    // if((!res.result.insertList || res.result.insertList.length === 0) && (!res.result.delList || res.result.delList.length ===0)){
                    //     return this.$message.warning('本次分配没有任何修改');
                    // }

                    this.roleAuthTipsModal.visible = true;
                    this.roleAuthTipsModal.insertList = res.result.insertList;
                    this.roleAuthTipsModal.delList = res.result.delList;
                });
            },
            confirmAuth(){
                this.loading = true;
                const params = {
                    funcKeyList: this.allSelectedNodes.map(e=>e).join(','),
                    roleId: this.roleAuthModal.roleId
                }
                this.$sendAjax.doPost(API.roleFuncUpdate, params , { emulateJSON: true }).then(() => {
                    this.$message.success('分配功能成功！');
                    this.$emit('authFuncSuccess')
                }).finally(() => {
                    this.loading = false;
                })
            },
            onExpand(expandedKeys) {
                this.expandedKeys = expandedKeys;
                this.autoExpandParent = false;
            },
            // 点击树节点触发
            onSelect(selectedKeys, info) {
                this.selectedKeys = selectedKeys;
            },
            onBusinessSelectChange(selectedKeys, info) {
                // 已勾选子节点以及半勾选状态的父节点
                this.allSelectedNodes = selectedKeys.concat(info.halfCheckedKeys);
            },
        },
        created() {
            this.authFuncInit(this.roleAuthModal.roleId);
        }
    }
</script>

<style scoped>
.wrapper{
    cursor: pointer;
    min-height: 300px;
    max-height: 500px;
    overflow: auto;
}
</style>