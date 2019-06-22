
'use strict';

/* uses base.js and player.js */

/* number of players per team */
const max_players_on_pitch = 11;
  
function team_make_empty() {
  var team = {
    players:    new Map(),  // Map of (player ID -> player)
    player_loc: new Map(),  // Map of (player ID -> loc)
    place:      new Map(),  // Map of (loc -> (Set of player IDs))
    count_on_pitch: 0       // Number of players on the pitch, should not exceed max_players_on_pitch
  }

  for (var loc = Loc.Bench; loc <= Loc.CF; loc++) {
    team.place.set(loc, new Set());
  }

  return team;
}
  
function team_make_random(id0) {
  const init_num_players = max_players_on_pitch + 0;
  
  var team = team_make_empty();
      
  for (var i = 0; i < init_num_players; i++) {
    var id = id0 + i;
    var pl = player_make(id);
    team.players.set(id, pl);
  }

  for (var id of team.players.keys()) {
    team.player_loc.set(id, Loc.Bench);
    team.place.get(Loc.Bench).add(id);
  }
  return team;
}
    
function team_mean_player(team) {
  var pl_sum = player_zero();

  if (team.players.size > 0) {
    for (var [id, pl] of team.players) {
      pl_sum = player_sum(pl_sum, pl);
    }
    return player_mult(pl_sum, 1.0 / team.players.size);
  }
  else
    return pl_sum;
}

function team_mean_player_on_pitch(team) {
  var pl_sum = player_zero();

  if (team.count_on_pitch > 0) {
    var num = 0;
    for (var [id, pl] of team.players) {
      if (loc_is_pitch(team.player_loc.get(id))) {
        pl_sum = player_sum(pl_sum, pl);
        num += 1;
      }
    }
    return player_mult(pl_sum, 1.0 / num);
  }
  else
    return pl_sum;
}


function team_mean_team(team, id0=-max_players_on_pitch) {
  var pl_base = team_mean_player_on_pitch(team);

  var h = 0.5 * (pl_base.win + pl_base.pas);
  var v = 0.5 * (pl_base.atk + pl_base.def)
  
  var min_def = (h+v) * 1000.0;
  var min_atk = (h+v) * 1000.0;

  var any_found = false;
  for (var [id, pl] of team.players) {
    if (loc_is_pitch(team.player_loc.get(id))) {
      min_def = Math.min(min_def, pl.def);
      min_atk = Math.min(min_atk, pl.atk);
      any_found = true;
    }
  }
  
  var abs_min = Math.min(min_def, min_atk);
  var diff = 2*v - 2*abs_min;
  
  // make new team
  var new_team = team_make_empty();

  if (!any_found) {
    return new_team;
  }

  // ratio=0: defense
  // ratio=1: attack
  var id = id0;
  function gen(ratio) {
    let def = abs_min + diff*(1-ratio);
    let atk = abs_min + diff*ratio;
    let pl = {win: h, pas: h, atk: atk, def: def, id: id};
    id += 1;
    return pl;
  }

  function add(pl, loc) {
    var id = parseInt(pl.id)
    new_team.players.set(id, pl);
    new_team.player_loc.set(id, loc);
    new_team.place.get(loc).add(id);
    new_team.count_on_pitch += 1;
  }
  
  add(gen(0.0), Loc.GK);
  
  add(gen(0.0), Loc.CB);
  add(gen(0.0), Loc.CB);
  
  add(gen(0.25), Loc.LB);
  add(gen(0.25), Loc.RB);
  
  add(gen(0.5), Loc.CML);
  add(gen(0.5), Loc.CM);
  add(gen(0.5), Loc.CMR);
  
  add(gen(0.75), Loc.LW);
  add(gen(0.75), Loc.RW);

  add(gen(1.0), Loc.CF);

  return new_team;
}

function team_make_good(id0) {
  var not_ready = true; 
  var attempts = 0; 
  
  var team;

  while(not_ready) {
    attempts += 1;

    team = team_make_random(id0);

    var pl_mean = team_mean_player(team);

    function is_good(x) {
      return x > 5.5 && x < 6;
    }

    if (is_good(pl_mean.atk) && is_good(pl_mean.win) && is_good(pl_mean.pas) && is_good(pl_mean.def)) {
      not_ready = false;
    }
    // PRINTING ATTEMPTS
    console.log(attempts, pl_mean.atk, pl_mean.win, pl_mean.pas, pl_mean.def);
  }
  return team;
}

function team_allow_move(team, id, loc_from, loc_to) {
  return (team.player_loc.get(id) === loc_from) && 
    ((team.count_on_pitch < max_players_on_pitch || loc_is_pitch(loc_from)) && (loc_to !== Loc.GK || team.place.get(Loc.GK).size === 0)) ||
    (loc_from === loc_to);
}

function team_move_player(team, id, loc_from, loc_to) {
  team.place.get(loc_from).delete(id);
  team.place.get(loc_to).add(id);
  team.player_loc.set(id, loc_to);
  
  if (loc_is_pitch(loc_from)) {
    team.count_on_pitch -=1;
  }

  if (loc_is_pitch(loc_to)) {
    team.count_on_pitch +=1;
  }
}

// Condense the team to spots
function team_to_spots(team) {
  var spots = new Map();

  for (let spot of [Loc.CB, Loc.LM, Loc.CM, Loc.RM, Loc.CF]) {
    spots.set(spot, []);
  }

  for (let  [id, pl] of team.players) {
    let pl_loc = team.player_loc.get(id);
    let pl_spots = loc_to_spot(pl_loc);

    let win = pl.win;
    for (let spot of pl_spots) {
      spots.get(spot).push([win, pl])
    }
  }

  var gk_def = 0;
  for (let id of team.place.get(Loc.GK)) {
    gk_def = team.players.get(id).def;
  }

  return {spots : spots, gk_def : gk_def };
}

// Compute expected players performance for condensed team
function spots_expected(ct) {
  let spots = ct.spots;
  let gk_def = ct.gk_def;

  var avgs = new Map();
  
  avgs.set(Loc.GK, { def : gk_def });

  for(let [spot, arr] of spots) {
    var tot_win = 0;
    var wgt_atk = 0;
    var wgt_def = 0;
    var wgt_pas = 0;
    for(let [w, pl] of arr) {
      tot_win += w;
      wgt_atk += w * pl.atk;
      wgt_def += w * pl.def;
      wgt_pas += w * pl.pas;
    }

    var mean_atk = wgt_atk / tot_win;
    var mean_def = wgt_def / tot_win;
    var mean_pas = wgt_pas / tot_win;

    if (tot_win > 0) {
      avgs.set(spot, { win : tot_win, pas : mean_pas, def : mean_def, atk : mean_atk })
    }
    else {
      avgs.set(spot, { win : 0, pas : 0, def : 0, atk : 0 });
    }
  }

  return avgs;
}

// Expected team
function team_expected(team) {
  return spots_expected( team_to_spots(team) );
}

var Team = {
  mean_player : team_mean_player,
  mean_team : team_mean_team,
  make_good : team_make_good,
  allow_move : team_allow_move,
  move_player : team_move_player,
  
  expected : team_expected,
}

