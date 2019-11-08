<template>
    <div class="col-large push-top">
      <h1>{{thread.title}}</h1>
      <PostList :posts="posts"/>
      <form @submit.prevent="addPost">
        <div class="forum-group">
          <textarea
            name="" 
            id="" 
            cols="30" 
            rows="10" 
            class="form-input"
            v-model="newPostText"
            ></textareaname="">
        </div>
        <div class="form-action">
          <button class="btn-blue">Submit post</button>
        </div>
      </form>
    </div>
</template>

<script>
import sourceData from '@/data'
import PostList from '@/components/PostList'

export default {
  components: {
    PostList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      thread: sourceData.threads[this.id],
      newPostText: ''
    }
  },
  computed: {
    posts () {
      const postIds = Object.values(this.thread.posts)
      return Object.values(sourceData.posts)
        .filter(post => postIds.includes(post['.key']))
    }
  },
  methods: {
    addPost () {
      const postId = 'greatPost' + Math.random()

      const post = {
        text: this.newPostText,
        publisheAt: Math.floor(Date.now() / 1000),
        threadId: this.id,
        userId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2',
        '.key': postId
      }

      this.$set(sourceData.posts, postId, post)

      this.$set(this.thread.posts, postId, postId)

      this.$set(sourceData.users[post.userId].posts, postId, postId)

      this.newPostText = ''
    }
  }
}
</script>

<style>
</style>