import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  // reusable fetchItem action
  fetchItem ({state, commit}, {id, emoji, resource}) {
    console.log('🔥', emoji, id)
    return new Promise((resolve, reject) => {
      firebase.database().ref(resource).child(id).once('value', snapshot => {
        commit('SET_ITEM', {resource, id: snapshot.key, item: snapshot.val()})
        resolve(state[resource].items[id])
      })
    })
  },
  fetchItems ({dispatch}, {ids, emoji, resource}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => this.dispatch('fetchItem', {id, resource, emoji})))
  }
}
