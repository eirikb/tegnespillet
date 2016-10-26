<template>
  <div class="full">
  <!--{{(state.uid || '').slice(0, 4)}}-->
      <!--<button @click="clean">Clean bean</button>-->
      <!--<button @click="reset()">Reset</button>-->
      <!--<button @click="hack('game-lobby')">GameLobby</button>-->
      <!--<button @click="hack('pick')">Pick</button>-->
      <!--<button @click="hack('draw')">Draw</button>-->
      <!--<button @click="hack('guess')">Guess</button>-->
      <component :is="state.name" :store="store" :state="state"></component>
  </div>
</template>

<script>
  import states from './states';

  import { auth } from './actions';

  //TODO:
  import fb from './fb';

  export default {
    components: Object.assign({}, states),
    props: ['store'],
    data() {
      return {
        state: this.store.getState()
      };
    },
    created() {
      this.store.subscribe(() => this.state = this.store.getState());
      this.store.dispatch(auth());
    },
    //TODO:
    methods: {
      hack(name) {
        fb.db.ref(`game/${this.state.key}/hack`).set(name);
      },
      reset() {
        fb.db.ref(`game/${this.state.key}/hack`).set(null);
        fb.db.ref(`game/${this.state.key}/results`).set(null);
        fb.db.ref(`words/norsk`).set(['Kake', 'Hest', 'Ulv', 'Måne', 'Hus', 'Bil', 'Båt', 'Rompe', 'Hår', 'Hårføner', 'Lommebok']);
      },
      clean() {
        fb.db.ref(`game/${this.state.key}`).update({
          round: null,
          rounds: null
        });
      }
    }
  };
</script>

<style lang="sass">
  html,
  body {
    margin: 0;
  }
  
  .bottom {
    position: fixed;
    bottom: 20px;
    left: 20px;
  }
  
  img {
    width: 75vw;
  }
  
  .progress {
    height: 5px;
    width: 100%;
    background-color: #3498db;
  }
</style>
