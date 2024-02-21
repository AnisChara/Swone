// Traitement de "req_commencer"

"use strict";


const trait = function (req, res, query) {

	res.writeHead(200, { 'Content-Type': 'text/html' });
	res.write("oui");
	res.end();
};

module.exports = trait;
