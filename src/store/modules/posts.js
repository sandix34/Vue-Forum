import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export default {
  namespaced: true,

  state: {
    items: {}
  },

  actions: {
    createPost ({commit, state, rootState}, post) {
      const postId = firebase.database().ref('posts').push().key
      post.userId = rootState.auth.authId
      post.publishedAt = Math.floor(Date.now() / 1000)

      const updates = {}
      updates[`posts/${postId}`] = post
      updates[`threads/${post.threadId}/posts/${postId}`] = postId
      updates[`threads/${post.threadId}/contributors/${post.userId}`] = post.userId
      updates[`users/${post.userId}/posts/${postId}`] = postId
      firebase.database().ref().update(updates)
        .then(() => {
          commit('SET_ITEM', {resource: 'posts', item: post, id: postId}, {root: true})
          commit('threads/APPEND_POST_TO_THREAD', {parentId: post.threadId, childId: postId}, {root: true})
          commit('threads/APPEND_CONTRIBUTOR_TO_THREAD', {parentId: post.threadId, childId: post.userId}, {root: true})
          commit('users/APPEND_POST_TO_USER', {parentId: post.userId, childId: postId}, {root: true})
          return Promise.resolve(state.items[postId])
        })
    },

    updatePost ({state, commit, rootState}, {id, text}) {
      return new Promise((resolve, reject) => {
        const post = state.items[id]
        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: rootState.auth.authId
        }

        const updates = {text, edited}
        firebase.database().ref('posts').child(id).update(updates)
          .then(() => {
            commit('SET_POST', {postId: id, post: {...post, text, edited}})
            resolve(post)
          })
      })
    },

    fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id, emoji: '💬'}, {root: true}),
    fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', ids, emoji: '💬'}, {root: true})
  },
  mutations: {
    SET_POST (state, {post, postId}) {
      Vue.set(state.items, postId, post)
    }
  }
}
