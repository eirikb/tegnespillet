<template>
  <div class="full">
  <button class="mdl-button mdl-js-button mdl-button--fab">
  <i class="material-icons">add</i>
</button>
    <component :is="$store.state.name"></component>
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
  @import  url('https://fonts.googleapis.com/icon?family=Material+Icons');
</style>
