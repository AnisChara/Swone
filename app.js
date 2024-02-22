const swone = require('./swone.js');
const tl = require('./req_afficher_tl.js');

swone.addRequete(tl, '/');
swone.addRequete(tl, '/oui');
//let data = swone.get('membres.json'); //récupère les données de 'membres.json'
//console.log(data);// affichera la liste des membres

/*swone.write('./r.json','data'); // écrira les data dans un fichier 'r.json' 

let bool = false;
console.log(swone.switchB(bool)); // affichera true

let grid_list = swone.gridList(5,5,true);// crée une grille stockée dans une liste en 2D
console.log(grid_list);

let grid = swone.grid(5,5,null);// crée une grille stockée dans une variable
console.log(grid);

let data = {
    'pseudo': 'f',
    'password' : 'prout'
}
let sign = swone.login(data,'./membres.json');
console.log(sign);
//swone.login(data,path);
*/

swone.run(5000, swone)// démarre le serveur