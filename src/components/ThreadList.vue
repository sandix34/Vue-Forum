<template>
  <div>
    <div class="thread-list">
      <h2 class="list-title">Threads</h2>
      <ThreadListItem
        v-for="thread in threads"
        :key="thread['.key']"
        :thread="thread"
      />
    </div>
  </div>
</template>

<script>

import ThreadListItem from './ThreadListItem'

export default {
  components: {
    ThreadListItem
  },
  props: {
    threads: {
      required: true,
      type: Array
    }
  }
}
</script>

<style>
</style>