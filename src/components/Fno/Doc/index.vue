<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script>
export default {
  name: 'PointLionDoc',
  data() {
    return {
      url: 'http://www.xiaotui.com'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
