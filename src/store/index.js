import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
  },
  mutations: {
    /**
     * 保存后台返回的常量信息
     *
     * @param state
     * @param allConst
     */
    saveAllConst(state, allConst) {
      console.log(allConst)
      Object.keys(allConst).forEach(function (key) {
        state[key + 'Project'] = allConst[key]
      });
    },

    /**
     * 保存用户信息
     * @param state
     * @param funcTree
     */
    saveUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
  },
  modules: {
  }
})
