// Mouse //
const Mouse = {
  X: 0, Y: 0, Left: -1, Right: -1
  , MouseMove(e) {
    // Get x and y of Mouse on the canvas
    Mouse.GetXandY(e.clientX,e.clientY);
  }
  , TouchMove(e){
    // Get x and y of Touch on the canvas
    if (e.type == "touchstart" || e.type == "touchend"){
      Mouse.GetXandY(e.changedTouches[0].pageX,e.changedTouches[0].pageY);
    }
    else if (e.type == "touchmove"){
      Mouse.GetXandY(e.targetTouches[0].pageX,e.targetTouches[0].pageY);
    }
  }
  , GetXandY(mx,my){
    // Get x and y of mouse/touch on the canvas
    var s = can.getBoundingClientRect(),X,Y;//,cw=W,ch=H;
    X = Math.floor((mx - s.left) * cw / s.width);
    Y = Math.floor((my - s.top) * ch / s.height);
    // Update Mouse X and Y
    if (X != null && Y != null) { this.X = Math.floor((X-cx)/scale); this.Y = Math.floor((Y-cy)/scale); } // in case values is null from touch, we not going update Mouse X and Y
  }
  , Down(key) { return this[key] == 1;} // Check if mouse-click down
  , Up(key) { return this[key] == 0;} // Check if mouse-click up
  , Press(key) { return this[key] > 0;} // Check if mouse-click press
  , Update() {
    // Update mouse left and right click (1- mean not clicked, 0 mean key is 'up', 1 mean key is 'down' also 'press', 2 mean key is 'press')
    if (this.Left > 0) this.Left = 2; else this.Left = -1;
    if (this.Right > 0) this.Right = 2; else this.Right = -1;
  }
  , MouseClick(e) {
    // Update Mouse-key when it is clicked
    // Get the clicked key
    var s;
    switch (e.which) {
      case 1: s = "Left"; break;
      case 3: s = "Right"; break;
      default: return;
    }
    this[s] = e.type == 'mousedown' ? 1 : 0; // If mouse Event is 'mousedown' set the key to 1, else it should be 0 for 'mouseup'
  }
  /* Touches */, TouchClick() { if (event.type == "touchstart") this.Left = 1; }
  // Check if mouse coordinates x and y is on the given Square x,y,w,h
  , Square(x, y, w, h) { return this.X >= x && this.X < x + w && this.Y >= y && this.Y < y + h }
};
const can=canvas, ctx = can.getContext("2d");;
const W=960;
const H=540;
var cw=W, ch=H, cx, cy, dw=W, dh=H, dx=1, dy=1, scale=1;
function resizeCan(){G.needResize=true;}
window.onresize = resizeCan;

can.addEventListener("mousemove", function () { Mouse.MouseMove(event, false) }, !1);
can.addEventListener("mousedown", function () { Mouse.MouseClick(event) }, !1);
can.addEventListener("mouseup", function () { Mouse.MouseClick(event) }, !1);
/* Touches */can.addEventListener("touchmove", function () { Mouse.TouchMove(event, true); event.preventDefault();}, !1);
/* Touches */can.addEventListener("touchstart", function () { Mouse.TouchMove(event,true); Mouse.TouchClick(); event.preventDefault(); }, !1);
/* Touches */can.addEventListener("touchend", function () { if (Mouse.Left != 0 && Mouse.Left != 1) { Mouse.Left = 0;} event.preventDefault(); }, !1);
can.tabIndex = 1;

var txt_i = 0, timer = 0, step = 0, step2 = 0;
const G = {
  state:"main", sound:true, needResize:true
  ,onload(){
    c = ctx;
    c.textAlign = "center"; c.textBaseline = "middle"; c.font = data.fontSize+"px font1"; c.fillStyle = "#fff";
    data.firstTxt = G.splitText(data.firstTxt);
    data.secondTxt = G.splitText(data.secondTxt);
    data.thirdTxt = G.splitText(data.thirdTxt);

    G._ = c.measureText('_').width;
    G.s = c.measureText(' ').width;
  }
  ,splitText(text){
    var c = ctx;
    var at = text.split(' '), o = [];
    for (var t of at) {
      o.push({text:t, width:c.measureText(t).width, len:t.length})
    }
    return o;
  }
  ,loop(){
    G.resizeCan();
    var c = ctx;
    // fill background with black color
    c.fillStyle = '#000'; c.fillRect(0, 0, cw, ch);


    // font setting
    c.textAlign = "center"; c.textBaseline = "middle"; c.font = data.fontSize+"px font1"; c.fillStyle = "#fff";

    // draw text in steps
    if(step == 0){
      if(step2 == 0){
        var isDone = draw_step0(data.firstTxt);
        if(isDone){  step2++; timer = 0;}
      }
      else if(step2 == 1){
        var isDone = draw_step1(data.firstTxt);
        if(isDone){  step2++; timer = 0;}
      }
      else if(step2 == 2){
        var isDone = draw_step2(data.firstTxt);
        if(isDone){  step++; step2=0; timer = 0; txt_i = 0;}
      }
    }
    else if(step == 1){
      //alert('w:'+cw+'  h:'+ch)
      if(step2 == 0){
        var isDone = draw_step0(data.secondTxt);
        if(isDone){  step2++; timer = 0;}
      }
      else if(step2 == 1){
        var isDone = draw_step1(data.secondTxt);
        if(isDone){  step2++; timer = 0;}
      }
      else if(step2 == 2){
        var isDone = draw_step2(data.secondTxt);
        if(isDone){  step++; step2=0; timer = 0; txt_i = 0;}
      }
    }
    else if(step == 2){
      if(step2 == 0){
        var isDone = draw_step0(data.thirdTxt);
        if(isDone){  step2++; timer = 0;}
      }
      else if(step2 == 1){
        var isDone = draw_step1(data.thirdTxt);
        if(isDone){  step2++; timer = 0;}
      }
      else if(step2 == 2){
        var isDone = draw_step2(data.thirdTxt);
        if(isDone){  step++; step2=0; timer = 0; txt_i = 0;}
      }
    }
    else if(step == 3){
      var hover = draw_link(data.thirdTxt);
      if(hover && Mouse.Down('Left')){
        window.open(data.link, '_blank');
      }
    }
  }
  ,resizeCan(){
    if(G.needResize){
      var w, h;
      w = cw = can.width = window.innerWidth;
      h = ch = can.height = window.innerHeight;
      cx = dx = cy = dy = 0;
      return;
      if(w/h>W/H){
        var wh =  (W/H) / (w/h);
        w = Math.floor(w*wh);
        scale=h/H;
      }
      else {
        var wh = (H/W) / (h/w);
        h = Math.floor(h*wh);
        scale=w/W;
      }
      cx=Math.floor((cw-w)/2);
      cy=Math.floor((ch-h)/2);
      dx=Math.floor(cx/scale);
      dy=Math.floor(cy/scale);
      dw=w; dh=h;

      G.needResize = false;
    }
  }
};
G.onload();

function draw_step0(text) {
  var c = ctx, x = cw/2, y = ch/2, line = 0;
  text = get_text(text);
  y -= (text.length*data.textHeight)/2;
  if(timer%30 > 15) c.fillText('_', x, y);
  c.fillText(' ', x, y+line);

  ++timer;
  return timer >= 30;
}
function draw_step1(text) {
  var c = ctx, x = cw/2, y = ch/2, line = 0, i = txt_i;
  text = get_text(text);
  y -= (text.length*data.textHeight)/2;
  for (var t of text) {
    //alert(t)
    var len = t.length;
    if(i < 0){i=-10; break;}
    else if(i >= len){
      c.fillText(t, x, y+line);
    }
    else{
      let result = t.slice(0, i)+'_';
      c.fillText(result, x, y+line);
    }
    i -= len;
    line += data.textHeight;
  }
  if(++timer == data.typeSpeed){
    txt_i++;
    timer = 0;
  }
  return i>=-1;
}
function draw_step2(text) {
  var c = ctx, x = cw/2, y = ch/2, line = 0;
  text = get_text(text);
  y -= (text.length*data.textHeight)/2;
  for (var i = 0, len = text.length-1; i < len; i++) {
    var t = text[i];
    c.fillText(t, x, y+line);
    line += data.textHeight;
  }
  if(timer%30 > 15) c.fillText(text[i]+'_', x, y+line);
  c.fillText(text[i]+' ', x, y+line);

  ++timer;
  return timer >= 30;
}
function draw_link(text) {
  var c = ctx, x = cw/2, y = ch/2, line = 0, Y = Mouse.Y, sy = y-data.fontSize/2, hover = false;
  text = get_text(text);
  y -= (text.length*data.textHeight)/2; sy = y-data.fontSize/2;
  if(Y >= sy && Y < sy+text.length*data.textHeight) hover = true;
  for (var i = 0, len = text.length-1; i < len; i++) {
    var t = text[i];
    c.fillText(t, x, y+line);
    let { width } = c.measureText(text[i]);
    if(hover) c.fillRect(x-width/2, y+line+data.fontSize/2, width, 2);
    line += data.textHeight;
  }
  if(timer > 15) c.fillText(text[i]+'_', x, y+line);
  c.fillText(text[i]+' ', x, y+line);
  let { width } = c.measureText(text[i]+'_');
  if(hover) c.fillRect(x-width/2, y+line+data.fontSize/2, width, 2);

  timer = (timer+1)%30;
  return hover;
}

function get_text(text){
  var r = [], rt = '', r_i=0, w = cw, total_w = 0, vAnd = '';
  for (var t of text) {
    if(t.width+total_w+G._ < w){
      rt += vAnd+t.text;
      total_w += t.width+G.s;
      vAnd = ' ';
    }
    else {
      r.push(rt);
      rt = t.text; total_w = t.width+G.s;
    }
  }
  if(rt != '') r.push(rt);
  return r;
}


function resetTransform(){
  var c = ctx;
  c.resetTransform();
  c.translate(cx, cy);
  c.scale(scale, scale);
}

var fpsInterval=1000/30, then = Date.now(), elapsed;
function animate() {
  requestAnimationFrame(animate); // request another frame
  var now = Date.now(); elapsed = now - then; // calc elapsed time since last loop
  // if enough time has elapsed, draw the next frame
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval); // Get ready for next frame by setting then=now, but also, adjust for fpsInterval not being multiple of 16.67
    G.loop();
    /* Mouse */Mouse.Update();
  }
}
window.onload = animate();
