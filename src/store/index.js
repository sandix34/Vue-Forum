import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

// install Vuex plugin
Vue.use(Vuex)

// export the Vuex store
export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: null,
    unsubscribeAuthObserver: null
  },
  getters,
  actions,
  mutations
})
