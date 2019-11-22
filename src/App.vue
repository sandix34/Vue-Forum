<template>
  <div id="app">
    <TheNavBar/>
    <div class="container">
      <router-view v-show="showPage" @ready="pageReady"/>
      <AppSpinner v-show="!showPage" class="spinner"/>
    </div>
  </div>
</template>

<script>
import TheNavBar from '@/components/TheNavBar'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'

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
  methods: {
    pageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    NProgress.start()
    this.$router.beforeEach((to, from, next) => {
      this.showPage = false
      NProgress.start()
      next()
    })
  }
}
</script>

<style>
@import "assets/css/style.css";
@import "~nprogress/nprogress.css";

.spinner {
  margin-top: 5rem;
}

#nprogress .bar {
  background: #57AD8D;
}
</style>
