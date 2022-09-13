<template>
    <a-modal
            width="650px"
            title="用户列表"
            :cancelText="'取消'"
            :okText="'确定'"
            :confirm-loading="loading"
            :visible="roleUserListModal.visible"
            @cancel="roleUserListModal.visible = false"
            @ok="roleUserListModal.visible = false"
    >
        <a-tag style="margin-top: 10px" color="blue" v-for="username in roleUserListModal.userNameList" :key="username">{{username}}</a-tag>

    </a-modal>
</template>

<script>
    export default {
        name: "role-user-list.vue",
        props:{
            roleUserListModal:{
                type: Object,
                visible:{
                    type: Boolean
                }
            }
        },
        data(){
            return {
                loading: false,
            }
        },
        computed:{

        },
        methods:{
        },
        created() {
        }
    }
</script>

<style scoped>

</style>