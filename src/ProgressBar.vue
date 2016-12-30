<template>
  <div class="progress" :style="{width: `${pos}%`}"></div>
</template>

<script>
  export default {
    props: ['timeout', 'maxtime'],

    data() {
      return {
        pos: 100,
        stamp: Date.now(),
        interval: 0
      };
    },

    mounted() {
      this.interval = setInterval(() => {
        const pos = this.timeout - (Date.now() - this.stamp);
        this.pos = pos <= 0 ? 0 : pos / this.maxtime * 100;
      }, 1000 / 60);
    },

    destroyed() {
      clearInterval(this.interval);
    }
  };
</script>
