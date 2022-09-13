import store from '../store/index'

export default {

    /**
     * 自定义按钮权限控制
     * @param el
     * @param bindings
     * @param vnode
     */
    inserted(el, bindings, vnode) {

        const funcKeys = store.state.userInfo.funcKeys || [];
        let hasPermission = funcKeys.indexOf(bindings.value) > -1;
        !hasPermission && el.parentNode.removeChild(el);
    }

}