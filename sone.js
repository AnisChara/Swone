"use strict";

const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

let sone = {};
sone.listRequete = [];
sone.listNameRequete = [];

sone.requete = function (req, res, query, pathname)
{
    //IDENTIFIE LA BONNE REQUETE 
    for (let i = 0; i < sone.listNameRequete.length; i++)
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
    const req_statique = function (req, res, query) {

        let page;
        let type;
        let sousType;
        let file = url.parse(req.url).pathname;
    
        // FABRIQUE LE PATH ABSOLU DU FICHIER DEMANDE
    
        file = __dirname + file;
    
        // AJUSTE LE TYPE EN FONCTION DE L'EXTENSION
    
        let extname = path.extname(file);
        if (extname === ".html") {
            type = 'text';
            sousType = 'html';
        } else if (extname === ".css") {
            type = 'text';
            sousType = 'css';
        } else if (extname === ".js") {
            type = 'text';
            sousType = 'js';
        } else if (extname === ".jpg" || extname === ".jpeg") {
            type = 'image';
            sousType = 'jpeg';
        } else if (extname === ".gif") {
            type = 'image';
            sousType = 'gif';
        } else if (extname === ".png") {
            type = 'image';
            sousType = 'png';
        } else if (extname === ".mp3") {
            type = 'audio';
            sousType = 'mp3';
        }
    
        // ENVOI L'ENTETE AVEC LE TYPE PUIS LE FICHIER
        // SI LE FICHIER N'EXISTE PAS, ENVOI D'UNE PAGE 404
    
        try {
            page = fs.readFileSync(file);
            res.writeHead(200, { 'Content-Type': type + "/" + sousType });
            res.write(page);
            res.end();
        } catch (e) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.write('ERREUR 404 : ' + file + ' fichier non trouvé');
            res.end();
        }
    };
    req_statique(req, res, query);
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

sone.switchB = function (variable)
{
    if (variable === true) variable = false;
    else if (variable === false) variable = true;

    return variable;
}

sone.get = function (path)
{
    return JSON.parse(fs.readFileSync(path));
}

sone.write = function (path, data)
{
    fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
}

sone.gridList = function (height, width, value)
{
    let grid = [];
    for (let i = 0; i < height; i++)
    {
        grid.push([]);
        for (let j = 0; j < width; j++)
        {
            grid[i].push(value);
        }
    }
    return grid;
}

sone.grid = function (height, width, value)
{
    let grid = "";
    for (let i = 0; i < height; i++)
    {
        for (let j = 0; j < width; j++)
        {
            grid += value;
        }
        grid += "\n";
    }
    return grid;
}

sone.signUP = function (data, path)
{
    let membres = sone.get(path);

    let match = false;

    for (let i = 0; i < membres.length; i++)
    {
        if (data.pseudo === membres[i].pseudo)
        {
            match = true;
            return false;
        }
    }
    if (match === false)
    {
        membres.push(data);
        sone.write(path, membres);
        return true;
    }
}
sone.login = function (data, path)
{
    let membres = sone.get(path);
    let match = false;

    for (let i = 0; i < membres.length; i++)
    {
        if (data.pseudo === membres[i].pseudo)
        {
            match = true;
            return true;
        }
    }
    return false;
}




module.exports = sone;