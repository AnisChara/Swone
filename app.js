const sone = require('./sone.js');
const afficher = require('./req_afficher_tl.js');

sone.addRequete(afficher, '/');

sone.run(5000, sone)