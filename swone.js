"use strict";

const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const nunjucks = require("nunjucks");
const formidable = require("formidable");
const mail = require("nodemailer");

let swone = {};
swone.listRequete = [];
swone.listNameRequete = [];

swone.requete = function (req, res, query, pathname)
{
    //IDENTIFIE LA BONNE REQUETE 
    for (let i = 0; i < swone.listNameRequete.length; i++)
    {
        if (pathname === swone.listNameRequete[i])
        {
            try {
            swone.listRequete[i](req, res, query);
            } catch (e) {
                
            console.log('Erreur : ' + e.stack);
            console.log('Erreur : ' + e.message);
            
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
swone.addRequete = function (requete, name_requete)// GOOD
{
    swone.listRequete.push(requete);
    swone.listNameRequete.push(name_requete);
}

//EXECUTE LE SERVEUR
swone.run = function (port)// GOOD
{
    const serv = function (req, res)
    {
        let requete = url.parse(req.url, true);
        let pathname = requete.pathname;
        let query = requete.query;
        swone.requete(req, res, query, pathname);
    }

    http.createServer(serv).listen(port);
    console.log("Server running on port " + port);
}

swone.switchB = function (variable)
{
    if (variable === true) variable = false;
    else if (variable === false) variable = true;

    return variable;
}

swone.get = function (path)
{
    return JSON.parse(fs.readFileSync(path));
}

swone.write = function (path, data)
{
    fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
}

swone.gridList = function (height, width, value)
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

swone.grid = function (height, width, value)
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

swone.signUp = function (path,data , verif)// GOOD
{
    let membres = swone.get(path);

    if (Array.isArray(verif)=== false)
    {
        for (let i = 0; i < membres.length; i++)
        {
            if (data[verif] === membres[i][verif])
            {
                return membres[i];
            }
        }
        membres.push(data);
        swone.write(path, membres);
        return true;
    }
    if (Array.isArray(verif)=== true)
    {
        for (let i = 0; i < membres.length; i++)
        {
            for (let j = 0; j < verif.length; j++)
            {
                if (data[verif[j]] === membres[i][verif[j]])
                {
                    return membres[i];
                }
            }
            
        }
        membres.push(data);
        swone.write(path, membres);
        return true;
    }

}
swone.login = function (path,data , verif)// GOOD
{
    let membres = swone.get(path);

    if (Array.isArray(verif)=== false)
    {
        for (let i = 0; i < membres.length; i++)
        {
            if (data[verif] === membres[i][verif])
            {
                return membres[i];
            }
        }
        return false;
    }
    if (Array.isArray(verif)=== true)
    {
        for (let i = 0; i < membres.length; i++)
        {
            let match =0;

            for (let j = 0; j < verif.length; j++)
            {
                if (data[verif[j]] === membres[i][verif[j]])
                {
                    match++;
                }
            }
            if (match === verif.length) return membres[i];
            
        }
        return false;
    }

}

swone.display = function (path, marqueurs, code, res)// GOOD
{
    let page = fs.readFileSync(path, 'utf-8');

	page = nunjucks.renderString(page, marqueurs);

	res.writeHead(code, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
}	

swone.download = function (path, fct, req)
{
    let form = new formidable.IncomingForm(
        {
            uploadDir: path, 
            keepExtensions: true
        });
        if (typeof fct === 'function')
        {
            try {
                form.parse(req, fct)
                } catch (e) {console.log(e)}
        }
        else 
        {
            try {
                form.parse(req, () => {});
                } catch (e) {console.log(e)}
        }
        
}

swone.download.form = function (requete,classe)
{
    if (classe)
    {return `<form action=${requete} method="post" enctype="multipart/form-data">
            <input type="file" name="filetoupload" class=${classe}><br>
            <input type="submit" name="media" value="envoyer" class=${classe}>
            </form>`;}
    else 
    {return `<form action=${requete} method="post" enctype="multipart/form-data">
            <input type="file" name="filetoupload"><br>
            <input type="submit" name="media" value="envoyer">
            </form>`;}
}

module.exports = swone;