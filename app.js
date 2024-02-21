const sone = require('./index.js');
const r = require('./r.js');
const url = require('url');
const http = require("http");
const afficher = require('./req_afficher_tl.js');

sone.addRequete(afficher, '/');

sone.run(5000, sone)