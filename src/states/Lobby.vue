<template>
  <div>
    <div v-if="false">
      <button @click="join">Join</button>
      <button @click="clean">Clean</button>
    </div>
    <h1 class="title lobby-header">Tegnespillet</h1>
    <div>
      <input v-model="$store.state.nick" placeholder="Kallenavn">
    </div>
    <div>
      <form @submit.prevent="joinGame">
        <input type="number" v-model="pin" placeholder="PIN" required>
        <button class="blocked" type="submit">Bli med</button>
        {{info}}
      </form>
    </div>
    <div>
      <hr/>
      <p>Opprett spill:</p>
      <button @click="create('norsk')">Norsk</button>
      <button @click="create('engelsk')">Engelsk</button>
      <button @click="create('voksne')">For voksne</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        info: '',
        pin: ''
      };
    },

    methods: {
      create(category) {
        this.$store.dispatch('nick');
        this.$store.dispatch('createGame', category).then(key =>
          this.$store.dispatch('joinGame', key));
      },
      joinGame() {
        this.info = 'Looking up game...';
        this.$store.dispatch('nick');
        this.$store.dispatch('getGameByPin', this.pin).then(key => {
          if (!key) {
            this.info = 'Game not found';
            return;
          }
          this.$store.dispatch('joinGame', key);
        });
      }
    }
  };
</script>
