
'use strict';

// uses base.js, player.js, and team.js

function player_to_s(ini, pl) {
  if (ini === 1) {
    return '--'
  }
  let v = Math.round(Player.total(pl));
  return `(${v})`;
}

function opposite(spot) {
  switch(spot) {
    case Loc.CB: return Loc.CF;
    case Loc.LM: return Loc.RM;
    case Loc.CM: return Loc.CM;
    case Loc.RM: return Loc.LM;
    case Loc.CF: return Loc.CB;
    default: return spot;
  }
}

function loc_to_s(ini, loc) {
  switch(loc) {
    case Loc.CB : return "CB";
    case Loc.LM : return "LM";
    case Loc.CM : return "CM";
    case Loc.RM : return "RM";
    case Loc.CF : return "CF";
    default: return "XX";
  }
}


function sim_simulate_match(t) {

  // Given the real team tr
  var tex = [Team.expected(t[0]), Team.expected(t[1])]; // Expected 

  var events = [];

  var g = [0, 0];
  var ini = 0; // initiative, 0 or 1
  var spot = Loc.CM; 

  let next_spot = new Map();
  next_spot.set(Loc.GK, [ [Loc.CB, 1.0] ]);
  next_spot.set(Loc.CB, [ [Loc.LM, 0.3], [Loc.CM, 0.4], [Loc.RM, 0.3] ]);
  next_spot.set(Loc.LM, [ [Loc.CF, 1.0] ]);
  next_spot.set(Loc.CM, [ [Loc.CF, 1.0] ]);
  next_spot.set(Loc.RM, [ [Loc.CF, 1.0] ]);

  function get_next_spot(spot) {
    let arr = next_spot.get(spot);
    return sample_prob(arr); 
  }

  function pass() {
    let pl = Team.sample_win(t[ini], spot);
    if (pl === undefined) {
      ini = 1-ini; // intercepted
      spot = opposite(spot);
      return;
    }
    
    function say(result) {
      var msg = `${loc_to_s(ini, spot)}: ${player_to_s(ini, pl)} ${result}`;
      events.push([ini, msg]);
    }

    let tgt_spot = get_next_spot(spot);

    let tgt_exi = tex[ini].get(tgt_spot);
    let tgt_exo = tex[1-ini].get(opposite(tgt_spot));

    let atk = Model.combo(pl.pas, tgt_exi.win);
    let def = tgt_exo.win;

    if (Model.sample(atk, def)) { // ball moved forward
      say(`passes to ${loc_to_s(ini, tgt_spot)}`);
      spot = tgt_spot;
    }
    else {
      say(`pass intercepted`);
      ini = 1-ini; // intercepted
      spot = opposite(tgt_spot);
    }
  }
  
  function shoot() {
    let pl = Team.sample_win(t[ini], spot);
    if (pl === undefined) {
      ini = 1-ini; // intercepted
      spot = opposite(spot);
      return;
    }

    function say(result) {
      var msg = `${loc_to_s(ini, spot)}: ${player_to_s(ini, pl)} shoots -- ${result}`;
      events.push([ini, msg]);
    }
    
    let excb = tex[1-ini].get(Loc.CB);
    let exgk = tex[1-ini].get(Loc.GK);

    let atk = pl.atk;
    let cf_win = tex[ini].get(Loc.CF).win;
    let def_cb = excb.def;
    let def_gk = exgk.def;

    if (Model.sample(Model.combo(atk, Math.pow(cf_win, 0.5)), 
                     Model.combo(def_cb, Math.pow(excb.win, 0.05)))) { // not blocked by defenders
      if (Model.sample(atk, def_gk)) { // scored
        g[ini] += 1;
        say(`GOAL! ${g[0]}-${g[1]}`);
        ini = 1 - ini;
        spot = Loc.CM;
      }
      else {
        say(`stopped`);
        ini = 1-ini; // stopped by GK
        spot = opposite(spot);
      }
    }
    else {
      say(`blocked`);
      ini = 1-ini; // blocked by a defender
      spot = opposite(spot);
    }
  }

  for(var time = 0; time < 90; time += 1) {
    //console.log(time, g, ini, spot);
    if (spot === Loc.CF) {
      shoot();
    }
    else {
      pass();
    }
  }

  return [g[0], g[1], events];
}

function sim_simulate_median_match(t, num=5) {
  var arr = [];
  for(let i = 0; i < num; i++) {
    arr.push(sim_simulate_match(t));
  }
  arr.sort(function(a,b){ return (a[0]-a[1]) - (b[0]-b[1]); });

  return arr[Math.floor(num/2)];
}

var Sim = {
  simulate_match : sim_simulate_match,
  simulate_median_match : sim_simulate_median_match,
}

