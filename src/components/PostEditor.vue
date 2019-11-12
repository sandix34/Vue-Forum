<template> 
  <form @submit.prevent="save">
    <div class="forum-group">
      <textarea
        name="" 
        id="" 
        cols="30" 
        rows="10" 
        class="form-input"
        v-model="text"
        ></textareaname="">
    </div>
    <div class="form-action">
      <button class="btn-blue">Submit post</button>
    </div>
  </form>
</template>

<script>
  export default {
    props: {
      threadId: {
        required: true
      }
    },
    data () {
      return {
        text: ''
      }
    },
    methods: {
      save () {
        const post = {
          text: this.text,
          publishedAt: Math.floor(Date.now() / 1000),
          threadId: this.threadId,
          userId: '7uVPJS9GHoftN58Z2MXCYDqmNAh2'
        }
        this.text = ''

        this.$emit('save', {post})

        this.$store.dispatch('createPost', post)
      }
    }
  }
</script>