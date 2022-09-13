<template>
    <a-modal
            width="650px"
            title="准备分配"
            :cancelText="'取消'"
            :okText="'确定'"
            :confirm-loading="loading"
            :visible="roleAuthTipsModal.visible"
            @cancel="roleAuthTipsModal.visible = false"
            @ok="ok"
    >

        <a-divider>新增</a-divider>
          <div v-if="roleAuthTipsModal.insertList">
              <a-tag style="margin: 5px" color="green"  v-for="item in roleAuthTipsModal.insertList" :key="item.funcKey">{{item.funcName}}</a-tag>
          </div>

           <a-divider>删除</a-divider>
        <div v-if="roleAuthTipsModal.delList ">
            <a-tag  style="margin: 5px" color="red"   v-for="item in roleAuthTipsModal.delList" :key="item.funcKey">{{item.funcName}}</a-tag>
        </div>

    </a-modal>
</template>

<script>
    export default {
        name: "role-auth-tips.vue",
        props:{
            roleAuthTipsModal:{
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
            ok(){
                this.$emit('confirmAuth')
            }
        },
        created() {
        }
    }
</script>

<style scoped>

</style>