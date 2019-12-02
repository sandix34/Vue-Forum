import Vue from 'vue'

export default {
  // create a generic mutation
  SET_ITEM (state, {item, id, resource}) {
    item['.key'] = id
    Vue.set(state[resource].items, id, item)
  }
}
