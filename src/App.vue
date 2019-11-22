<template>
  <div id="app">
    <TheNavBar/>
    <div class="container">
      <router-view v-show="showPage" @ready="showPage = true"/>
      <div v-show="!showPage"> loading ...</div>
    </div>
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar'

export default {
  components: {
    TheNavBar
  },
  data () {
    return {
      showPage: false
    }
  },
  created () {
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      next()
    })
  }
}
</script>

<style>
@import "assets/css/style.css";
</style>
