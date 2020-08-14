
const vec2d = {
  multvec([[a,b,c],[d,e,f]], [x,y]) {
    return [a*x + b*y + c*1, d*x + e*y + f*1];
  },
  /*
    a b c   g h i 
    d e f   j k l
    0 0 1   0 0 1
  */
  mult([[a,b,c],[d,e,f]], [[g,h,i], [j,k,l]]) {
    return [
      [a*g + b*j, a*h + b*k, a*i + b*l + c],
      [d*g + e*j, d*h + e*k, d*i + e*l + f]
    ];
  },

  rot(rad) {
    let c = Math.cos(rad);
    let s = Math.sin(rad);
    return [ [c,s,0], [-s,c,0] ];
  },
  
  trans(dx, dy) {
    return [ [1,0,dx], [0,1,dy] ];
  },
  
  scale(a, b) {
    return [ [a,0,0], [0,b,0] ];
  },

  reflex_x : [[1,0,0], [0,-1,0]],
  
  reflex_y : [[-1,0,0], [0,1,0]],
  
  reflex_main_diag : [[0,1,0], [1,0,0]],
  
  reflex_aux_diag :  [[0,-1,0], [-1,0,0]],
  
  sheer(a, b) {
    return [ [1,a,0], [b,1,0] ];
  },

  get_cmd(c) {
    let cmd = c;
    if (Array.isArray(c)) {
      cmd = c[0];
    }
    return cmd;
  },

  matrix(c) {
    let cmd = this.get_cmd(c);
    switch(cmd){
      case 're-x': return this.reflex_x;
      case 're-y': return this.reflex_y;
      case 're-d': return this.reflex_main_diag;
      case 're-d2': return this.reflex_aux_diag;

      case 'scale': return this.scale(c[1], c[2]);
      case 'trans': return this.trans(c[1], c[2]);
      case 'sheer': return this.sheer(c[1], c[2]);
      case 'rot': return this.rot(c[1]);
    }
  },

  compile(arr){
    let m = [[1,0,0], [0,1,0]];
    for(const c of arr) {
      m = this.mult(this.matrix(c), m);
    }
    return ((mpoly)=>
      mpoly.map((poly)=>
        poly.map((vx) => this.multvec(m, vx))
      )
    );
  }
}
