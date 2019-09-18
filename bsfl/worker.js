
importScripts('base.js', 'names.js', 'clubnames.js', 'face.js', 'player.js', 'model.js', 'team.js', 'club.js');

onmessage = function(e) {
  let lvl = e.data[0];
  let name = e.data[1];
  console.log(`Arg: ${lvl}`);
  postMessage(Club.generate_opponent(lvl, name));
}

onerror = function(e) {
  console.log(`Error in worker: ${e.filename} : ${e.lineno} : ${e.message}`)
}
