<template>
  <div>
    <h1 class="pin">{{$store.state.pin}}</h1>
    <button @click="start" v-if="$store.state.isOwner"
            :disabled="Object.keys($store.state.users).length < 4">Start
    </button>
    <p v-if="Object.keys($store.state.users).length < 4">
      Må ha minst fire spillere
    </p>
    <div>
      <hr/>
      Brukere:
      <ul v-for="user in users">
        <li>
          <b>
            {{user.score}}
          </b>
          {{user.nick}}
        </li>
      </ul>
    </div>

    <div v-if="$store.state.results.length > 0">
      <hr>
      <h2>Resultater:</h2>

      <div v-for="(items, pos) in $store.state.results">
        <h2>
          <small>Ord:</small>
          {{items.word}}.
          <small>Eier:</small>
          {{$store.state.users[items.owner]}}
        </h2>
        <div v-for="index in range" :class="{correct: items[`correct-${index}`]}">
          <h3>{{$store.state.users[items[`draw-${index}-by`]]}}
            <small>tegnet:</small>
          </h3>
          <img :src="items[`draw-${index}`]"/>
          <h3>
            {{$store.state.users[items[`guess-${index + 1}-by`]]}}
            <small>gjettet</small>
            {{items[`guess-${index + 1}`]}}
            <button v-if="$store.state.isOwner" @click="$store.dispatch('setScore', { pos, index })">
              Gi poeng
            </button>
          </h3>
        </div>
        <hr/>
      </div>
    </div>
  </div>
</template>

<script>
  import { orderBy, map, range } from 'lodash';

  export default {
    computed: {
      range() {
        const size = Math.floor(Object.keys(this.$store.state.users || {}).length / 2);
        return range(size);
      },

      users() {
        return orderBy(map(this.$store.state.users, (nick, uid) => ({
          nick,
          score: (this.$store.state.score || {})[uid] || 0
        })), 'score', 'desc');
      }
    },

    methods: {
      start() {
        this.$store.dispatch('startGame');
      }
    }
  };
</script>
