"use strict";

const swone = require('./swone.js');


const trait = function (req, res, query) {

	let marqueurs;
	let page;
	marqueurs = {};
	marqueurs.erreur = "oui";
	// AFFICHAGE DE LA PAGE D'ACCUEIL

	swone.display('./TL.html', marqueurs, 200, res)
	
};

module.exports = trait;
