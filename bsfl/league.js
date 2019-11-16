
'use strict';

/* uses club.js */

function league_make(n, seeded_clubs=[]) {

  let clubs = [];
  let is_player = [];
  let points = [];
  let wins = [];
  let draws = [];
  let losses = [];
  let goals_for = [];
  let goals_ag = [];
  let order_i2place = [];
  let order_place2i = [];

  for(let i = 0; i < n; i++) {
    var c;
    if (i < seeded_clubs.length) {
      c = seeded_clubs[i];
    }
    else {
      let t0 = Team.make_good();
      let qt0 = Team.quick_formation(t0);
      
      let time = 1 + random_int(8);

      let gqt0 = Team.good_formation(qt0, time*1000);
      let mean_pl = Team.mean_player(gqt0);
      c = Club.make(`${Math.round(11.0 * Player.total(mean_pl))}-Q-${time}K`, gqt0);
    }
    clubs.push(c);
    is_player.push(false);
    points.push(0);
    wins.push(0);
    draws.push(0);
    losses.push(0);
    goals_for.push(0);
    goals_ag.push(0);
    order_i2place.push(i);
    order_place2i.push(i);
  }
  is_player[n-1] = true;

  return {
    'n' : n,
    'repeats' : 2,
    'matches' : 0,
    'clubs' : clubs,
    'is_player' : is_player,
    'points' : points, 
    'wins' : wins, 
    'draws' : draws, 
    'losses' : losses, 
    'goals_for' : goals_for, 
    'goals_ag' : goals_ag, 
    'order_i2place' : order_i2place,
    'order_place2i' : order_place2i,
  };
}

function league_update_order(le) {
  let arr = [];
  let n = le.n;
  for(let i = 0; i < n; i++) {
    arr.push([le.points[i], i]);
  }

  arr.sort(function(a,b){return b[0] - a[0];});

  for(let place = 0; place < n; place++) {
    let i = arr[place][1];
    le.order_i2place[i] = place;
    le.order_place2i[place] = i;
  }
}

function league_print(le) {
  console.log('--------------');
  let n = le.n;
  for(let place = 0; place < n; place++) {
    let i = le.order_place2i[place];
    console.log(place, le.clubs[i].name, le.wins[i], le.draws[i], le.losses[i], le.points[i]);
  }
}

// next opponent for the club index j
function league_opponent(le, j, match_day) { 
  let n = le.n;

  var i = match_day;    // match day 1, 2, ... , (n-1)
  if (match_day === undefined) {
    i = le.matches + 1; // opponent for the next match
  }
  i = (i - 1) % (le.n-1) + 1; // two rounds

  function modulo(x) {
    return (x - 1 + n - 1) % (n-1) + 1;
  }

  if (j === 0) {
    return i; 
  }
  else if (i === j) {
    return 0;
  }
  else {
    return modulo(2*i - j);
  }
}

function league_print_schedule(le) {
  for (let md = 1; md <= le.repeats*(le.n-1); md++) {
    console.log(`Round ${md}`);
    for (let j = 0; j < le.n; j++) {
      let op = league_opponent(le, j, md);
      if (j < op) {
        console.log(le.clubs[j].name, le.clubs[op].name)
      }
    }
  }
}

function league_simulate_round(le) {
  if (le.matches >= le.repeats * (le.n-1)) {
    return;
  }
  
  let md = le.matches + 1; // match day 1, 2, ... , (n-1)

  for (let j = 0; j < le.n; j++) {
    let jop = league_opponent(le, j, md);
    if (j < jop) {
      let t1 = le.clubs[j].team;
      let t2 = le.clubs[jop].team;
      let res = Sim.simulate_median_match([t1, t2]);

      let g1 = res[0];
      let g2 = res[1];

      if (g1 > g2) {
        le.points[j] += 3;
        le.wins[j] += 1;
        le.losses[jop] += 1;
      }
      else if (g2 > g1) {
        le.points[jop] += 3;
        le.wins[jop] += 1;
        le.losses[j] += 1;
      }
      else {
        le.points[j] += 1;
        le.points[jop] += 1;
        le.draws[j] += 1;
        le.draws[jop] += 1;
      }
      
      le.goals_for[j] += g1;
      le.goals_for[jop] += g2;
      
      le.goals_ag[j] += g2;
      le.goals_ag[jop] += g1;
    }
  }
  le.matches += 1;

  league_update_order(le);
}

function league_simulate_season(le) {
  for (let md = 1; md <= le.repeats*(le.n-1); md++) {
    league_simulate_round(le);
  }
  // league_print(le);
}

function league_payment_per_point(lvl) {
  // return (1 + lvl)*10000 * 0.25;
  return 4000 + 1500*lvl + 500*lvl*lvl;
}

function league_name(league_lvl) {
  let mx = global_max_division; // 0 ... 9
  let code = 'A'.charCodeAt(0);
  let ch = String.fromCharCode(code + (mx-league_lvl));
  if (league_lvl > mx) {
    return `Division A<sup>${league_lvl + 1 - mx}</sup>`
  }
  return `Division ${ch}`;
  //return `Sunday League <span class='w3-badge w3-white'>🍺</span>`;
}

let League = {
  make : league_make,
  print : league_print,
  print_schedule : league_print_schedule,
  opponent : league_opponent,
  simulate_round : league_simulate_round,
  simulate_season : league_simulate_season,
  payment_per_point : league_payment_per_point,
  name : league_name,
};
