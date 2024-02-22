const sone = require('./sone.js');


//let data = sone.get('membres.json'); //récupère les données de 'membres.json'
//console.log(data);// affichera la liste des membres

sone.write('./r.json','data'); // écrira les data dans un fichier 'r.json' 

let bool = false;
console.log(sone.switchB(bool)); // affichera true

let grid_list = sone.gridList(5,5,true);// crée une grille stockée dans une liste en 2D
console.log(grid_list);

let grid = sone.grid(5,5,null);// crée une grille stockée dans une variable
console.log(grid);

let data = {
    'pseudo': 'f',
    'password' : 'prout'
}
let sign = sone.login(data,'./membres.json');
console.log(sign);
//sone.login(data,path);


//sone.run(5000, sone)// démarre le serveur