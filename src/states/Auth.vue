<template>
  <div>
    Kobler til...
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      this.$store.dispatch('auth');
    }
  };
</script>
