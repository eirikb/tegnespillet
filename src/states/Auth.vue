<template>
  <div>
    <h1 class="title lobby-header">Tegnespillet</h1>
  </div>
</template>

<script>
  export default {
    beforeCreate() {
      this.$store.dispatch('auth');
    }
  };
</script>
