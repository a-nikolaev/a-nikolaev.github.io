
'use strict';

/* uses team.js */

function club_make(name, team) {
  return {'name' : name, 'team' : team};
}

function club_all_wages(c) {
  return Team.all_wages(c.team);
}

let Club = {
  make : club_make,
  all_wages : club_all_wages,
};
