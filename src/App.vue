<template>
  <div class="full">
    <div v-if="$store.state.round !== null">
      <span v-for="round in $store.state.rounds">
        <span :class="{active: round.active}"> 
          <span v-if="round.name === 'pick'">Velg</span>
          <span v-if="round.name === 'draw'">Tegn</span>
          <span v-if="round.name === 'guess'">Gjett</span>
          >
        </span> 
      </span>
      <span v-for="round in $store.state.rounds">
         <ProgressBar v-if="round.active" 
          :timeout="$store.state.interval"
          :maxtime="$store.state.end"></ProgressBar>
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
