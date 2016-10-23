<template>
  <div ref="bar" class="progress" :style="style"></div>
</template>

<script>
  export default {
    props: ['timeout'],

    data() {
      return {
        style: ''
      };
    },
    watch: {
      timeout() {
        this.setStyle();
      }
    },
    mounted() {
      this.setStyle();
    },
    methods: {
      setStyle() {
        setTimeout(() => this.style = this.timeout > 0 ? { width: '0%', transition: `width ${this.timeout - 1}s linear` } : '', 1000);
      }
    }
  };
</script>