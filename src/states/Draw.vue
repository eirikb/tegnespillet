<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2>Draw "{{word}}"</h2>
    <canvas ref="canvas"></canvas>
    <div class="bottom" ref="button">
      <button @click="clear">Clear</button>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';
  import signature_pad from 'signature_pad';
  import { getTarget } from '../utils';

  export default {
    components: { ProgressBar },

    computed: {
      word() {
        return getTarget(this.$store.state).word;
      }
    },

    mounted() {
      this.round = this.$store.state.round;

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
      let path = getTarget(this.$store.state).drawPath;
      this.$store.dispatch('setDrawing', { path, data });
    },

    methods: {
      clear() {
        this.drawing.clear();
      }
    }
  };
</script>
