<template>
  <div>
    <ProgressBar :timeout="30"></ProgressBar>
    <h2>Draw "{{word}}" <small v-if="by">({{by}})</small></h2>
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
  import { setDrawing } from '../actions';

  export default {
    components: { ProgressBar },
    props: ['state', 'store'],
    computed: {
      word() {
        return getTarget(this.state).word;
      },
      by() {
        return '';
        // return getTarget(this.state).drawin;
      }
    },
    mounted() {
      this.round = this.state.round;

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
      let path = getTarget(this.state).drawPath;
      setDrawing(path, this.state.uid, data);
    },
    methods: {
      clear() {
        this.drawing.clear();
      }
    }
  };
</script>