<template>
  <span>
    {{timestamp | formatDate}}
  </span>
</template>

<script>

import moment from 'moment'

export default {
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  filters: {
    formatDate (date) {
      return moment.unix(date).format('MMMM Do YYYY, h:mm:ss a')
    }
  }
}
</script>