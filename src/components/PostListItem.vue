<template>
  <div>
    <div class="post">
      <div class="user-info">
        <a href="#" class="user-name">{{user.name}}</a>
        <a href="#">
          <img class="avatar-large" :src="user.avatar" alt />
        </a>
        <p class="desktop-only text-small">{{userPostCount}} posts</p>
      </div>
      <div class="post-content">
        <div>{{post.text}}</div>
      </div>
      <div class="post-date text-faded">{{post.publisheAt | formatDate}}</div>
    </div>
  </div>
</template>

<script>

import sourceData from '@/data'
import moment from 'moment'

export default {
  props: {
    post: {
      required: true,
      type: Object
    }
  },
  computed: {
    user () {
      return sourceData.users[this.post.userId]
    },
    userPostCount () {
      return Object.keys(this.user.posts).length
    }
  },
  filters: {
    formatDate (date) {
      return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
    }
  }
}
</script>