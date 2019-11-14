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
        required: false
      },
      post: {
        type: Object
      }
    },
    data () {
      return {
        text: this.post ? this.post.text : ''
      }
    },
    computed: {
      isUpdate () {
        return !!this.post
      }
    },
    methods: {
      save () {
        this.persist()
          .then(post => {
            this.$emit('save', {post})
          })
      },
      create () {
        const post = {
          text: this.text,
          publishedAt: Math.floor(Date.now() / 1000),
          threadId: this.threadId
        }
        this.text = ''

        return this.$store.dispatch('createPost', post)
      },
      update () {
        const payload = {
          id: this.post['.key'],
          text: this.text
        }
        return this.$store.dispatch('updatePost', payload)
      },
      persist () {
        return this.isUpdate ? this.update() : this.create()
      }
    }
  }
</script>