import Vue from 'vue'
import Vuex from 'vuex'

import sourceData from '@/data'

// install Vuex plugin
Vue.use(Vuex)

// export the Vuex store
export default new Vuex.Store({
  state: sourceData
})
