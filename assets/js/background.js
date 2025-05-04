
const canvas = document.getElementById('noise-canvas');
const ctx = canvas.getContext('2d');
let width, height;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

function noise() {
  const imageData = ctx.createImageData(width, height);
  const buffer = new Uint32Array(imageData.data.buffer);
  for (let i = 0; i < buffer.length; i++) {
    buffer[i] = (255 << 24) | 
                (Math.random() * 255 << 16) |
                (Math.random() * 255 << 8) |
                Math.random() * 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

(function loop() {
  noise();
  requestAnimationFrame(loop);
})();
