
'use strict';

/* uses team.js */

function club_make(name, team) {
  return {'name' : name, 'team' : team};
}

function club_all_wages(c) {
  return Team.all_wages(c.team);
}

function club_generate_opponent(lvl) {
  let t0 = Team.make_good(lvl);
  let qt0 = Team.quick_formation(t0);
  
  let time = 500 + Math.round(200 * lvl) + random_int(2000);

  let gqt0 = Team.good_formation(qt0, time);
  let mean_pl = Team.mean_player(gqt0);
  var c = Club.make(`${Math.round(11.0 * Player.total(mean_pl))}-Q-${time}`, gqt0);
  return c;
}


let Club = {
  make : club_make,
  all_wages : club_all_wages,
  generate_opponent : club_generate_opponent,
};
