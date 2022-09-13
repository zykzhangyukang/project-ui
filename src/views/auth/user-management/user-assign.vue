<template>
    <a-modal
            title="分配角色"
            :cancelText="'取消'"
            width="500px"
            :okText="'提交'"
            :confirm-loading="loading"
            :visible="userAssignModal.visible"
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
                    :data-source="roleList"
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
        name: "user-assign.vue",
        props: {
            userAssignModal: {
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
                roleList: [],
                targetKeys: [],
            }
        },
        methods: {
            handleCancel() {
                this.userAssignModal.visible = false;
                this.form = {};
            },
            handleOk() {

                this.loading = true;
                const params = {
                    assignedIdList: this.targetKeys.map(e=>e).join(','),
                    userId: this.userAssignModal.userId
                }

                this.$sendAjax.doPost(API.authUserRoleUpdate, params , { emulateJSON: true }).then((data) => {
                    this.$message.success('分配角色成功！');
                    this.$emit('assignSuccess')
                }).finally(() => {
                    this.loading = false;
                })
            },
            userAssignInit() {
                this.loading = true;
                const params = {'userId': this.userAssignModal.userId};
                this.$sendAjax.doGet(API.authUserRoleUpdateInit,{params}).then((data)=>{

                    let rList = data.result.roleList;
                    if(rList.length>0){
                        const array= [];
                        rList.forEach(e=>{
                            array.push({
                                key: e.roleId+'',
                                title: e.roleName,
                                description: e.roleDesc,
                                chosen: true,
                            });
                        })
                        this.roleList = array;
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
            this.userAssignInit();
        }
    }
</script>

<style scoped>

</style>