<template>
  <div>
  <img ref="res">
    <canvas ref="canvas"></canvas>
    <div class="bottom" ref="button">
      <button @click="clear">Clear</button>
      <button @click="save">Save</button>
    </div>
  </div>
</template>

<script>
  import signature_pad from 'signature_pad';
  import toBlob from 'canvas-to-blob';
  console.log(toBlob);

  import fb from '../fb';

  export default {
    props: ['state'],
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

      let ready = false;
      fb.db.ref('test').on('child_added', ref => {
        if (!ready) return;
        console.log('ref', ref, 'key', ref.key, ref.getKey(), ref.val());
        fb.storage.ref().child(`${ref.key}.jpg`).getDownloadURL().then(url => {
          console.log(url);
          this.$refs.res.src = url;
        });
      });
      setTimeout(() => ready = true, 3000);
    },
    methods: {
      clear() {
        this.drawing.clear();
      },
      save() {

        let data = this.$refs.canvas.toDataURL('image/jpeg');
        let blob = toBlob(data);
        let res = fb.db.ref('test').push();
        fb.storage.ref().child(`${res.key}.jpg`).put(blob).then(() => {
          res.update({ uid: this.state.uid });
        });
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
