<template>
  <div class="full">
    <div v-if="$store.state.round !== null">
      Round {{$store.state.round}}
      Interval: {{$store.state.interval}}
      <span>Velg ord</span> 
      Progressbar:
      <span v-for="round in $store.state.rounds">
         <ProgressBar v-if="round.active" 
          :timeout="$store.state.interval"
          :maxtime="$store.state.end"></ProgressBar>
         <span> {{round.name}} </span> 
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
  import ProgressBar from './ProgressBar.vue';

  export default {
    components: Object.assign({
      ProgressBar
    }, states)
  };
</script>
