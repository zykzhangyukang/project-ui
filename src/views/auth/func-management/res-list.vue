<template>
    <a-modal
            width="650px"
            title="资源列表"
            :cancelText="'取消'"
            :okText="'确认'"
            :mask-closable="false"
            :confirm-loading="loading"
            :visible="resListModal.visible"
            @cancel="resListModal.visible = false"
            @ok="resListModal.visible = false"
            :footer="null"
    >

        <p style="font-size: 11px;font-weight: 700;background: #efefef;padding: 0 10px;border-radius: 5px" v-for="res in resListModal.rescList">{{res.rescName}} : {{res.rescUrl}}</p>

        <a-empty v-if="!resListModal.rescList || resListModal.rescList.length === 0" />


    </a-modal>
</template>

<script>
    import Common from "../../../util/common";
    export default {
        name: "res-list.vue",
        props:{
            resListModal:{
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
            rescDomainG(){
                return  Common.methods.getConst('project_domain',this.$store.state.authProject);
            },
            rescDomainGName(){
                return Common.methods.formatConst(this.rescDomainG);
            }
        },
        methods:{

        },
        created() {
        }
    }
</script>

<style scoped>

</style>