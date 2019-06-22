
'use strict';

/* Player */
function player_zero(id=-1) {
  return {def : 0, win : 0, atk : 0, pas : 0, id : id};
}

function player_make(id=-1) {
  var pre_atk = random_int(6)
  var atk = 3 + pre_atk + random_int(2);
  var def = 3 + (5 - pre_atk) + random_int(2);
  var win = 3 + random_int(7); 
  var pas = 3 + random_int(7); 
 
  return {def : def, win : win, atk : atk, pas : pas, id : id};
}

function player_total(pl) {
  return pl.atk + pl.pas + pl.win + pl.def;
}

function player_sum(p1, p2) {
  return {
    atk : (p1.atk + p2.atk),
    pas : (p1.pas + p2.pas),
    win : (p1.win + p2.win),
    def : (p1.def + p2.def),
    id : p1.id
  }
}

function player_mult(p1, x) {
  return {
    atk : (p1.atk * x),
    pas : (p1.pas * x),
    win : (p1.win * x),
    def : (p1.def * x),
    id : p1.id
  }
}
    
