
'use strict';

/* uses base.js, player.js, team.js */

/* Player's team */
var state = {
  team : undefined,
  money : 1500000,
};

function show_report(team) {
  let team2 = Team.mean_team(team);
  show_predictions(team, team2);
  show_simulation(team, team2);
}

function init() {
  state.team = Team.make_good(0);
  make_pitch('stad1', 'some1', state.team);

  init_buy_transfers(state);

  show_transfers(state);

  show_report(state.team);
}

function show_predictions(team1, team2) {
  var div = document.getElementById("prediction");
  div.innerHTML='';

  var e1 = Team.expected(team1);
  var e2 = Team.expected(team2);

  add_prediction(div, e2, e1, -1);
  add_prediction(div, e1, e2, 1);
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

function estimate_lineup_expected(e, eop){
  function or_zero(x) {
    if (isNaN(x)) 
      return 0;
    else
      return x;
  }

  // CB
  var x_cb = e.get(Loc.CB).win;
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

  var x_lm = cb_to_lm * or_zero((e.get(Loc.CB).pas + e.get(Loc.LM).win) / (e.get(Loc.CB).pas + e.get(Loc.LM).win + eop.get(Loc.RM).win));
  var loss_lm = cb_to_lm - x_lm;
  
  var x_cm = cb_to_cm * or_zero((e.get(Loc.CB).pas + e.get(Loc.CM).win) / (e.get(Loc.CB).pas + e.get(Loc.CM).win + eop.get(Loc.CM).win));
  var loss_cm = cb_to_cm - x_cm;
  
  var x_rm = cb_to_rm * or_zero((e.get(Loc.CB).pas + e.get(Loc.RM).win) / (e.get(Loc.CB).pas + e.get(Loc.RM).win + eop.get(Loc.LM).win));
  var loss_rm = cb_to_rm - x_rm;

  x_lm += e.get(Loc.LM).win;
  x_cm += e.get(Loc.CM).win;
  x_rm += e.get(Loc.RM).win;

  // CF
  var lm_to_cf = x_lm;
  var cm_to_cf = x_cm;
  var rm_to_cf = x_rm;
  var got_from_lm = lm_to_cf * or_zero((e.get(Loc.LM).pas + e.get(Loc.CF).win) / (e.get(Loc.LM).pas + e.get(Loc.CF).win + eop.get(Loc.CB).win));
  var got_from_cm = cm_to_cf * or_zero((e.get(Loc.CM).pas + e.get(Loc.CF).win) / (e.get(Loc.CM).pas + e.get(Loc.CF).win + eop.get(Loc.CB).win));
  var got_from_rm = rm_to_cf * or_zero((e.get(Loc.RM).pas + e.get(Loc.CF).win) / (e.get(Loc.RM).pas + e.get(Loc.CF).win + eop.get(Loc.CB).win));

  var before_block_cf = got_from_lm + got_from_cm + got_from_rm;
  var loss_cf = (lm_to_cf + cm_to_cf + rm_to_cf) - before_block_cf;

  // Shoot - Block
  var x_cf = before_block_cf * or_zero((e.get(Loc.CF).atk) / (e.get(Loc.CF).atk + eop.get(Loc.CB).def));
  var block_cf = before_block_cf - x_cf;

  // Shoot - Goalkeeper
  var x_goal = x_cf * or_zero((e.get(Loc.CF).atk) / (e.get(Loc.CF).atk + eop.get(Loc.GK).def));
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

function add_prediction(div, e1, e2, reverse) {
  var pic = Raphael(div, "15em", "25em");
  pic.setViewBox(-30, -50, 60, 100);

  function print(e) {
    for(let [loc, pl] of e) {
      console.log(loc, pl);
    }
  }

  let loc_goal = -1;
  let loc_after_goal = -2

  var coords = new Map([
    [Loc.GK, [0,  35 * reverse]], 
    [Loc.CB, [0,  20 * reverse]],
    [Loc.LM, [-20, 0 * reverse]],
    [Loc.CM, [0,   0 * reverse]],
    [Loc.RM, [20,  0 * reverse]],
    [Loc.CF, [0, -20 * reverse]],
    [loc_goal, [0, -35 * reverse]],
    [loc_after_goal, [0, -50 * reverse]]
  ]);

  function arrow(loc1, loc2, mag) {
    let xy1 = coords.get(loc1);
    let xy2 = coords.get(loc2);
    if (mag >= 0) {
      let color = "#F60";
      pic.path("M" + xy1[0] + "," + xy1[1] + "L" + xy2[0] + "," + xy2[1]).attr({stroke: color, "stroke-width": mag*0.1, "arrow-end": "classic"});

      let x = 0.5 * (xy1[0] + xy2[0]);
      let y = 0.5 * (xy1[1] + xy2[1]);
      let txt = Math.round(mag);
      pic.text(x, y, txt).attr({ "font-size": 5, "font-family": "'Mali', cursive", stroke: "#FFF", "stroke-width": 1.5 });
      pic.text(x, y, txt).attr({ "font-size": 5, "font-family": "'Mali', cursive", fill: color });
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
  function draw(e, eop) {
    let z = estimate_lineup_expected(e, eop);    

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
      pic.circle(x, y, 2).attr({stroke: "#DDD", "stroke-width": 0.5, fill: "#E50"});
    }
    
  }
  
  draw(e1, e2);
}

function dragstart_handler(ev) {
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text", ev.target.id);
  ev.dataTransfer.dropEffect = "move";
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
    console.log(player_id, loc_to, loc_from);

    if (target !== null && Team.allow_move(team, player_id, loc_from, loc_to)) {
      Team.move_player(team, player_id, loc_from, loc_to);
      // Get the id of the target and add the moved element to the target's DOM
      target.appendChild(document.getElementById(data));
      
      show_report(team);
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
      d.innerHTML = '<div class="loc">Bench</div> <br />';
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
  var pic = Raphael(div_id, "100%", "100%");
  pic.setViewBox(-10,-10,20,20);
 
  // base
  var circ4 = pic.circle(0, 0, 8).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});
  var circ2 = pic.circle(0, 0, 4).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});
  var circ3 = pic.circle(0, 0, 6).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});
  var circ1 = pic.circle(0, 0, 2).attr({stroke: "#555", "stroke-width": 0.2, "stroke-opacity": 0.5, fill: "#8C8", "fill-opacity":0.35});

  // radar diagram
  var cr = 55 + pl.atk * 200 / 9;
  var cg = 100 + (6 + (pl.pas-pl.win)) * 155 / 12;
  var cb = 55 + pl.def * 200 / 9;
  var color1 = Raphael.rgb(cr, cg, cb);
  var hsb = Raphael.rgb2hsb(color1);
  var color2 = Raphael.hsb(hsb.h, Math.min(1, hsb.s * 2.0), hsb.b);
  var color2 = Raphael.hsb(hsb.h, Math.min(1, hsb.s * 3.0), hsb.b*0.4);

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
  var txt = Math.round(Player.total(pl)).toString();
  var letters1 = pic.text(0, 0, txt).attr({ "font-size": 6.5, "font-family": "'Mali', cursive", stroke: color1, "stroke-width": 1.5 });
  var letters2 = pic.text(0, 0, txt).attr({ "font-size": 6.5, "font-family": "'Mali', cursive", fill: "#000" });
}

function show_team_on_pitch(uname, team) {

  for (var [id, pl] of team.players) {

    var name = id.toString();

    var div_id = 'p-' + name;

    var div = document.createElement("div");
    div.setAttribute('id', div_id);
    div.setAttribute('class', 'player');
    div.setAttribute('draggable', 'true');
    div.ondragstart = dragstart_handler;

    var spot_name = `${uname}-${s_of_loc(team.player_loc.get(id))}`;
    console.log(name);
    var pl_spot_div = document.getElementById(spot_name);
    pl_spot_div.appendChild(div);

    add_player_svg(div_id, pl);
  }
}
