<template>
  <div class="col-full">
    <h1>Not Found</h1>
    <p>
      Ooooops !!!!
      <router-link :to="{name: 'Home'}">go home instead</router-link>
    </p>
  </div>
</template>

<script>
export default {
  created () {
    this.$emit('ready')
  }
}
</script>