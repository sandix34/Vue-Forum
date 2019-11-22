<template>
  <div id="app">
    <TheNavBar/>
    <div class="container">
      <router-view v-show="showPage" @ready="showPage = true"/>
      <AppSpinner v-show="!showPage" class="spinner"/>
    </div>
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar'
import AppSpinner from '@/components/AppSpinner'

export default {
  components: {
    TheNavBar,
    AppSpinner
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

.spinner {
  margin-top: 5rem;
}
</style>
