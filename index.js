"use strict";

const http = require("http");
const url = require("url");

let sone = {};
sone.listRequete = [];

sone.requete = function (req, res, query, pathname)
{
    for (let i = 0; i < sone.listRequete.length; i++)
    {
        if (pathname === sone.listRequete[i])
        {
            sone.listRequete[i-1](req, res, query);
        }
    }    
}

sone.addRequete = function (requete, name_requete)
{
    sone.listRequete.push(requete);
    sone.listRequete.push(name_requete);
}

sone.run = function (port, t)
{
    const serv = function (req, res)
    {
        let requete = url.parse(req.url, true);
        let pathname = requete.pathname;
        let query = requete.query;
        t.requete(req, res, query, pathname);
    }

    http.createServer(serv).listen(port);
    console.log("Server running on port " + port);
} 





/*let obj = {'name' : 'oui', 'fct' : (x)=>{x*2; console.log(obj.name); obj.t = x, obj.list.push(x)}, 'list' : []};
console.log(obj.t);*/

module.exports = sone;