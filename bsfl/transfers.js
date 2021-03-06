
'use strict';

// uses base.js, player.js, and team.js

var transfers_buy = new Map();

function init_buy_transfers(state){
  transfers_buy.clear();

  for(var i = 0; i < 20; i++) {
    let pl = Player.make(state.league_lvl);
    Player.assign_unique_id(pl);

    let id = parseInt(pl.id)
    transfers_buy.set(id, pl);
  }
}

function refresh(state){
  make_pitch('main-stadium', 'maintgt', state.team);
  show_report(state);
  show_transfers(state);
}

function do_sell(state, id, price) {
  Team.remove_player_by_id(state.team, id);
  state.money += price;
  refresh(state);
}

function do_buy(state, pl, price) {
  if (state.money >= price) {
    Team.add_player(state.team, pl, Loc.Bench);
    state.money -= price;

    let id = parseInt(pl.id)
    transfers_buy.delete(id);

    refresh(state);
    
    return true;
  }
  else {
    return false;
  }
}

function add_player_entry(parent, pl, loc, gen_button){
  let id = parseInt(pl.id)
  
  make_child(parent, 'div', {'class':'w3-cell-row w3-border-bottom'}, function(d){

    make_child(d, 'div', {'class':'w3-cell w3-cell-middle'}, function(d){
      let face_tag_id = `face-sell-${id}`; 
      make_child(d, 'div', {'id':face_tag_id, 'class':'player'}, function(d){
        Face.add(face_tag_id, pl.face); 
      });
      let tag_id = `sell-${id}`; 
      make_child(d, 'div', {'id':tag_id, 'class':'player tooltip'}, function(d){
        add_player_svg(tag_id, pl); 
      });
    });
    
    make_child(d, 'div', {'class':'w3-cell w3-cell-middle'}, function(d){
      make_child(d, 'div', {}, function() {
        make_child(d, 'span', {'class':''}, function(d){
          var loc_text = '';
          if (loc !== undefined) {
            var tag_color = 'w3-brown';
            if (loc === Loc.Bench) {
              tag_color = 'w3-grey';
            }
            loc_text = `<sup><b><span class='${tag_color} w3-text-white' style='padding: 0.05em 0.3em 0.05em 0.3em;'>${s_of_loc(loc)}</span></b></sup>`;
          }
          d.innerHTML = `${pl.firstname} ${pl.lastname} ${loc_text}`;
        });

        make_child(d, 'br', {}, function(d){});
      
        make_child(d, 'span', {'class':''}, function(d){
          d.innerHTML = `Wages: ${s_of_money_exact(pl.wage)}`;
        });

        make_child(d, 'span', {'class':'w3-margin-left'}, function(d){
          d.innerHTML = `Value: ${s_of_money_exact(pl.value)}`;
        });
      });
    });
    
    make_child(d, 'div', {'class':'w3-cell w3-cell-middle'}, function(d){

      gen_button(d);

    });

  });
}

function show_sells(top_div, state){ 
  let team = state.team;

  let sorted_players_arr = Array.from( team.players );
  sorted_players_arr.sort(function(e1, e2){ return Player.total(e2[1]) - Player.total(e1[1]); });

  make_child(top_div, 'div', {'class':'w3-container w3-half', 'style':'padding-bottom:2em;'}, function(d){
    for (let [id, pl] of sorted_players_arr) {
      let loc = team.player_loc.get(id);
      add_player_entry(d, pl, loc, function(d){
          make_child(d, 'button', {'class':'w3-btn w3-red w3-round'}, function(d){
            d.innerHTML = `Sell`;
            d.onclick = function(){
                do_sell(state, id, pl.value);
              };
          });
      });
    }
  });
}

function show_buys(top_div, state){ 
  let team = state.team;

  make_child(top_div, 'div', {'class':'w3-container w3-half', 'style':'padding-bottom:2em;'}, function(d){
    for (let [id, pl] of transfers_buy) {

      add_player_entry(d, pl, undefined, function(d){
          let price = parseInt(pl.price);

          make_child(d, 'span', {}, function(d){
            d.innerHTML = `Price: ${s_of_money_exact(price)}`;
          });
          make_child(d, 'button', {'class':'w3-btn w3-green w3-round'}, function(d){
            d.innerHTML = `Buy`;
            d.onclick = function(){
                do_buy(state, pl, price);
              };
          });
      });
    }
  });
}

function show_transfers(state) {
  var top_div = document.getElementById('transfers');
  top_div.innerHTML = '';
  make_child(top_div, 'div', {'class':'w3-margin-bottom'}, function(d){
    d.innerHTML = '';
    d.innerHTML += `<div class='w3-container'>Budget: ${s_of_money_exact(state.money)}</div>`;
    d.innerHTML += `<div class='w3-container'>Wages: ${s_of_money_exact(rounding(Team.all_wages(state.team)))}</div>`;
  });
  show_sells(top_div, state);
  show_buys(top_div, state);
}

