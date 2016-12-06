<template>
  <div>
    Loading...
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      this.$store.dispatch('auth');
    }
  };
</script>
