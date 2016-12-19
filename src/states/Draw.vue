<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2>Tegn "{{$store.state.word}}"</h2>
    <canvas ref="canvas"></canvas>
    <div class="bottom" ref="button">
      <button @click="clear">Slett</button>
    </div>
  </div>
</template>

<script>
  import ProgressBar from '../ProgressBar.vue';
  import signature_pad from 'signature_pad';

  export default {
    components: { ProgressBar },

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
      this.setDrawing();
    },

    methods: {
      clear() {
        this.drawing.clear();
      },

      setDrawing() {
        let data = this.$refs.canvas.toDataURL('image/jpeg');
        this.$store.dispatch('setDrawing', data);
      }
    }
  };
</script>
