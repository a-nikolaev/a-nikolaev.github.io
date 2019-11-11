
'use strict';

/* uses base.js, player.js, team.js */

/* Player's team */
var state = {
  team : undefined,
  money : 1000000,
  opponents : [],
  league_size : 8,
  league_lvl : 0,
  is_ready : false,
  season : 0,
};

var all_workers = [];
for (let i = 0; i < state.league_size-1; i++) {
  if (window.Worker) {
    let w = new Worker('./worker.js');

    w.onmessage = function(e) {
      let c = e.data;
      if (state.opponents.length < state.league_size-1) {
        state.opponents.push(c);
      }
      if (state.opponents.length === state.league_size-1) {
        state.ready = true;
        let wait_icons = document.querySelectorAll('.wait-icon');
        for (let el of wait_icons) {
          el.innerHTML = '';
        }
        let wait_sensitives = document.querySelectorAll('.wait-sensitive');
        for (let el of wait_sensitives) {
          el.className = el.className.replace(" w3-disabled", "");
        }

        // can show prediction now
        show_report(state);
      }
    }
    all_workers.push(w);
  }
}

function show_report(state) {
  show_predictions(state);
  // show_simulation(state.team, team2);
  // show_sim_many(state.team, team2);
}

function show_league_simple(){
  // test league
  let t0 = Team.make_good();
  let c1 = Club.make('100', Team.good_formation(t0, 100));
  let c2 = Club.make('1000', Team.good_formation(t0, 1000));
  let c3 = Club.make('10000', Team.good_formation(t0, 10000));

  let qt0 = Team.quick_formation(t0);
  let c4 = Club.make('Q-100', Team.good_formation(qt0, 100));
  let c5 = Club.make('Q-1000', Team.good_formation(qt0, 1000));
  let c6 = Club.make('Q-10000', Team.good_formation(qt0, 10000));

  let clubs = [c1, c2, c3, c4, c5, c6];
  let n = clubs.length;

  for(var trial = 1; trial <= 5; trial++){ 
    console.log ("---- Season ", trial, " ----");

    let points = [];
    for(let i = 0; i < n; i++) {
      points.push(0);
    }

    for(let i = 0; i < n; i++) {
      for(let j = 0; j < n; j++) {
        if (i !== j) {
          let res = Sim.simulate_match([clubs[i].team, clubs[j].team]);
          let gi = res[0];
          let gj = res[1];
          
          if (gi > gj) {
            points[i] += 3;
          }
          else if (gi < gj) {
            points[j] += 3;
          }
          else {
            points[i] += 1;
            points[j] += 1;
          }
        }
      }
    }

    console.log(points);

    let arr = [];
    for(let i = 0; i < n; i++) {
      arr.push([points[i], clubs[i]]);
    }

    arr.sort(function(a,b){return b[0] - a[0];});

    for(let i = 0; i < n; i++) {
      console.log(i, arr[i][1].name, arr[i][0]);
    }
  }
}

function generate_opponents(state) {

  if (window.Worker) {
    // Disable
    state.is_ready = false;
    let wait_icons = document.querySelectorAll('.wait-icon');
    for (let el of wait_icons) {
      el.innerHTML = '<img style="height:1em;" src="./img/wait.svg" />';
    }
    let wait_sensitives = document.querySelectorAll('.wait-sensitive');
    for (let el of wait_sensitives) {
      el.className = el.className + " w3-disabled";
    }
  }

  // clear array
  state.opponents.splice(0, state.opponents.length);

  let num = state.league_size - 1;

  let names = Club.generate_names(state.league_lvl, num);

  for (var i=0; i<num; i++) {
    let lvl = state.league_lvl + 0.7 * (i/num) + 0.7 * Math.random();
    let name = names[i];
    if (window.Worker) {
      all_workers[i].postMessage([lvl, name]);
    }
    else {
      state.opponents.push(Club.generate_opponent(lvl, name));
    }
  }
}

function init() {

  simple_notify('deep-green', `<img src="./img/logo.png">`);

  state.team = Team.make_good(state.league_lvl);

  state.team = Team.good_formation(Team.quick_formation(state.team));
  //state.team = Team.quick_formation(state.team);

  make_pitch('main-stadium', 'maintgt', state.team);

  init_buy_transfers(state);

  show_transfers(state);

  // add opponents
  generate_opponents(state);

  document.onkeyup = function(e) {
    switch (e.which) {
      case 49: 
        open_tab(event, 'tab-team');
        break;
      case 50:
        open_tab(event, 'tab-transfers');
        break;
      case 51:
        open_tab(event, 'tab-help');
        break;
    }
  }
}

function simple_notify(w3color, text) {
  var d = document.getElementById("notice-text");
  d.innerHTML = `<div class='w3-card w3-padding w3-panel ${w3color} w3-text-white'>${text}</div>`;
  document.getElementById('notice').style.display='block';
}

function show_predictions(state) {
  var div = document.getElementById("prediction");
  div.innerHTML='';

  function average_estimates(arr) {
    let n = arr.length;
    var avg = {};
    if (n > 0) {
      for(let key in arr[0]){
        avg[key] = 0;
      }
      for (let obj of arr) {
        for(let key in obj){
          avg[key] += obj[key] / n;
        }
      }
    }
    return avg;
  }
  
  /*
  let team1 = state.team
  let team2 = state.opponents[0].team

  var e1 = Team.expected(team1);
  var e2 = Team.expected(team2);
  
  let z12 = Team.estimate_lineup_expected(e1, e2);    
  let z21 = Team.estimate_lineup_expected(e2, e1);    

  add_prediction(div, z21, -1);
  add_prediction(div, z12, 1);
  */

  let team1 = state.team;
  let e1 = Team.expected(team1);
  
  let ops2 = state.opponents.map( op => {
      let e2 = Team.expected(op.team);
      return Team.estimate_lineup_expected(e2, e1);
    });
  let z2 = average_estimates(ops2)
  add_prediction(div, z2, -1);
  
  let ops1 = state.opponents.map( op => {
      let e2 = Team.expected(op.team);
      return Team.estimate_lineup_expected(e1, e2);
    });
  let z1 = average_estimates(ops1)
  add_prediction(div, z1, 1);
}

function show_simulation(team1, team2) {  
  var log_div = document.getElementById("log");

  let res = Sim.simulate_match([team1, team2]);
  let g0 = res[0];
  let g1 = res[1];
  let events = res[2];
  
  let score = `${g0}-${g1}`;
  log_div.innerHTML = '';
  {
    let p = document.createElement('p');
    p.innerHTML = score;
    log_div.appendChild(p);

    for (let ev of events){
      let ini = ev[0];
      let msg = ev[1];
      let p = document.createElement('p');
      if (ini === 0) {
        p.setAttribute('style', 'text-align: left');
      }
      else {
        p.setAttribute('style', 'text-align: right; color: #AAA;');
      }
      p.innerHTML = msg;
      log_div.appendChild(p);
    }
  }
}

function show_sim_many(team1, team2) {  
  var log_div = document.getElementById("log");
  log_div.innerHTML = '';
  
  make_child(log_div, 'div', {'class':'w3-panel'}, function(d) {
    d.innerHTML = 'Simulated friendly matches:';
  });

  var d1, d2, d3;
  make_child(log_div, 'div', {'class':'w3-cell-row w3-panel'}, function(d) {
    make_child(d, 'div', {'class':'w3-cell w3-cell-top'}, function(d) {
      d.innerHTML = '<div class=""><b>won</b></div>';
      d1 = d;
    });
    make_child(d, 'div', {'class':'w3-cell w3-cell-top'}, function(d) {
      d.innerHTML = '<div class=""><b>drawn</b></div>';
      d2 = d;
    });
    make_child(d, 'div', {'class':'w3-cell w3-cell-top'}, function(d) {
      d.innerHTML = '<div class=""><b>lost<b></div>';
      d3 = d;
    });
  });

  for (var i = 0; i < 12; i++) { 
    let res = Sim.simulate_median_match([team1, team2]);
    let g0 = res[0];
    let g1 = res[1];

    var dcell = d2;
    let score = `${g0}-${g1}`;
    if (g0 > g1) {
      dcell = d1;
    }
    else if (g0 < g1) {
      dcell = d3;
    }

    make_child(dcell, 'div', {}, function(d){
      d.innerHTML = score;
    })
  }
}

function show_league_in_log(le, league_lvl, season) {

  var log_div = document.getElementById("log");
  log_div.innerHTML = '';
  
  make_child(log_div, 'h5', {'class':'w3-container', 'style':'background-color:#cfa;'}, function(d) {
    d.innerHTML = League.name(league_lvl) + ` <sub>(Season ${season})</sub>`;
  });

  make_child(log_div, 'table', {'class':'w3-table-all'}, function(d) {
    make_child(d, 'tr', {'class':''}, function(d) {
      make_child(d, 'th', {'class':''}, function(d){
        d.innerHTML= '#';
      });
      make_child(d, 'th', {'class':''}, function(d){
        d.innerHTML= 'Team';
      });
      make_child(d, 'th', {'class':''}, function(d){
        d.innerHTML= 'Pts';
      });
    });

    for(let place = 0; place < le.n; place++) {
      let i = le.order_place2i[place];
      let name = le.clubs[i].name;
      let pts = le.points[i];

      make_child(d, 'tr', {'class':''}, function(d) {
        make_child(d, 'td', {'class':''}, function(d){
          d.innerHTML= `${place + 1}`;
        });
        make_child(d, 'td', {'class':''}, function(d){
          if (le.is_player[i]) {
            d.innerHTML= `<i class='w3-tag w3-teal'>${name}</i>`;
          }
          else {
            d.innerHTML= `${name}`;
          }
        });
        make_child(d, 'td', {'class':''}, function(d){
          d.innerHTML= `${pts}`;
        });
      });

    }
  });
}

function show_sim_league(state) {
  let clubs_arr = state.opponents.slice(0);
  clubs_arr.push(Club.make('You', state.team));
  let le = League.make(clubs_arr.length, clubs_arr);

  League.simulate_season(le);
  show_league_in_log(le, state.league_lvl, state.season);
  return le;
}

function play_season(state) {

  if (state.money < Team.all_wages(state.team)) {
    simple_notify('w3-deep-orange',  `<h5>Not enough funds to pay wages! (Can you sell something?)</h5>`);
    return;
  }

  state.season += 1;

  let le = show_sim_league(state);
  var pts = 0;
  var i_me = 0;
  var place = 0;
  for (let i = 0; i < le.n; i++) {
    if (le.is_player[i] === true) {
      i_me = i;
      place = le.order_i2place[i];
      pts = le.points[i];
    }
  }

  let money_received = pts * League.payment_per_point(state.league_lvl); 
  let money_paid = Team.all_wages(state.team); 
  state.money = rounding(state.money + money_received - money_paid);
  
  // add to the log
  var log_div = document.getElementById("log");
  make_child(log_div, 'table', {'class':'w3-table-all w3-panel'}, function(d) {
    make_child(d, 'tr', {'class':''}, function(d) {
      d.innerHTML = `<td>TV and sponsor money:</td><td>${s_of_money_approx(money_received)}</td>`;
    });
    make_child(d, 'tr', {'class':''}, function(d) {
      d.innerHTML = `<td>Paid wages:</td><td>${s_of_money_approx(money_paid)}</td>`;
    });
  });
  

  var promoting = (place === 0);
  var relegating = (place === le.n-1);

  if (promoting) {
    state.league_lvl += 1;
    simple_notify('w3-light-green', `<h5>&#129093; Promoted to ${League.name(state.league_lvl)}</h5>`);
    generate_opponents(state);
  }
  else if (relegating && state.league_lvl > 0) {
    state.league_lvl -= 1;
    simple_notify('w3-deep-orange',  `<h5>&#129095; Relegated to ${League.name(state.league_lvl)}</h5>`);
    generate_opponents(state);
  }

  init_buy_transfers(state);
  show_transfers(state);

}

function open_tab(ev, tab_id) {
  var i;
  var x = document.getElementsByClassName("tab");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  document.getElementById(tab_id).style.display = "block";

  var tablinks = document.getElementsByClassName("tab-button");
  for (i = 0; i < x.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" selected", "");
  }
  ev.currentTarget.className += " selected";
}

function add_prediction(div, z, reverse) {
  var pic = Raphael(div, "9em", "15em");
  pic.setViewBox(-30, -50, 60, 100);

  let loc_goal = -1;
  let loc_after_goal = -2

  var coords = new Map([
    [Loc.GK, [0,          35 * reverse]], 
    [Loc.CB, [0,          20 * reverse]],
    [Loc.LM, [-20*reverse, 0 * reverse]],
    [Loc.CM, [0,           0 * reverse]],
    [Loc.RM, [20*reverse,  0 * reverse]],
    [Loc.CF, [0,         -20 * reverse]],
    [loc_goal, [0, -35 * reverse]],
    [loc_after_goal, [0, -50 * reverse]]
  ]);

  function arrow(loc1, loc2, mag) {
    let xy1 = coords.get(loc1);
    let xy2 = coords.get(loc2);
    if (mag >= 0) {
      let color = "#260";
      pic.path("M" + xy1[0] + "," + xy1[1] + "L" + xy2[0] + "," + xy2[1]).attr({stroke: color, "stroke-width": mag*0.1, "arrow-end": "classic"});

      let x = 0.5 * (xy1[0] + xy2[0]);
      let y = 0.5 * (xy1[1] + xy2[1]);
      let txt = Math.round(mag);
      pic.text(x, y, txt).attr({ "font-size": 7, "font-family": "'Quicksand', cursive", "font-weight":'700', stroke: "#FFF", "stroke-width": 2 });
      pic.text(x, y, txt).attr({ "font-size": 7, "font-family": "'Quicksand', cursive", "font-weight":'700', fill: color });
    }
  }
  
  function arrow_loss(loc, mag) {
    let xy = coords.get(loc);
    if (mag >= 0) {
      pic.path("M" + xy[0] + "," + xy[1] + "L" + (xy[0]-mag*0.6) + "," + xy[1]).attr({stroke: "#999", "stroke-width": mag*0.1, "arrow-end": "classic"});
    }
  }
  
  function arrow_block(loc, mag) {
    let xy = coords.get(loc);
    if (mag >= 0) {
      pic.path("M" + xy[0] + "," + xy[1] + "L" + (xy[0]+mag*0.6) + "," + xy[1]).attr({stroke: "#0AF", "stroke-width": mag*0.1, "arrow-end": "classic"});
    }
  }

  // draw expected team
  function draw() {

    arrow(Loc.CB, Loc.LM, z.cb_to_lm);
    arrow(Loc.CB, Loc.CM, z.cb_to_cm);
    arrow(Loc.CB, Loc.RM, z.cb_to_rm);

    arrow_loss(Loc.LM, z.loss_lm);
    arrow_loss(Loc.CM, z.loss_cm);
    arrow_loss(Loc.RM, z.loss_rm);
    
    arrow(Loc.LM, Loc.CF, z.lm_to_cf);
    arrow(Loc.CM, Loc.CF, z.cm_to_cf);
    arrow(Loc.RM, Loc.CF, z.rm_to_cf);
    
    arrow_loss(Loc.CF, z.loss_cf);
    arrow_block(Loc.CF, z.block_cf);
    
    arrow(Loc.CF, loc_goal, z.x_cf);
    
    arrow_block(loc_goal, z.block_goal);
    
    arrow(loc_goal, loc_after_goal, z.x_goal);
    
    for (let loc of [Loc.GK, Loc.CB, Loc.LM, Loc.CM, Loc.RM, Loc.CF, loc_goal]) {
      let xy = coords.get(loc);
      let x = xy[0];
      let y = xy[1];
      pic.circle(x, y, 1.5).attr({stroke: "#fff", "stroke-width": 0.5, fill: "#481"});
    }
    
  }
  
  draw();
}

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.dropEffect = "move";
  
  ev.target.className = ev.target.className.replace(" tooltip", "");
  ev.target.style.opacity = 0.4;
  /*
  ev.target.style.border = '1px solid';
  ev.target.style['border-radius'] = '2em';
  ev.target.style.width = '3.5em';
  ev.target.style.height = '3.5em';
  */
}

function dragend_handler(ev) {
  ev.target.className += " tooltip";
  ev.target.style.opacity = 1;
  /*
  ev.target.style.border = 'none';
  */
}

function dragover_handler(ev) {
  ev.preventDefault();
  // Set the dropEffect to move
  ev.dataTransfer.dropEffect = "move"
}

function gen_drop_handler(uname, team) {
  function drop_handler(ev) {
    ev.preventDefault();

    var target = ev.target;
    while (target != null && target.id.split('-')[0] != uname) {
      target = target.parentElement;
    }

    var data = ev.dataTransfer.getData("text"); // p-playerID
    var player_id = parseInt(data.substring(2, data.length));
    var loc_to = loc_of_str(target.id.split('-')[1]);

    var loc_from = team.player_loc.get(player_id);
    // console.log(player_id, loc_to, loc_from);

    if (target !== null && Team.allow_move(team, player_id, loc_from, loc_to)) {
      Team.move_player(team, player_id, loc_from, loc_to);
      // Get the id of the target and add the moved element to the target's DOM
      target.appendChild(document.getElementById(data));
      
      show_report(state);
      show_transfers(state);
    }
  }
  return drop_handler;
}

function make_pitch(div_id, uname, team) {
  var top_div = document.getElementById(div_id);
  top_div.innerHTML = '';
  
  function make_gap(parent, width){ 
    make_child(parent, 'div', {'class':`col-${width}`}, function(d){});
  }

  let drop_handler = gen_drop_handler(uname, team);

  function make_spot(parent, width, position, is_spot){
    make_child(parent, 'div', {'class':`col-${width} tgt ${is_spot===true ? 'spot' : ''}`, 'id':`${uname}-${position}`}, function(d){
      d.ondrop=drop_handler;
      d.ondragover=dragover_handler;
      d.innerHTML=`<div class="loc">${position}</div>`;
    });
  }

  make_child(top_div, 'div', {'class':'stadium'}, function(d) {
    // Bench
    make_child(d, 'div', {'class':'col-6 tgt bench', 'id':`${uname}-Bench`, 'ondrop':drop_handler, 'ondragover':dragover_handler}, function(d){
      d.ondrop=drop_handler;
      d.ondragover=dragover_handler;
      d.innerHTML = '<div class="loc">Bench</div>';
    });
    // Gap
    make_child(d, 'div', {'class':'col-6'}, function(d){});
    // Field
    make_child(d, 'div', {'class':'field'}, function(d){
      // 1st row
      make_child(d, 'div', {'class':'row'}, function(d){
        make_gap(d, 2);
        make_spot(d, 2, 'CF', true)
        make_gap(d, 2);
      });
      // 2nd row
      make_child(d, 'div', {'class':'row'}, function(d){
        make_gap(d, 1);
        make_spot(d, 1, 'LW');
        make_spot(d, 2, 'AM');
        make_spot(d, 1, 'RW');
        make_gap(d, 1);
      });
      // 3rd row
      make_child(d, 'div', {'class':'row'}, function(d){
        make_spot(d, 1, 'LM', true);
        make_spot(d, 1, 'CML');
        make_spot(d, 2, 'CM', true);
        make_spot(d, 1, 'CMR');
        make_spot(d, 1, 'RM', true);
      });
      // 4th row
      make_child(d, 'div', {'class':'row'}, function(d){
        make_gap(d, 1);
        make_spot(d, 1, 'LB');
        make_spot(d, 2, 'DM');
        make_spot(d, 1, 'RB');
        make_gap(d, 1);
      });
      // 5th row
      make_child(d, 'div', {'class':'row'}, function(d){
        make_gap(d, 2);
        make_spot(d, 2, 'CB', true)
        make_gap(d, 2);
      });
      // 6th row
      make_child(d, 'div', {'class':'row'}, function(d){
        make_gap(d, 2);
        make_gap(d, 'half');
        make_spot(d, 1, 'GK')
        make_gap(d, 3);
      });
    });
  });
  
  show_team_on_pitch(uname, team);
}

function add_player_svg(div_id, pl) {
  let parent_div = document.getElementById(div_id);
  make_child(parent_div, 'span', {'class':'tooltiptext'}, function(d){
    function row(a,b,c) {
      return `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`
    }
    d.innerHTML = `<table>${row('',pl.atk,'')} ${row(pl.win,'',pl.pas)} ${row('',pl.def,'')}</table>`;
  });

  var pic = Raphael(div_id, "100%", "100%");
  pic.setViewBox(-10,-10,20,20);
 
  // base
  var circ4 = pic.circle(0, 0, 8).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});
  var circ2 = pic.circle(0, 0, 4).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});
  var circ3 = pic.circle(0, 0, 6).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});
  var circ1 = pic.circle(0, 0, 2).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});

  // radar diagram
  let mx = (Math.max(pl.atk, pl.def, pl.win, pl.pas) + 9) * 0.5;
  var cr = 55 + 200 * (pl.atk-2) / (mx-1);
  var cg = 127 + 127 * ((pl.pas-pl.win)) / (mx-1);
  var cb = 55 + 200 * (pl.def-2) / (mx-1);
  var color1 = Raphael.rgb(cr, cg, cb);
  var hsb = Raphael.rgb2hsb(color1);
  var color2 = Raphael.hsb(hsb.h, Math.min(1, hsb.s * 3.0), hsb.b);
  var color2 = Raphael.hsb(hsb.h, Math.min(1, hsb.s * 5.0), hsb.b*0.4);

  var sc = 1;
  var sm = 0.0;

  var x0 = 0; 
  var y0 = (sm + pl.def * sc);
  var xy0 = x0 + "," + y0;

  var x1 = -(sm + pl.win * sc); 
  var y1 = 0;
  var xy1 = x1 + "," + y1;

  var x2 = 0; 
  var y2 = -(sm + pl.atk * sc);
  var xy2 = x2 + "," + y2;
  
  var x3 = (sm + pl.pas * sc); 
  var y3 = 0;
  var xy3 = x3 + "," + y3;

  var poly = pic.path("M" + xy0 + "L" + xy1 + "L" + xy2 + "L" + xy3 + "Z");
  poly.attr({stroke: color2, "stroke-width": 0.5, fill: color1 });
  
  // text
  /*
  var txt = Math.round(Player.total(pl)).toString();
  var letters1 = pic.text(0, 0, txt).attr({ "font-size": 6.5, "font-family": "'Mali', cursive", stroke: color1, "stroke-width": 1.5, 
      'text-anchor': 'middle'});
  var letters2 = pic.text(0, 0, txt).attr({ "font-size": 6.5, "font-family": "'Mali', cursive", fill: "#000", 
      'text-anchor': 'middle'});
      */
}

function show_team_on_pitch(uname, team) {

  for (var [id, pl] of team.players) {

    var name = id.toString();

    var div_id = 'p-' + name;

    var div = document.createElement("div");
    div.setAttribute('id', div_id);
    div.setAttribute('class', 'player tooltip');
    div.setAttribute('draggable', 'true');
    div.ondragstart = dragstart_handler;
    div.ondragend = dragend_handler;

    var spot_name = `${uname}-${s_of_loc(team.player_loc.get(id))}`;
    console.log(name);
    var pl_spot_div = document.getElementById(spot_name);
    pl_spot_div.appendChild(div);

    add_player_svg(div_id, pl);
  }
}

