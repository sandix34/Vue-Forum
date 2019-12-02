import Vue from 'vue'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import {makeAppendChildToParentMutation} from '@/store/assetHelpers'
import {countObjectProperties} from '@/utils'

export default {
  state: {
    items: {} // access the threads outside of the module state.threads.items[id]
  },
  getters: {
    threadRepliesCount: state => id => countObjectProperties(state.items[id].posts) - 1
  },
  actions: {
    createThread ({state, commit, dispatch}, {text, title, forumId}) {
      return new Promise((resolve, reject) => {
        const threadId = firebase.database().ref('threads').push().key
        const postId = firebase.database().ref('posts').push().key
        const userId = state.authId
        const publishedAt = Math.floor(Date.now() / 1000)

        const thread = {title, forumId, publishedAt, userId, firstPostId: postId, posts: {}}
        thread.posts[postId] = postId
        const post = {text, publishedAt, threadId, userId}

        const updates = {}
        updates[`threads/${threadId}`] = thread
        updates[`forums/${forumId}/threads/${threadId}`] = threadId
        updates[`users/${userId}/threads/${threadId}`] = threadId

        updates[`posts/${postId}`] = post
        updates[`users/${userId}/posts/${postId}`] = postId
        firebase.database().ref().update(updates)
          .then(() => {
            // update thread
            commit('SET_ITEM', {resource: 'threads', id: threadId, item: thread})
            commit('forums/APPEND_THREAD_TO_FORUM', {parentId: forumId, childId: threadId})
            commit('users/APPEND_THREAD_TO_USER', {parentId: userId, childId: threadId})
            // update post
            commit('SET_ITEM', {resource: 'posts', item: post, id: postId})
            commit('APPEND_POST_TO_THREAD', {parentId: post.threadId, childId: postId})
            commit('users/APPEND_POST_TO_USER', {parentId: post.userId, childId: postId})

            resolve(state.items[threadId])
          })
      })
    },
    updateThread ({state, commit, dispatch}, {title, text, id}) {
      return new Promise((resolve, reject) => {
        const thread = state.items[id]
        const post = state.posts[thread.firstPostId]

        const edited = {
          at: Math.floor(Date.now() / 1000),
          by: state.authId
        }

        const updates = {}
        updates[`posts/${thread.firstPostId}/text`] = text
        updates[`posts/${thread.firstPostId}/edited`] = edited
        updates[`threads/${id}/title`] = title
        firebase.database().ref().update(updates)
          .then(() => {
            commit('SET_THREAD', {thread: {...thread, title}, threadId: id})
            commit('posts/SET_POST', {postId: thread.firstPostId, post: { ...post, text }, edited})
            resolve(post)
          })
      })
    },
    fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id, emoji: '📄'}),
    fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids, emoji: '🌧'})
  },
  mutations: {
    SET_THREAD (state, {thread, threadId}) {
      Vue.set(state.items, threadId, thread)
    },
    APPEND_POST_TO_THREAD: makeAppendChildToParentMutation({parent: 'threads', child: 'posts'}),
    APPEND_CONTRIBUTOR_TO_THREAD: makeAppendChildToParentMutation({parent: 'threads', child: 'contributors'})
  }
}
