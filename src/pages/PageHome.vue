<template>
  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <ThreadList :threads="threads"/>
  </div>
</template>

<script>

import ThreadList from '@/components/ThreadList'
import sourceData from '@/data'
console.log(sourceData)

export default {
  data () {
    return {
      threads: Object.values(sourceData.threads),
      posts: sourceData.posts,
      users: sourceData.users
    }
  },
  components: {
    ThreadList
  }
}
</script>