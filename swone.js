"use strict";

const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const nunjucks = require("nunjucks");
const formidable = require("formidable");
const mail = require("nodemailer");

/**
 * Main application object.
 * @namespace
 */
let swone = {};
swone.listRequete = [];
swone.listNameRequete = [];

/**
 * Handles incoming requests and routes them to the appropriate function.
 * @param {http.IncomingMessage} req - The incoming HTTP request.
 * @param {http.ServerResponse} res - The outgoing HTTP response.
 * @param {Object} query - The parsed query string as an object.
 * @param {string} pathname - The path section of the URL.
 */
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
    
        file = './' + file;
    
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

/**
 * Adds a new request handler function with its associated path.
 * @param {Function} requete - The request handler function to add.
 * @param {string} name_requete - The path associated with the request handler.
 */
swone.addRequete = function (requete, name_requete)// GOOD
{
    swone.listRequete.push(requete);
    swone.listNameRequete.push(name_requete);
}

/**
 * Initializes and starts the HTTP server on the specified port.
 * @param {number} port - The port number on which the server should listen.
 */
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

/**
 * Toggles a boolean value.
 * @param {boolean} variable - The boolean value to toggle.
 * @returns {boolean} The toggled boolean value.
 */
swone.switchB = function (variable)
{
    return !!!variable;
    //An advanced trick ensuring safety, conversion and efficiency... But quite esoteric 

    //first ! :  If its a boolean, good, it just flip it. Else, it forces the thruthness conversion of the variable and ensure it's a boolean and flip it.
    //second ! : restore the boolean to the original "thruthness"
    //third ! : flip back to finaly toggle the boolean value

    // complexity : O(n)= 3  operations
    // instead of calling ternary branching operator in the CPU (the IFs) 🤯

    //I love JS for this kind of quirks...
    //BUUUUUT, it's completly overkill for small applications 🫤
}

/**
 * Reads and parses a JSON file.
 * @param {string} path - The file path to read from.
 * @returns {Object} The parsed JSON object from the file.
 */
swone.get = function (path)
{
    return JSON.parse(fs.readFileSync(path));
}

/**
 * Writes an object as a JSON string to a file.
 * @param {string} path - The file path to write to.
 * @param {Object} data - The data to write as JSON.
 */
swone.write = function (path, data)
{
    fs.writeFileSync(path, JSON.stringify(data), 'utf-8');
}

/**
 * Creates a 2D grid list initialized with a specific value.
 * @param {number} height - The number of rows in the grid.
 * @param {number} width - The number of columns in the grid.
 * @param {*} value - The value to initialize each cell of the grid with.
 * @returns {Array<Array<*>>} A 2D grid list.
 */
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

/**
 * Creates a string representation of a 2D grid initialized with a specific value.
 * @param {number} height - The number of rows in the grid.
 * @param {number} width - The number of columns in the grid.
 * @param {string} value - The value to initialize each cell of the grid with.
 * @returns {string} A string representing the 2D grid.
 */
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

/**
 * Handles user signup by adding their data to a file if validation passes.
 * @param {string} path - The path to the file storing user data.
 * @param {Object} data - The user data to add.
 * @param {(string|Array<string>)} verif - The field(s) to validate the uniqueness of the user data.
 * @returns {(Object|boolean)} The user data if signup is successful, or true if validation fails.
 */
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

/**
 * Handles user login by checking their data against a file.
 * @param {string} path - The path to the file storing user data.
 * @param {Object} data - The user data to check.
 * @param {(string|Array<string>)} verif - The field(s) to validate the user data against.
 * @returns {(Object|boolean)} The user data if login is successful, or false if validation fails.
 */
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

/**
 * Renders a template with given data and sends it as an HTTP response.
 * @param {string} path - The path to the template file.
 * @param {Object} marqueurs - The data to render the template with.
 * @param {number} code - The HTTP status code to send.
 * @param {http.ServerResponse} res - The outgoing HTTP response.
 */
swone.display = function (path, marqueurs, code, res)// GOOD
{
    let page = fs.readFileSync(path, 'utf-8');

	page = nunjucks.renderString(page, marqueurs);

	res.writeHead(code, { 'Content-Type': 'text/html' });
	res.write(page);
	res.end();
}	
//Quentin : i let you discover express.js, an simple node HTTP server doing... exactly that. (a function called 'render')
//yep, the whole semester can be shorter with the right tools 😁. But not efficient to learn.

/**
 * Handles file upload requests.
 * @param {string} path - The directory path to save uploaded files.
 * @param {Function} [fct] - An optional callback function to execute upon file upload.
 * @param {http.IncomingMessage} req - The incoming HTTP request with the file data.
 */
swone.download = function (path, fct, req)
{
    let form = new formidable.IncomingForm(
        {
            uploadDir: path, 
            keepExtensions: true
        });
        if (typeof fct === 'function')//nice ! The right use for callbacks !
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

/**
 * Generates HTML form markup for file upload.
 * @param {string} requete - The request path the form should post to.
 * @param {string} [classe] - An optional CSS class to apply to the form elements.
 * @returns {string} The HTML markup for the file upload form.
 */
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