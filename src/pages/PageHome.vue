<template>
  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <ForumList :forums="forums"/>
  </div>
</template>

<script>

import ForumList from '@/components/ForumList'
import sourceData from '@/data'
console.log(sourceData)

export default {
  data () {
    return {
      forums: Object.values(sourceData.forums),
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  components: {
    ForumList
  }
}
</script>