import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import 'firebase/database'
import {countObjectProperties} from '@/utils'

// install Vuex plugin
Vue.use(Vuex)

const makeAppendChildToParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

// export the Vuex store
export default new Vuex.Store({
  state: {
    categories: {},
    forums: {},
    threads: {},
    posts: {},
    users: {},
    authId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
  },
  getters: {
    authUser (state) {
      // return state.users[state.authId]
      return {}
    },
    userPostsCount (state) {
      return function (id) {
        const user = state.users[id]
        return countObjectProperties(user.posts)
      }
      // Using arrow functions we can make the getter oneliner
      //
      // userPostsCount: state => id => countObjectProperties(state.users[id].posts)
    },
    userThreadsCount: state => id => countObjectProperties(state.users[id].threads),
    threadRepliesCount: state => id => countObjectProperties(state.threads[id].posts) - 1
  },
  actions: {
    createPost ({commit, state}, post) {
      const postId = 'greatPost' + Math.random()
      post['.key'] = postId
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('SET_POST', {post, postId})
      commit('APPEND_POST_TO_THREAD', {parentId: post.threadId, childId: postId})
      commit('APPEND_POST_TO_USER', {parentId: post.userId, childId: postId})
      return Promise.resolve(state.posts[postId])
    },
    updateThread ({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve, reject) => {
        const thread = state.threads[id]
        const newThread = {...thread, title}
        commit('SET_THREAD', {thread: newThread, threadId: id})
        dispatch('updatePost', {id: thread.firstPostId, text})
          .then(() => {
            resolve(newThread)
          })
      })
    },
    updatePost ({state, commit}, {id, text}) {
      return new Promise((resolve, reject) => {
        const post = state.posts[id]
        commit('SET_POST', {
          postId: id,
          post: {
            ...post,
            text
          },
          edited: {
            at: Math.floor(Date.now() / 1000),
            by: state.authId
          }
        })
        resolve(post)
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
        commit('APPEND_THREAD_TO_FORUM', {parentId: forumId, childId: threadId})
        commit('APPEND_THREAD_TO_USER', {parentId: userId, childId: threadId})

        dispatch('createPost', {text, threadId})
          .then(post => {
            commit('SET_THREAD', {threadId, thread: {...thread, firstPostId: post['.key']}})
          })
        resolve(state.threads[threadId])
      })
    },
    fetchThread ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'threads', id, emoji: '📄'})
    },
    fetchUser ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'users', id, emoji: '🙋'})
    },
    fetchPost ({dispatch}, {id}) {
      return dispatch('fetchItem', {resource: 'posts', id, emoji: '💬'})
    },
    // reusable fetchItem action
    fetchItem ({state, commit}, {id, emoji, resource}) {
      console.log('🔥', emoji, id)
      return new Promise((resolve, reject) => {
        firebase.database().ref(resource).child(id).once('value', snapshot => {
          commit('SET_ITEM', {resource, id: snapshot.key, item: snapshot.val()})
          resolve(state[resource][id])
        })
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
    // create a generic mutation
    SET_ITEM (state, {item, id, resource}) {
      item['.key'] = id
      Vue.set(state[resource], id, item)
    },
    APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),
    APPEND_POST_TO_USER: makeAppendChildToParentMutation({parent: 'users', child: 'posts'}),
    APPEND_THREAD_TO_FORUM: makeAppendChildToParentMutation({parent: 'forums', child: 'threads'}),
    APPEND_THREAD_TO_USER: makeAppendChildToParentMutation({parent: 'users', child: 'threads'})
  }
})
