<template>
  <div class="full">
    <div v-if="$store.state.round !== null">
      Round {{$store.state.round}}
      <span>Velg ord</span> 
      <span v-for="round in $store.state.rounds">
         <span>Tegn ord</span> 
         <span>Gjett ord</span> 
      </span>
    </div>
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
