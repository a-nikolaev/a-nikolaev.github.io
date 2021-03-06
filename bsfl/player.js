
'use strict';

/* uses base.js, names.js, face.js */

/* Player */
function player_zero() {
  return {def : 0, win : 0, atk : 0, pas : 0, id : -1};
}

function player_make(lvl=0) {
  /*
  let pre_atk = random_int(6)
  let atk = 3 + pre_atk + random_int(2);
  let def = 3 + (5 - pre_atk) + random_int(2);
  let win = 3 + random_int(7); 
  let pas = 3 + random_int(7); 
  */

  function g() {
    // return clamp(0, 10, 2 + Math.round((0.5 * lvl+1.7) * bounded_std_normal(0.0, 10.0)));
    // return clamp(0, 10, 2 + Math.round((0.5 * lvl*lvl/12 +1.7) * bounded_std_normal(0.0, 10.0)));
    let d_num = global_max_division+1;
    return clamp(0, 10, 2 + Math.round((0.5 * lvl*lvl * 12/(d_num*d_num) + 1.7) * bounded_std_normal(0.0, 10.0)));
  }

  var atk = g();
  var def = g();

  if (def === atk) {
    if (random_int(2) === 0) {
      def -= 0.000001;
    }
    else {
      atk -= 0.000001;
    }
  }
  if (def > atk) {
    atk = clamp(2, 10, Math.round(atk / 2));
  }
  else if (atk > def) {
    def = clamp(2, 10, Math.round(def / 2));
  }

  let win = g(); 
  let pas = g(); 

  let sum = 0.5 * (atk + pas + win + def) + 2.0 * Math.max(atk, pas, win, def);

  let x_v = 4; // deterministic to random ratio of the player's cost
  let x_w = 3; // deterministic to random ratio of the player's cost

  let value = rounding(sum*sum*sum * 20 * (1.0/x_v) * (x_v + bounded_std_normal(-1, 1)));
  let wage = rounding(sum*sum*sum*sum * 0.1 * (1.0/x_w) * (x_w + bounded_std_normal(-1, 1)));

  let price = rounding(value * 1.1 * (2 + bounded_std_normal(-1, 1)));

  let firstname = sample_prob(collection_first_name);
  let lastname = sample_prob(collection_last_name);

  return {
    def : def, win : win, atk : atk, pas : pas, 
    value : value,
    wage : wage,
    price : price,
    firstname : firstname,
    lastname : lastname,
    face : Face.make(),
    id : -1};
}

var unique_player_id_counter = 0;

function player_assign_unique_id(pl) {
  pl.id = unique_player_id_counter;
  unique_player_id_counter += 1;
}

function player_total(pl) {
  return pl.atk + pl.pas + pl.win + pl.def;
}

function player_sum(p1, p2) {
  return {
    atk : (p1.atk + p2.atk),
    pas : (p1.pas + p2.pas),
    win : (p1.win + p2.win),
    def : (p1.def + p2.def),
    id : p1.id
  }
}

function player_mult(p1, x) {
  return {
    atk : (p1.atk * x),
    pas : (p1.pas * x),
    win : (p1.win * x),
    def : (p1.def * x),
    id : p1.id
  }
}

let Player = {
  zero : player_zero,
  make : player_make,
  assign_unique_id : player_assign_unique_id,
  total : player_total,
  sum : player_sum,
  mult : player_mult,
};

