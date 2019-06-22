
'use strict';

/* uses base.js, player.js, team.js */

/* Player's team */
var team;

function init() {

  team = Team.make_good(0);

  // Make the HTML page
  var bench = document.getElementById("target-Bench");

  for (var [id, pl] of team.players) {

    var name = id.toString();

    var div_id = 'p-' + name;

    var div = document.createElement("div");
    div.setAttribute('id', div_id);
    div.setAttribute('class', 'player');
    div.setAttribute('draggable', 'true');
    div.setAttribute('ondragstart', 'dragstart_handler(event);');

    bench.appendChild(div);

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
    var txt = player_total(pl).toString();
    var letters1 = pic.text(0, 0, txt).attr({ "font-size": 6.5, "font-family": "'Mali', cursive", stroke: color1, "stroke-width": 1.5 });
    var letters2 = pic.text(0, 0, txt).attr({ "font-size": 6.5, "font-family": "'Mali', cursive", fill: "#000" });
  }

  draw_predictions();
}

function draw_predictions() {
  var div = document.getElementById("prediction");

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  var t2 = Team.mean_team(team);
  var e1 = Team.expected(team);
  var e2 = Team.expected(t2);

  add_prediction(div, e2, e1, -1);

  add_prediction(div, e1, e2, 1);
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
    
    function or_zero(x) {
      if (isNaN(x)) 
        return 0;
      else
        return x;
    }

    function weight(pl) {
      return pl.win/4 + pl.pas;
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

    arrow(Loc.CB, Loc.LM, cb_to_lm);
    arrow(Loc.CB, Loc.CM, cb_to_cm);
    arrow(Loc.CB, Loc.RM, cb_to_rm);

    arrow_loss(Loc.LM, loss_lm);
    arrow_loss(Loc.CM, loss_cm);
    arrow_loss(Loc.RM, loss_rm);
    
    arrow(Loc.LM, Loc.CF, lm_to_cf);
    arrow(Loc.CM, Loc.CF, cm_to_cf);
    arrow(Loc.RM, Loc.CF, rm_to_cf);
    
    arrow_loss(Loc.CF, loss_cf);
    arrow_block(Loc.CF, block_cf);
    
    arrow(Loc.CF, loc_goal, x_cf);
    
    arrow_block(loc_goal, block_goal);
    
    arrow(loc_goal, loc_after_goal, x_goal);
    
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

function drop_handler(ev) {
  ev.preventDefault();

  var target = ev.target;
  while (target != null && target.id.substring(0, 6) != "target") {
    target = target.parentElement;
  }

  var data = ev.dataTransfer.getData("text"); // p-playerID
  var player_id = parseInt(data.substring(2, data.length));
  var loc_to = loc_of_str(target.id.substring(7, target.id.length));

  var loc_from = team.player_loc.get(player_id);
  console.log(player_id, loc_to, loc_from);

  if (target !== null && Team.allow_move(team, player_id, loc_from, loc_to)) {
    Team.move_player(team, player_id, loc_from, loc_to);
    // Get the id of the target and add the moved element to the target's DOM
    target.appendChild(document.getElementById(data));
    draw_predictions()
  }
}
