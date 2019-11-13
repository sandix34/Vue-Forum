import Vue from 'vue'
import Vuex from 'vuex'

import sourceData from '@/data'

// install Vuex plugin
Vue.use(Vuex)

// export the Vuex store
export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },
  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },
  actions: {
    createPost ({commit, state}, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('SET_POST', {post, postId})
      commit('APPEND_POST_TO_THREAD', {threadId: post.threadId, postId})
      commit('APPEND_POST_TO_USER', {userId: post.userId, postId})
    },
    updateUser ({commit}, user) {
      commit('SET_USER', {userId: user['.key'], user})
    }
  },
  mutations: {
    SET_USER (state, {user, userId}) {
      Vue.set(state.users, userId, user)
    },
    SET_POST (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },
    APPEND_POST_TO_THREAD (state, {postId, threadId}) {
      const thread = state.threads[threadId]
      Vue.set(thread.posts, postId, postId)
    },
    APPEND_POST_TO_USER (state, {postId, userId}) {
      const user = state.users[userId]
      Vue.set(user.posts, postId, postId)
    }
  }
})
