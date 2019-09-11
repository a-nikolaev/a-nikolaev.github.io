
importScripts('base.js', 'names.js', 'player.js', 'model.js', 'team.js', 'club.js');

onmessage = function(e) {
  let lvl = e.data;
  console.log(`Arg: ${lvl}`);
  postMessage(Club.generate_opponent(lvl));
}

onerror = function(e) {
  console.log(`Error in worker: ${e.filename} : ${e.lineno} : ${e.message}`)
}
