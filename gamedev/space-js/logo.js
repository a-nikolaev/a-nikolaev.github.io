
function multpoly_to_s(arr) {
  let s = '';

  for (const poly of arr) {
    let cmd = 'M'
    for (const [x,y] of poly) {
      s += `${cmd} ${x} ${y} `;
      cmd = 'L';
    }
    s += 'Z ';
  }

  return s;
}

function arr_to_s(arr){
  let s = '';
  if (Array.isArray(arr)) {
    s += ' [ ';
    for(const e of arr) {
      s += arr_to_s(e);
      s += ',';
    }
    s += ' ] ';
  }
  else {
    s += arr;
  }
  return s;
}

function random_command(intensity) {
  let f = (x) => (intensity * rnd.std_normal());

  switch(rnd.int(8)){
    case 0: return 're-x';
    case 1: return 're-y';
    case 2: return 're-d';
    case 3: return 're-d2';

    case 4: return ['scale', 1.0 + f(), 1.0 + f()];
    case 5: return ['trans', f(), f()];
    case 6: return ['sheer', f(), f()];
    case 7: return ['rot', f()];
  }
}

function random_multi_command(n=1, intensity=0.3, before=[], after=[]) {
  let arr = [];
  for(let c of before) {
    arr.push(c);
  }

  for(let i = 0; i < n; i++) {
    arr.push(random_command(intensity));
  }
  
  for(let c of after) {
    arr.push(c);
  }

  return arr;
}

function winding(mpoly){
  let sum = 0;
  for(let poly of mpoly) {
    for(let i = 0; i < poly.length-1; i++) {
      let [x1,y1] = poly[i];
      let [x2,y2] = poly[i+1];
      let z = (x2-x1) * (y2 + y1);
      sum += z;
    }
  }
  return sum;
}

function make_clockwise(mpoly){
  if (winding(mpoly) < 0) {
    for(let poly of mpoly) {
      poly.reverse();
    }
  }
}

function make_microshift(mpoly){
  let dx = 0.00001 * (Math.random() - 0.5);
  let dy = 0.00001 * (Math.random() - 0.5);
  for(let poly of mpoly) {
    for(let pair of poly) {
      pair[0] += dx;
      pair[1] -= dy;
    }
  }
}

function basic_shape(n) {
  let arr = [];
  let phi0 = 2.0 * Math.PI * Math.random();
  for(let i = 0; i < n; i++) {
    let phi = (2.0 * Math.PI * i / n) + phi0;
    let c = Math.cos(phi);
    let s = Math.sin(phi);
    arr.push([c,s]);
  }
  arr.push(arr[0]);
  return [arr];
}

function enhance(t){
  return ((sh) => {
    let r = t(sh);
    make_clockwise(r);
    make_microshift(r);
    return r;
  });
}

function tt(cmd) {
  return enhance(vec2d.compile(cmd));
}

function xor(s1, s2) {
  let arr = martinez.xor(s1, s2);
  let sh = arr.flat(); make_clockwise(sh);
  return sh;
}

function union(s1, s2) {
  let arr = martinez.union(s1, s2);
  let sh = arr.flat(); make_clockwise(sh);
  return sh;
}

function svg(arr) {
  let pic = `<svg width='100' height='100' viewBox="-1.5 -1.5 3 3">
    <!--
    <path d="M -5 -5 L 5 -5 L 5 5 L -5 5 Z" fill="none" stroke="grey" stroke-width="0.02"/>
    <path d="M -1 -1 L 1 -1 L 1 1 L -1 1 Z" fill="none" stroke="grey" stroke-width="0.02"/>-->`;
  for(let i = 0; i < arr.length; i++) {
    let mpoly = arr[i].shape;
    let style = arr[i].style;
    if (style === undefined) {
      let h = 360 * Math.random();
      let s = 70 + 30 * Math.random();
      let l = 20 + 80 * Math.random();
      style = `fill="hsl(${h},${s*0.5}%,${l*0.5}%)" stroke="hsl(${h},${s}%,${l}%)" stroke-width="0.04" fill-rule="evenodd"`;
    }
    pic += `<path d="${multpoly_to_s(mpoly)}" ${style}/>`;
  }
  pic += `</svg>`;
  return pic;
}

function base0(n) {
  let x = 0.2 + 0.8*Math.random();
  let p1 = tt(random_multi_command(5, 0.2, [['scale', x, 1-x]]))(basic_shape(3 + rnd.int(6)));
  let p2 = tt(random_multi_command(1, 0.2, [['scale', 0.1 + 0.8*Math.random(), 0.1 + 0.8*Math.random()]]))(p1);
  p1 = xor(p1, p2);

  // add n extra shapes
  for(let i = 0; i < n; i++) {
    let x3 = Math.random();
    let p3 = tt(random_multi_command(5, 0.2, [['scale', 0.2 + 0.4*x3, 0.2 + 0.4*(1-x3)]]))(basic_shape(3 + rnd.int(6)));
    if (rnd.int(2) === 0) {
      let p4 = tt(random_multi_command(1, 0.2, [['scale', 0.1 + 0.8*Math.random(), 0.1 + 0.8*Math.random()]]))(p3);
      p3 = xor(p3, p4);
    }
    p1 = union(p1, p3);
  }
  return p1;
}

function star(base, n) {
  let direction = 1; // ray up
  if (rnd.int(4) == 0) direction = -1;
  let ps = [tt([['trans', 0, -0.1*direction*(n)]])(base)];

  const symmetric = (n < 4) && (rnd.int(2) == 0);
  const m = (symmetric?(n*(2.0+3.0*Math.random())):n);

  for (let i=1; i < n; i++) {
    const before = [['trans', 0.0, 0.0], ['rot', 2*Math.PI/m]];
    const after = [];
    const cmd = random_multi_command(0, 0.3, before, after);
    const transform = tt(cmd);
    let p = transform(ps[i-1]);
    ps.push(p);
  }

  let p_union = ps[0];
  for (let i = 1; i < ps.length; i++) {
    p_union = union(p_union, ps[i]);
  }

  if (symmetric) {
    return union(p_union, tt([['re-y']])(p_union));
  }
  else
    return p_union;
}

function fit(mpoly, size=1) {
  let m = 0.001;
  for(let poly of mpoly){
    for(let [x,y] of poly){
      m = Math.max(m, Math.abs(x));
      m = Math.max(m, Math.abs(y));
    }
  }
  let factor = size / m;
  let res = [];
  for(let poly of mpoly){
    let p = [];
    for(let [x,y] of poly){
      p.push([x*factor, y*factor]);
    }
    res.push(p);
  }
  return res;
}

function make_logo() { 

  let s = '';
  for(let i = 0; i < 20; i++) {
    if (i > 0 && i % 5 === 0) {
      s += '<br />';
    }
    let m = rnd.int(3);
    let p0 = base0(m);
    let p = fit(star(p0, 4 + rnd.int(5) - m));
    //console.log(JSON.stringify(p), winding(p));
    s += svg([{shape: p}]);
  }

  return s;

}
