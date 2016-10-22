<template>
  <div>
  Draw!
  <h1>Draw "{{word}}" <small v-if="by">({{by}})</small></h1>
    <canvas ref="canvas"></canvas>
    <div class="bottom" ref="button">
      <button @click="clear">Clear</button>
    </div>
  </div>
</template>

<script>
  import signature_pad from 'signature_pad';
  import toBlob from 'canvas-to-blob';

  import fb from '../fb';

  export default {
    props: ['state'],
    computed: {
      word() {
        let s = this.state;
        return (((s.rounds || [])[s.round] || {})[s.uid] || {}).word;
      },
      by() {
        let s = this.state;
        if (!s.round) return null;
        
        let users = Object.keys(s.users);
        let pos = users.indexOf(s.uid);
        pos = (pos - 1) % users.length;
        return s.users[users[pos]];
      }
    },
    mounted() {
      let canvas = this.$refs.canvas;
      let button = this.$refs.button;

      const resizeCanvas = () => {
        let ratio = 1;
        canvas.width = window.innerWidth * ratio;
        canvas.height = button.offsetTop - canvas.offsetTop * ratio;
        this.drawing.clear();
      };
      window.onresize = resizeCanvas;
      this.drawing = new signature_pad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
      });
      resizeCanvas();
    },
    beforeDestroy() {
      let data = this.$refs.canvas.toDataURL('image/jpeg');
      let blob = toBlob(data);
      let s = this.state;
      let key = `game/${s.key}/rounds/${s.round}/${s.uid}/drawing`;
      fb.storage.ref().child(`${key}.jpg`).put(blob)
        .then(res => res.downloadURL)
        .then(drawing => fb.db.ref(key).set(drawing));
    },
    methods: {
      clear() {
        this.drawing.clear();
      }
    }
  };
</script>

<style scoped="true">
  img {
    position: absolute;
    right: 0;
    width: 200px;
    height: 200px;
  }
  
  .bottom {
    position: fixed;
    bottom: 20px;
    left: 20px;
  }
</style>