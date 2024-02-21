"use strict";

const http = require("http");
const url = require("url");
const statique = require("./req_statique");

let sone = {};
sone.listRequete = [];
sone.listNameRequete = [];

sone.requete = function (req, res, query, pathname)
{
    //IDENTIFIE LA BONNE REQUETE 
    for (let i = 0; i < sone.listRequete.length; i++)
    {
        if (pathname === sone.listNameRequete[i])
        {
            try {
            sone.listRequete[i](req, res, query);
            } catch (e) {
                
            console.log('Erreur : ' + e.stack);
            console.log('Erreur : ' + e.message);
            // console.trace();
            const show_erreur = function (req, res, query) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.write('ERREUR SERVEUR');
                res.end();
            };
            show_erreur(req, res, query);            
            }return;
        }
    }

    //REQ_STATIQUE
    statique(req, res, query);
}
//ENREGISTRE LES REQUETES
sone.addRequete = function (requete, name_requete)
{
    sone.listRequete.push(requete);
    sone.listNameRequete.push(name_requete);
}

//EXECUTE LE SERVEUR
sone.run = function (port, sone)
{
    const serv = function (req, res)
    {
        let requete = url.parse(req.url, true);
        let pathname = requete.pathname;
        let query = requete.query;
        sone.requete(req, res, query, pathname);
    }

    http.createServer(serv).listen(port);
    console.log("Server running on port " + port);
} 


module.exports = sone;