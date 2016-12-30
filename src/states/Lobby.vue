<template>
  <div>
  <button @click="join">Join</button>
  <button @click="clean">Clean</button>
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
      Opprett spill:
      <button class="blocked" @click="create('norsk')">Norsk</button>
      <button class="blocked" @click="create('engelsk')">Engelsk</button>
      <button class="blocked" @click="create('voksne')">For voksne</button>
    </div>
  </div>
</template>

<script>
  // TODO:
  import { db } from '../fb';

  export default {
    data() {
      return {
        info: '',
        // TODO:
        pin: ''
      };
    },

    mounted() {
      // TODO:
      db.ref('game/dummy').update({
        pin: 1337,
        category: 'norsk',
        results: null,
        ping: null
      });
      const s = this.$store.state;
      if (s.nick === 'Eirik') {
        db.ref('game/dummy').update({
          owner: s.uid,
        });
      }
      this.$store.dispatch('joinGame', 'dummy');
    },

    methods: {
      clean() {
        const s = this.$store.state;
        db.ref('game/dummy').set({
          owner: s.uid,
          pin: 1337,
          category: 'norsk'
        });
      },
      join() {
        this.$store.dispatch('joinGame', 'dummy');
      },
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
