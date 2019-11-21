import Vue from 'vue'

const makeAppendChildToParentMutation = ({parent, child}) =>
  (state, {childId, parentId}) => {
    const resource = state[parent][parentId]
    if (!resource[child]) {
      Vue.set(resource, child, {})
    }
    Vue.set(resource[child], childId, childId)
  }

export default {
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
