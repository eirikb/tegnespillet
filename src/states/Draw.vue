<template>
  <div>
    <h2>Tegn "{{$store.state.word}}"</h2>
    <canvas ref="canvas"></canvas>
    <div class="bottom" ref="button">
      <button @click="clear">Slett</button>
      <button @click="undo">Angre</button>
    </div>
  </div>
</template>

<script>
  import signature_pad from 'signature_pad';
  import { last } from 'lodash';

  export default {
    mounted() {
      this.round = this.$store.state.round;

      let canvas = this.$refs.canvas;
      let button = this.$refs.button;

      const resizeCanvas = () => {
        canvas.width = window.innerWidth * 1;
        canvas.height = button.offsetTop - canvas.offsetTop * 1;
        this.drawing.clear();
      };
      window.onresize = resizeCanvas;
      this.drawing = new signature_pad(canvas, {
        backgroundColor: 'rgb(255, 255, 255)'
      });

      this.memory = [];
      this.drawing.onEnd = () => {
        const dataUrl = this.drawing.toDataURL();
        if (last(this.memory) != dataUrl) {
          this.memory.push(dataUrl);
        }
      };
      resizeCanvas();
    },

    beforeDestroy() {
      const data = this.$refs.canvas.toDataURL('image/jpeg');
      this.$store.dispatch('setDrawing', data);
    },

    methods: {
      clear() {
        if (confirm('Er du sikker?')) {
          this.drawing.clear();
        }
      },

      undo() {
        const canvas = this.$refs.canvas;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        this.memory.pop();
        if (this.memory.length === 0) {
          this.drawing.clear();
          return;
        }
        image.src = last(this.memory);
        image.onload = () => {
          this.drawing.clear();
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
      }
    }
  };
</script>
