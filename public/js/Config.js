// Resizing window
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("resizing canvas");
}
resize();
window.onresize = resize;