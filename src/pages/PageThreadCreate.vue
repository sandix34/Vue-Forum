<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">
    <h1>Create new thread in <i>{{forum.name}}</i></h1>
    <!-- Access ThreadEditor component data by assigning a reference ID: ref="editor"-->
    <ThreadEditor
      ref="editor" 
      @save="save"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import ThreadEditor from '@/components/ThreadEditor'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  components: {
    ThreadEditor
  },
  mixins: [asyncDataStatus],
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      saved: false
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums[this.forumId]
    },
    // check if the title or the text has a value
    hasUnsavedChanges () {
      return (this.$refs.editor.form.title || this.$refs.editor.form.text) && !this.saved
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'createThread']),
    save ({title, text}) {
      // dispatch action
      this.createThread({
        forumId: this.forum['.key'],
        title,
        text
      }).then(thread => {
        this.saved = true
        this.$router.push({name: 'ThreadShow', params: {id: thread['.key']}})
      })
    },
    cancel () {
      this.$router.push({name: 'Forum', params: {id: this.forum['.key']}})
    }
  },
  created () {
    this.fetchForum({id: this.forumId})
      .then(() => { this.asyncDataStatus_fetched() })
  },
  // use the beforeRouteLeave guard to show the confirmation
  beforeRouteLeave (to, from, next) {
    if (this.hasUnsavedChanges) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost.')
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>