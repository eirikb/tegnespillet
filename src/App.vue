<template>
  <div class="full">
    <!--<component :is="$store.state.name"></component>-->
  </div>
</template>

<script>
  // import states from './states';

  export default {
    // components: Object.assign({}, states),
    created() {
      this.$store.dispatch('auth');
    }
  };
</script>

<style>
  html,
  body {
    margin: 0;
  }
  
  .bottom {
    position: fixed;
    bottom: 20px;
    left: 20px;
  }
  
  img {
    width: 75vw;
  }
  
  .progress {
    height: 5px;
    width: 100%;
    background-color: #3498db;
  }
</style>
