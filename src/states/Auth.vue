<template>
  <div>
    <span v-if="!$store.state.uid">
      Kobler til...
    </span>
    <span v-else>
      Logger på...
    </span>
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      this.$store.dispatch('auth');
    }
  };
</script>
