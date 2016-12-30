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
  // TODO:
  import {
    db
  } from '../fb';

  export default {
    data() {
      return {
        info: '',
        pin: ''
      };
    },

    mounted() {
      return;
      // TODO:
      db.ref('game/dummy').update({
        pin: 1337,
        category: 'norsk',
        results: null,
        ping: null
      });
      const s = this.$store.state;
      if (s.nick === 'Chrome') {
        db.ref('game/dummy').update({
          owner: s.uid,
          // results: [{
          //   "draw-0": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F0%2Fdraw-0.jpg?alt=media&token=6dc7eb0d-ba47-4ee4-a481-f69940ffea8f",
          //   "draw-0-by": s.uid,
          //   "draw-1": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F0%2Fdraw-1.jpg?alt=media&token=6b050533-7180-4a80-8520-f3d9e9abe5cc",
          //   "draw-1-by": "b",
          //   "guess-1": "Hval",
          //   "guess-1-by": "c",
          //   "guess-2": "Potet",
          //   "guess-2-by": "a",
          //   "owner": s.uid,
          //   "word": "Hval",
          //   "correct-0": true,
          //   "correct-1": true
          // }, {
          //   "draw-0": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F1%2Fdraw-0.jpg?alt=media&token=77cce524-bf75-4d93-a42b-971bb2751626",
          //   "draw-0-by": "a",
          //   "draw-1": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F1%2Fdraw-1.jpg?alt=media&token=50919797-f4a8-42e6-979b-96806c9a529e",
          //   "draw-1-by": "c",
          //   "guess-1": "Drimedar",
          //   "guess-1-by": s.uid,
          //   "guess-2": "Kamel",
          //   "guess-2-by": "b",
          //   "owner": "a",
          //   "word": "Kamel"
          // }, {
          //   "draw-0": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F2%2Fdraw-0.jpg?alt=media&token=6c031392-a55f-491e-bc48-ef62ec168fb6",
          //   "draw-0-by": "b",
          //   "draw-1": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F2%2Fdraw-1.jpg?alt=media&token=099fd1a7-5d9a-4c98-96c7-aea314ab6c40",
          //   "draw-1-by": s.uid,
          //   "guess-1": "Ubåt",
          //   "guess-1-by": "a",
          //   "guess-2": "Ubåt",
          //   "guess-2-by": "c",
          //   "owner": "b",
          //   "word": "Ubåt"
          // }, {
          //   "draw-0": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F3%2Fdraw-0.jpg?alt=media&token=5217c843-fdf2-4095-be3a-d8bff9205499",
          //   "draw-0-by": "c",
          //   "draw-1": "https://firebasestorage.googleapis.com/v0/b/drawesome-fd8ec.appspot.com/o/game%2F-KYckloVWlFL6XCFV5EJ%2Fresults%2F3%2Fdraw-1.jpg?alt=media&token=a0c7abdd-0b46-4188-b5a9-195112cf8cf4",
          //   "draw-1-by": "a",
          //   "guess-1": "Sko",
          //   "guess-1-by": "b",
          //   "guess-2": "Joggesko",
          //   "guess-2-by": s.uid,
          //   "owner": "c",
          //   "word": "Joggesko"
          // }],
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
