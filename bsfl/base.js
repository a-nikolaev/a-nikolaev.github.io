
'use strict';

const global_max_division = 9;

/* 0 ... (max-1) */
function random_int(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function gen_std_normal(){
  // Box-Muller method
  let u = Math.random();
  let v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function bounded_std_normal(lo, hi){
  var x = hi+1;
  while(x < lo || hi < x) {
    x = gen_std_normal();
  }
  return x;
}

function clamp(lo, hi, x) {
  return Math.min(Math.max(lo, x), hi);
}


/* Locations */
const Loc = {
  Bench: 0,
  GK: 1,
  CB: 2,
  LB: 3, DM: 4, RB: 5,
  LM: 6, CML: 7, CM: 8, CMR: 9, RM: 10,
  LW: 11, AM: 12, RW: 13,
  CF: 14
};

function loc_of_str(s) {
  return Loc[s];
}

function s_of_loc(loc) {
  switch(loc) {
    case Loc.Bench : return "Bench";
    case Loc.GK : return "GK";

    case Loc.CB : return "CB";
    
    case Loc.LB : return "LB";
    case Loc.DM : return "DM";
    case Loc.RB : return "RB";
    
    case Loc.LM : return "LM";
    case Loc.CML : return "CML";
    case Loc.CM : return "CM";
    case Loc.CMR : return "CMR";
    case Loc.RM : return "RM";
    
    case Loc.LW : return "LW";
    case Loc.AM : return "AM";
    case Loc.RW : return "RW";
    
    case Loc.CF : return "CF";
    default: return "XX";
  }
}



function loc_is_bench(loc) {
  return (loc === Loc.Bench);
}

function loc_is_pitch(loc) {
  return (loc !== undefined && loc !== Loc.Bench);
}

function loc_to_spot(loc) {
  switch(loc) {
    case Loc.Bench: return [];
    case Loc.GK: return [];
    case Loc.LB: return [Loc.CB, Loc.LM];
    case Loc.DM: return [Loc.CB, Loc.CM];
    case Loc.RB: return [Loc.CB, Loc.RM];
    case Loc.CML: return [Loc.CM, Loc.LM];
    case Loc.CMR: return [Loc.CM, Loc.RM];
    case Loc.LW: return [Loc.CF, Loc.LM];
    case Loc.AM: return [Loc.CF, Loc.CM];
    case Loc.RW: return [Loc.CF, Loc.RM];
    default: return [loc, loc]
  }
}

function sample_prob(arr) {
  var x = Math.random();
  if (arr.length === 0) {
    return undefined;
  }
  for (let entry of arr) {
    let v = entry[0];
    let p = entry[1];
    if (x <= p) {
      return v;
    }
    x -= p;
  }
  return arr[0][0];
}

function make_child(parent, tag, attrs, gen_content) {
  let ch = document.createElement(tag);
  ch.innerHTML = '';
  for (var attr in attrs) {
    ch.setAttribute(attr, attrs[attr]);
  }
  parent.appendChild(ch);
  gen_content(ch);
}

function s_of_money_approx(x){

  function f(unit, sym) {
    var v = x / unit;
    if (v >= 20) {
      v = Math.round(v);
    }
    else {
      v = Math.round(v * 10) / 10; 
    }

    return `<div class='money'><span class='dollar'>\$</span>${v}<i>${sym}</i></span>`;
  }

  if (x >= 1e9) {
    return f(1e9, 'B');
  }
  else if (x >= 1e6) {
    return f(1e6, 'M');
  }
  else if (x >= 1e3) {
    return f(1e3, 'K');
  }
  else {
    return f(1, '');
  }
}


function s_of_money_exact(x){

  function f(unit, sym) {
    var v = x / unit;
    return `<div class='money'><span class='dollar'>\$</span>${v}<i>${sym}</i></span>`;
  }

  if (x >= 1e9) {
    return f(1e9, 'B');
  }
  else if (x >= 1e6) {
    return f(1e6, 'M');
  }
  else if (x >= 1e3) {
    return f(1e3, 'K');
  }
  else {
    return f(1, '');
  }
}

function round_to(x, sig_digits){
  function log10(x) {
    return Math.log(x) / Math.log(10);
  }

  let digits = Math.floor(log10(x)) + 1;

  let to_remove = digits - sig_digits;
  let factor = 10**to_remove;
  
  return Math.round (x / factor) * factor;
}

function rounding(x) {
  return round_to(x, 3);
}

function round_probable(x) {
  let y = Math.floor(x);
  let dy = (Math.round() < (x - y)) ? 1 : 0;
  return y + dy;
}

// Uniform sampling from an iterator
function sample_from_iter (iter, size) {
  let j = random_int(size);
  var x = undefined;
  for(let y of iter) {
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

function shuffle_array(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
