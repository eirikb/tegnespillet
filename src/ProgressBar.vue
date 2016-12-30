<template>
  <div class="progress" :style="{width: `${pos}%`}"></div>
</template>

<script>
  export default {
    props: ['timeout', 'maxtime'],

    data() {
      return {
        stamp: Date.now(),
        interval: 0
      };
    },

    mounted() {
      this.interval = setInterval(() => {
        console.log('ping', this.interval);
      }, 1000 / 60);
    },

    unmounted() {
      console.log('clear', this.interval);
      clearInterval(this.interval);
    },

    computed: {
      pos() {
        return 50;
      }
    }
  };
</script>
