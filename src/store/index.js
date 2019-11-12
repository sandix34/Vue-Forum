import Vue from 'vue'
import Vuex from 'vuex'

import sourceData from '@/data'

// install Vuex plugin
Vue.use(Vuex)

// export the Vuex store
export default new Vuex.Store({
  state: {
    ...sourceData,
    authId: 'HJNTR1nN8tgbB148RJrPYbby8Vl1'
  },
  getters: {
    authUser (state) {
      return state.users[state.authId]
    }
  },
  actions: {
    createPost (context, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      context.commit('SET_POST', {post, postId})
      context.commit('APPEND_POST_TO_THREAD', {threadId: post.threadId, postId})
      context.commit('APPEND_POST_TO_USER', {userId: post.userId, postId})
    }
  },
  mutations: {
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
