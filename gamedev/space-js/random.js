function make_random() {

  /* 0 ... (max-1) */
  function int(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
  
  function round_probabilistic(x) {
    let y = Math.floor(x);
    let dy = (Math.round() < (x - y)) ? 1 : 0;
    return y + dy;
  }

  function from_arr(arr) {
    return arr[int(arr.length)];
  }
  
  function from_arr_prob(arr) {
    let x = Math.random();
    if (arr.length === 0) {
      return undefined;
    }
    for (const entry of arr) {
      const v = entry[0];
      const p = entry[1];
      if (x <= p) {
        return v;
      }
      x -= p;
    }
    return arr[0][0];
  }
  
  // Uniform sampling from an iterator
  function from_iter(iter, size) {
    const j = random_int(size);
    let x = undefined;
    for(const y of iter) {
      x = y;
      if (j > 0) {
        j -= 1;
      }
      else {
        break;
      }
    }
    return x;
  }
  
  function std_normal(){
    // Box-Muller method
    const u = Math.random();
    const v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function bounded_std_normal(lo, hi){
    let x = hi+1;
    while(x < lo || hi < x) {
      x = gen_std_normal();
    }
    return x;
  }

  function shuffle_array(a) {
      let j, x, i;
      for (i = a.length - 1; i > 0; i--) {
          j = Math.floor(Math.random() * (i + 1));
          x = a[i];
          a[i] = a[j];
          a[j] = x;
      }
      return a;
  }

  return {
    'int' : int,
    'round_probabilistic' : round_probabilistic,
    'from_arr' : from_arr,
    'from_arr_prob' : from_arr_prob,
    'from_iter' : from_iter,
    'std_normal' : std_normal,
    'bounded_std_normal' : bounded_std_normal,
    'shuffle_array' : shuffle_array,
  }
}

let rnd = make_random();
