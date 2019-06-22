
'use strict';

/* 0 ... (max-1) */
function random_int(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

/* Locations */
const Loc = {
  Bench: 0,
  GK: 1,
  CB: 2,
  LB: 3, DM: 4, RB: 5,
  LM: 6, CML: 7, CM: 8, CMR: 9, RM: 10,
  LW: 11, AM: 12, RW: 13,
  CF: 14
};

function loc_of_str(s) {
  return Loc[s];
}

function loc_is_bench(loc) {
  return (loc === Loc.Bench);
}

function loc_is_pitch(loc) {
  return (loc !== undefined && loc !== Loc.Bench);
}

function loc_to_spot(loc) {
  switch(loc) {
    case Loc.Bench: return [];
    case Loc.GK: return [];
    case Loc.LB: return [Loc.CB, Loc.LM];
    case Loc.DM: return [Loc.CB, Loc.CM];
    case Loc.RB: return [Loc.CB, Loc.RM];
    case Loc.CML: return [Loc.CM, Loc.LM];
    case Loc.CMR: return [Loc.CM, Loc.RM];
    case Loc.LW: return [Loc.CF, Loc.LM];
    case Loc.AM: return [Loc.CF, Loc.CM];
    case Loc.RW: return [Loc.CF, Loc.RM];
    default: return [loc, loc]
  }
}
