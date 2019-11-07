<template>
  <div class="post-list">
    <PostListItem
     v-for="post in posts"
     :key="post['.key']"
     :post="post" 
    />
  </div>
</template>

<script>
import PostListItem from './PostListItem'

export default {
  components: {
    PostListItem
  },
  props: {
    posts: {
      required: true,
      type: Array
    }
  }
}
</script>