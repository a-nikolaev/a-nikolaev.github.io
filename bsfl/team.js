
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

function team_add_player(team, pl, loc) {
  let id = parseInt(pl.id)
  team.players.set(id, pl);
  team.player_loc.set(id, loc);
  team.place.get(loc).add(id);
  if (loc_is_pitch(loc)) {
    team.count_on_pitch += 1;
  }
}

function team_remove_player_by_id(team, id) {
  let loc = team.player_loc.get(id);
  team.players.delete(id);
  team.player_loc.delete(id);
  team.place.get(loc).delete(id);
  if (loc_is_pitch(loc)) {
    team.count_on_pitch -= 1;
  }
}

function team_make_random() {
  const init_num_players = max_players_on_pitch + 0;
  
  var team = team_make_empty();
      
  for (var i = 0; i < init_num_players; i++) {
    var pl = Player.make();
    Player.assign_unique_id(pl);
    let id = parseInt(pl.id)
    team.players.set(id, pl);
  }

  for (var id of team.players.keys()) {
    team.player_loc.set(id, Loc.Bench);
    team.place.get(Loc.Bench).add(id);
  }
  return team;
}
    
function team_mean_player(team) {
  var pl_sum = Player.zero();

  if (team.players.size > 0) {
    for (var [id, pl] of team.players) {
      pl_sum = Player.sum(pl_sum, pl);
    }
    return Player.mult(pl_sum, 1.0 / team.players.size);
  }
  else
    return pl_sum;
}

function team_mean_player_on_pitch(team) {
  var pl_sum = Player.zero();

  if (team.count_on_pitch > 0) {
    var num = 0;
    for (var [id, pl] of team.players) {
      if (loc_is_pitch(team.player_loc.get(id))) {
        pl_sum = Player.sum(pl_sum, pl);
        num += 1;
      }
    }
    return Player.mult(pl_sum, 1.0 / num);
  }
  else
    return pl_sum;
}

function team_all_wages(team) {
  var sum = 0;
  for(let pl of team.players.values()) {
    sum += pl.wage;
  }
  return sum;
}

function team_mean_team(team) {
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

  var id0 = -1;
  // ratio=0: defense
  // ratio=1: attack
  function gen(ratio) {
    let def = abs_min + diff*(1-ratio);
    let atk = abs_min + diff*ratio;
    let pl = {win: h, pas: h, atk: atk, def: def, id: id0};
    id0 -= 1;
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

function team_make_good_old(factor = 1) {
  var not_ready = true; 
  var attempts = 0; 
  
  var team;

  while(not_ready) {
    attempts += 1;

    team = team_make_random();

    var pl_mean = team_mean_player(team);

    function is_good(x) {
      return 5.5 < x && x < 6*factor;
    }

    if (is_good(pl_mean.atk) && is_good(pl_mean.win) && is_good(pl_mean.pas) && is_good(pl_mean.def)) {
      not_ready = false;
    }
    // PRINTING ATTEMPTS
    // console.log(attempts, pl_mean.atk, pl_mean.win, pl_mean.pas, pl_mean.def);
  }
  return team;
}

function team_make_good(lvl = 0) {
  const init_num_players = max_players_on_pitch + 0;
  
  let arr = [];
  var num = 0;
  
  function all_are_good(pl) {
    let mean = (pl.win + pl.pas + pl.atk + pl.def) * 0.25;
    function is_good(x) {
      return mean*0.94 < x && x < mean * 1.08;
    }
    return (is_good(pl.atk) && is_good(pl.win) && is_good(pl.pas) && is_good(pl.def));
  }
  
  var sum_pl = Player.zero(); 
  var i = 0;
  while (num < init_num_players || ! all_are_good(sum_pl)) {

    let pls = [];
    for(let j = 0; j < 1 + round_probable(0.5 * lvl); j++) {
      pls.push(Player.make(lvl));
    }
    console.log('sampled', pls.length);
    pls.sort(function(a,b){return Player.total(b) - Player.total(a);});
    let pl = pls[0];

    //let pl = Player.make();

    arr.push(pl);
    sum_pl = Player.sum(sum_pl, pl);
    if (num < init_num_players) {
      num += 1;
    }
    else {
      //     v     i   num = 3   
      // 0 1 2 3 4 5
      let i_to_subtract = i - num;
      if (i_to_subtract >= 0) {
        sum_pl = Player.sum(sum_pl, Player.mult(arr[i_to_subtract], -1));
      }
    }
    i += 1;
  }
  console.log('founda after ', i);

  var team = team_make_empty();
  //       v     i  num = 3
  // 0 1 2 3 4 5 -
  for (let j = i - num; j < i; j++) {
    let pl = arr[j];
    Player.assign_unique_id(pl)
    team_add_player(team, pl, Loc.Bench);
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

function team_estimate_lineup_expected(e, eop){

  function xy(x, y) {
    return Model.mean(x, y);
  }
  function xxy(x1, x2, y) {
    return Model.mean(Model.combo(x1, x2), y);
  }

  function or_zero(x) {
    if (isNaN(x)) 
      return 0;
    else
      return x;
  }

  // CB
  var x_cb = 50.0 * ( 
    0.3 * or_zero(xy(e.get(Loc.CB).win, Model.combo(eop.get(Loc.CF).win, eop.get(Loc.LM).pas))) + 
    0.4 * or_zero(xy(e.get(Loc.CB).win, Model.combo(eop.get(Loc.CF).win, eop.get(Loc.CM).pas))) + 
    0.3 * or_zero(xy(e.get(Loc.CB).win, Model.combo(eop.get(Loc.CF).win, eop.get(Loc.RM).pas))) ) ;
  if (x_cb <= 0){
    x_cb = 0;
  }

  // LM, CM, RM
  var wgt_lm = 3;
  var wgt_cm = 4;
  var wgt_rm = 3;
  var wgt_sum = wgt_lm + wgt_cm + wgt_rm;

  var cb_to_lm = x_cb * or_zero(wgt_lm / wgt_sum);
  var cb_to_cm = x_cb * or_zero(wgt_cm / wgt_sum);
  var cb_to_rm = x_cb * or_zero(wgt_rm / wgt_sum);

  var x_lm = cb_to_lm * or_zero(xxy(e.get(Loc.CB).pas, e.get(Loc.LM).win, eop.get(Loc.RM).win));
  var loss_lm = cb_to_lm - x_lm;
  
  var x_cm = cb_to_cm * or_zero(xxy(e.get(Loc.CB).pas, e.get(Loc.CM).win, eop.get(Loc.CM).win));
  var loss_cm = cb_to_cm - x_cm;
  
  var x_rm = cb_to_rm * or_zero(xxy(e.get(Loc.CB).pas, e.get(Loc.RM).win, eop.get(Loc.LM).win));
  var loss_rm = cb_to_rm - x_rm;

  x_lm += 30.0 * or_zero(xy(e.get(Loc.LM).win, Model.combo(eop.get(Loc.RM).win, eop.get(Loc.CB).pas)));
  x_cm += 30.0 * or_zero(xy(e.get(Loc.CM).win, Model.combo(eop.get(Loc.CM).win, eop.get(Loc.CB).pas)));
  x_rm += 30.0 * or_zero(xy(e.get(Loc.RM).win, Model.combo(eop.get(Loc.LM).win, eop.get(Loc.CB).pas)));

  // CF
  var lm_to_cf = x_lm;
  var cm_to_cf = x_cm;
  var rm_to_cf = x_rm;
  var got_from_lm = lm_to_cf * or_zero(xxy(e.get(Loc.LM).pas, e.get(Loc.CF).win, eop.get(Loc.CB).win));
  var got_from_cm = cm_to_cf * or_zero(xxy(e.get(Loc.CM).pas, e.get(Loc.CF).win, eop.get(Loc.CB).win));
  var got_from_rm = rm_to_cf * or_zero(xxy(e.get(Loc.RM).pas, e.get(Loc.CF).win, eop.get(Loc.CB).win));

  var before_block_cf = got_from_lm + got_from_cm + got_from_rm;
  var loss_cf = (lm_to_cf + cm_to_cf + rm_to_cf) - before_block_cf;

  // Shoot - Block
  var x_cf = before_block_cf * or_zero(xy(e.get(Loc.CF).atk, eop.get(Loc.CB).def));
  var block_cf = before_block_cf - x_cf;

  // Shoot - Goalkeeper
  var x_goal = x_cf * or_zero(xy(e.get(Loc.CF).atk, eop.get(Loc.GK).def));
  var block_goal = x_cf - x_goal;

  let ans = {
    'cb_to_lm': cb_to_lm,
    'cb_to_cm': cb_to_cm,
    'cb_to_rm': cb_to_rm,
    
    'loss_lm': loss_lm,
    'loss_cm': loss_cm,
    'loss_rm': loss_rm,
    
    'lm_to_cf': lm_to_cf,
    'cm_to_cf': cm_to_cf,
    'rm_to_cf': rm_to_cf,
    
    'loss_cf': loss_cf,
    'block_cf': block_cf,
    'x_cf': x_cf,
    
    'block_goal': block_goal,
    'x_goal': x_goal,
  };

  return ans;
}

// Sampling
function team_sample_win(team, loc) {
  var arr = [];
  var sum = 0;
  for (let [id, pl] of team.players) {
    let pl_loc = team.player_loc.get(pl.id);
    let spots = loc_to_spot(pl_loc);
    for (let spot of spots){
      if (spot === loc) {
        arr.push([pl, pl.win]);
        sum += pl.win;
      }
    }
  }
  for (var i = 0; i < arr.length; i++) {
    arr[i][1] /= sum;
  }
  return sample_prob(arr);
}

function team_clone(team_orig) {
  var team = { 
    players : new Map(team_orig.players),
    player_loc : new Map(team_orig.player_loc),
    count_on_pitch : team_orig.count_on_pitch,
    place : new Map()
  };
  for(let [loc, set_orig] of team_orig.place) {
    team.place.set(loc, new Set(set_orig));
  }
  return team;
}

// Random formation change
function team_random_change(team_orig) {
  let team = team_clone(team_orig);

  // sample a player from the team
  let pl_num = team.players.size;
  let id = sample_from_iter(team.players.keys(), pl_num);
  let src_loc = team.player_loc.get(id);

  // sample dst location
  let locs_arr = Object.values(Loc);
  let dst_loc = parseInt(sample_from_iter(locs_arr, locs_arr.length));

  if (! team_allow_move(team, id, src_loc, dst_loc)) {
    let set_ids_at_dst = team.place.get(dst_loc);
    let id2 = sample_from_iter(set_ids_at_dst, set_ids_at_dst.size);
    team_move_player(team, id2, dst_loc, src_loc);
  }
  team_move_player(team, id, src_loc, dst_loc);
  return team;
}

// Auto-formation

function team_quick_formation(team0) {
  let team = team_clone(team0);
  let ids = Array.from(team.players.keys());
  for (let id of ids){
    team_move_player(team, id, team.player_loc.get(id), Loc.Bench);
  }

  let options = [
    [[ 10, -1, -1, -2 ], [Loc.GK]], 
    [[  4,  2,  2, -2 ], [Loc.CB]], 
    [[  3,  2,  2, -1 ], [Loc.LB, Loc.DM, Loc.RB]], 
    [[ -1,  4,  4, -1 ], [Loc.LM, Loc.CML, Loc.CM, Loc.CMR, Loc.RM]], 
    [[ -1,  2,  2,  3 ], [Loc.LW, Loc.AM, Loc.RW]], 
    [[ -1,  3, -1,  5 ], [Loc.CF]]
  ];

  var arr = [];

  for (let id of ids) {
    let pl = team.players.get(id);
    for (let opt of options) {
      let x = opt[0];
      let locs = opt[1];
      let score = pl.def * x[0] + pl.win * x[1] + pl.pas * x[2] + pl.atk * x[3];
      arr.push([score, id, locs]);
    }
  }

  arr.sort(function(a,b){return b[0] - a[0];});

  for(let a of arr){
    let score = a[0];
    let id = a[1];
    let locs = a[2];

    if (team.player_loc.get(id) === Loc.Bench) {
      let dst_loc = locs[random_int(locs.length)];

      if (team_allow_move(team, id, Loc.Bench, dst_loc)) {
        team_move_player(team, id, Loc.Bench, dst_loc);
      }
    }
  }

  return team;
}

function team_good_formation(team0, iter_num=2000) {

  function team_strength(t) {
    let e1 = Team.expected(t);
    let e2 = Team.expected(team_mean_team(t));
    
    let z1 = team_estimate_lineup_expected(e1, e2);
    let z2 = team_estimate_lineup_expected(e2, e1);
    
    let g1 = parseFloat(z1.x_goal);
    let g2 = parseFloat(z2.x_goal);

    if (g2 > 0) {
      return (g1-g2)/g2 + t.count_on_pitch;
    }
    else {
      return -1;
    }
  }

  function team_symmetry(t){
    let arr = [[Loc.LB, Loc.RB], [Loc.LM, Loc.RM], [Loc.CML, Loc.CMR], [Loc.LW, Loc.RW]];
    
    var ecc = 0.0;
    var num = 0;
    for(let e of arr) {
      let l1 = e[0];
      let l2 = e[1];
      let n1 = t.place.get(l1).size;
      let n2 = t.place.get(l2).size;
      let decc = Math.abs(n1 - n2) / (n1 + n2 + 1);
      ecc += decc;
      num += 1; 
    }

    return (-ecc/num);
  }

  function team_eval(t) {
    return team_strength(t) + 0.15 * team_symmetry(t);
  }

  var t1 = team_clone(team0);
  var t2 = t1;
  var score1 = team_eval(t1);
  var score2 = score1;

  // console.log(score1, score2);

  for(var i = 0; i < iter_num; i++) {
    t2 = team_random_change(t1);
    score2 = team_eval(t2);

    let temperature = 0.02 * (iter_num - i) / iter_num ;
    if (score2 > score1 || Math.random() < Math.exp((score2-score1)/temperature)) {
      t1 = t2;
      score1 = score2;
      // console.log(score1);
    }
  }

  return t1;

}

var Team = {
  add_player : team_add_player,
  remove_player_by_id : team_remove_player_by_id,

  all_wages : team_all_wages,
  mean_player : team_mean_player,
  mean_team : team_mean_team,
  make_good : team_make_good,
  allow_move : team_allow_move,
  move_player : team_move_player,
  
  expected : team_expected,
  estimate_lineup_expected : team_estimate_lineup_expected,

  sample_win : team_sample_win,

  random_change : team_random_change,
  good_formation : team_good_formation,
  quick_formation : team_quick_formation,
}

