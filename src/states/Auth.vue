<template>
  <div>
    Loading...
  </div>
</template>

<script>
  export default {
    created() {
      this.$store.dispatch('auth');
    }
  };
</script>
