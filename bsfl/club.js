
'use strict';

/* uses team.js */

function club_make(name, team) {
  return {'name' : name, 'team' : team};
}

function club_all_wages(c) {
  return Team.all_wages(c.team);
}

function club_generate_one_name(lvl) {
  let arr = real_club_names[Math.min(Math.floor(lvl), 12)];
  let cc = sample_from_iter(arr, arr.length);
  return cc.name;
}

function club_generate_names(lvl, n) {
  let arr = real_club_names[Math.min(Math.floor(lvl), 12)];
  let narr = [];
  for (let x of arr) {
    narr.push(x.name);
  }
  shuffle_array(narr); 
  return narr.slice(0, n);
}

function club_generate_opponent(lvl, name) {
  let t0 = Team.make_good(lvl);
  let qt0 = Team.quick_formation(t0);
  
  let time = 500 + Math.min(2000, Math.round(200 * lvl)) + random_int(2000);

  let gqt0 = Team.good_formation(qt0, time);
  let mean_pl = Team.mean_player(gqt0);

  var c = Club.make(name, gqt0);
  return c;
}


let Club = {
  make : club_make,
  all_wages : club_all_wages,
  generate_opponent : club_generate_opponent,
  generate_names : club_generate_names,
  generate_one_name : club_generate_one_name,
};
