<template>
  <div class="mdl-grid">
    <div class="mdl-cell mdl-cell--12-col">
      <component :is="$store.state.name"></component>
    </div>
  </div>
</template>

<script>
  import states from './states';

  export default {
    components: Object.assign({}, states)
  };
</script>

<style lang="sass">
  @import './node_modules/material-design-lite/material';
</style>
