<template>
    <a-modal
            title="分配用户"
            :cancelText="'取消'"
            width="500px"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="roleAssignModal.visible"
            @cancel="handleCancel"
            @ok="handleOk"
    >
        <a-spin tip="加载中..." :spinning="loading" >
            <a-transfer
                    :titles="['未分配', '已分配']"
                    :list-style="{
                      width: '200px',
                      height: '350px',
                    }"
                    :data-source="userList"
                    :filter-option="filterOption"
                    :target-keys="targetKeys"
                    :render="item => item.title"
                    @change="handleChange"
            />
        </a-spin>
    </a-modal>
</template>

<script>
    import * as API from '../../../util/api'
    export default {
        name: "role-assign.vue",
        props: {
            roleAssignModal: {
                type: Object,
                visible: {
                    type: Boolean
                },
                userId: {
                    type: Number
                }
            }
        },
        data() {
            return {
                loading: false,
                form: {
                    assignedIdList: [],
                },
                userList: [],
                targetKeys: [],
            }
        },
        methods: {
            handleCancel() {
                this.roleAssignModal.visible = false;
                this.form = {};
            },
            handleOk() {

                this.loading = true;
                const params = {
                    assignedIdList: this.targetKeys.map(e=>e).join(','),
                    roleId: this.roleAssignModal.roleId
                }

                this.$sendAjax.doPost(API.userRoleUpdateUser, params , { emulateJSON: true }).then(() => {
                    this.$message.success('分配用户成功！');
                    this.$emit('assignSuccess')
                }).finally(() => {
                    this.loading = false;
                })
            },
            roleAssignInit() {
                this.loading = true;
                const params = {'roleId': this.roleAssignModal.roleId};
                this.$sendAjax.doGet(API.userRoleUpdateUserInit,{params}).then((data)=>{

                    let rList = data.result.userList;
                    if(rList.length>0){
                        const array= [];
                        rList.forEach(e=>{
                            array.push({
                                key: e.userId+'',
                                title: e.realName,
                                chosen: true,
                            });
                        })
                        this.userList = array;
                    }
                    let assignedKeys = data.result.assignedIdList;
                    if(assignedKeys.length>0){
                        const array= [];
                        assignedKeys.forEach(e=>{
                            array.push(e+'');
                        })
                        this.targetKeys=array;
                    }

                }).finally(() => {
                    this.loading = false;
                })
            },
            filterOption(inputValue, option) {
                return option.description.indexOf(inputValue) > -1;
            },
            handleChange(targetKeys, direction, moveKeys) {
                this.targetKeys = targetKeys;
            },
        },
        created() {
            this.roleAssignInit();
        }
    }
</script>

<style scoped>

</style>