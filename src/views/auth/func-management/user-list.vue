<template>
    <a-modal
            width="650px"
            title="用户列表"
            :cancelText="'取消'"
            :okText="'确认'"
            :footer="null"
            :confirm-loading="loading"
            :visible="userListModal.visible"
            @cancel="userListModal.visible = false"
            @ok="userListModal.visible = false"
    >

        <span id="user" v-for="u in userListModal.userVOList">
            {{u.realName}}
        </span>

        <a-empty v-if="!userListModal.userVOList || userListModal.userVOList.length === 0"/>


    </a-modal>
</template>

<script>
    export default {
        name: "res-list.vue",
        props: {
            userListModal: {
                type: Object,
                visible: {
                    type: Boolean
                }
            }
        },
        data() {
            return {
                loading: false,
            }
        },
        computed: {},
        methods: {},
        created() {

        }
    }
</script>

<style scoped>
    #user {
        padding: 2px;
        font-size: 10px;
        font-weight: 500;
        margin: 10px 10px;
        border-radius: 5px;
        background: #eeeeee;
        cursor: pointer;
    }
</style>