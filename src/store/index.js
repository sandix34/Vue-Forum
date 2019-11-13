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
    updateThread ({state, commit}, {title, text, id}) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]
        const post = state.posts[thread.firstPostId]

        const newThread = {...thread, title}
        const newPost = {...post, text}

        commit('SET_THREAD', {thread: newThread, threadId: id})
        commit('SET_POST', {post: newPost, postId: thread.firstPostId})

        resolve(newThread)
      })
    },
    updateUser ({commit}, user) {
      commit('SET_USER', {userId: user['.key'], user})
    },
    createThread ({state, commit, dispatch}, {text, title, forumId}) {
      return new Promise((resolve, reject) => {
        const threadId = 'greatThread' + Math.random()
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = {'.key': threadId, title, forumId, publishedAt, userId}

        commit('SET_THREAD', {threadId, thread})
        commit('APPEND_THREAD_TO_FORUM', {forumId, threadId})
        commit('APPEND_THREAD_TO_USER', {userId, threadId})

        dispatch('createPost', {text, threadId})
        resolve(state.threads[threadId])
      })
    }
  },
  mutations: {
    SET_THREAD (state, {thread, threadId}) {
      Vue.set(state.threads, threadId, thread)
    },
    SET_USER (state, {user, userId}) {
      Vue.set(state.users, userId, user)
    },
    SET_POST (state, {post, postId}) {
      Vue.set(state.posts, postId, post)
    },
    APPEND_POST_TO_THREAD (state, {postId, threadId}) {
      const thread = state.threads[threadId]
      if (!thread.posts) {
        Vue.set(thread, 'posts', {})
      }
      Vue.set(thread.posts, postId, postId)
    },
    APPEND_POST_TO_USER (state, {postId, userId}) {
      const user = state.users[userId]
      Vue.set(user.posts, postId, postId)
    },
    APPEND_THREAD_TO_FORUM (state, {forumId, threadId}) {
      const forum = state.forums[forumId]
      if (!forum.threads) {
        Vue.set(forum, 'threads', {})
      }
      Vue.set(forum.threads, threadId, threadId)
    },

    APPEND_THREAD_TO_USER (state, {userId, threadId}) {
      const user = state.users[userId]
      if (!user.threads) {
        Vue.set(user, 'threads', {})
      }
      Vue.set(user.threads, threadId, threadId)
    }
  }
})
