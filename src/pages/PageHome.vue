<template>
  <div class="col-full push-top">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>

import CategoryList from '@/components/CategoryList'

export default {
  computed: {
    categories () {
      return Object.values(this.$store.state.categories)
    }
  },
  components: {
    CategoryList
  },
  beforeCreate () {
    this.$store.dispatch('fetchAllCategories')
      .then(categories => {
        categories.forEach(category => this.$store.dispatch('fetchForums', {ids: Object.keys(category.forums)}))
      })
  }
}
</script>