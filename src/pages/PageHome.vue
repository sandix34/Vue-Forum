<template>
  <div class="col-full">
    <h1>Welcome to the forum</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>

import CategoryList from '@/components/CategoryList'
import sourceData from '@/data'
console.log(sourceData)

export default {
  data () {
    return {
      categories: Object.values(sourceData.categories)
    }
  },
  components: {
    CategoryList
  }
}
</script>