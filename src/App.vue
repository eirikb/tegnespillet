<template>
  <div class="full">
    <component :is="$store.state.name"></component>
  </div>
</template>

<style lang="sass">
  @import "app";
</style>

<script>
  import states from './states';

  export default {
    components: Object.assign({}, states)
  };
</script>
