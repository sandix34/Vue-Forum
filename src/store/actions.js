import firebase from 'firebase/app'
import 'firebase/database'

export default {
  createPost ({commit, state}, post) {
    const postId = firebase.database().ref('posts').push().key
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)

    const updates = {}
    updates[`posts/${postId}`] = post
    updates[`threads/${post.threadId}/posts/${postId}`] = postId
    updates[`users/${post.userId}/posts/${postId}`] = postId
    firebase.database().ref().update(updates)
      .then(() => {
        commit('SET_ITEM', {resource: 'posts', item: post, id: postId})
        commit('APPEND_POST_TO_THREAD', {parentId: post.threadId, childId: postId})
        commit('APPEND_POST_TO_USER', {parentId: post.userId, childId: postId})
        return Promise.resolve(state.posts[postId])
      })
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
  fetchCategory: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'categories', id, emoji: '🏷'}),
  fetchForum: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'forums', id, emoji: '🌧'}),
  fetchThread: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'threads', id, emoji: '📄'}),
  fetchPost: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'posts', id, emoji: '💬'}),
  fetchUser: ({dispatch}, {id}) => dispatch('fetchItem', {resource: 'users', id, emoji: '🙋'}),

  fetchCategories: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'categories', ids, emoji: '🏷'}),
  fetchForums: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'forums', ids, emoji: '🌧'}),
  fetchThreads: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'threads', ids, emoji: '🌧'}),
  fetchPosts: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'posts', ids, emoji: '💬'}),
  fetchUsers: ({dispatch}, {ids}) => dispatch('fetchItems', {resource: 'users', ids, emoji: '🙋'}),

  fetchAllCategories ({state, commit}) {
    console.log('🔥', '🏷', 'all')
    return new Promise((resolve, reject) => {
      firebase.database().ref('categories').once('value', snapshot => {
        const categoriesObject = snapshot.val()
        Object.keys(categoriesObject).forEach(categoryId => {
          const category = categoriesObject[categoryId]
          commit('SET_ITEM', {resource: 'categories', id: categoryId, item: category})
        })
        resolve(Object.values(state.categories))
      })
    })
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
  },
  fetchItems ({dispatch}, {ids, emoji, resource}) {
    ids = Array.isArray(ids) ? ids : Object.keys(ids)
    return Promise.all(ids.map(id => this.dispatch('fetchItem', {id, resource, emoji})))
  }
}
