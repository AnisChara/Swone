/*const onj = require('./app.js');

onj.fct(10);
onj.fct(10);
console.log(onj);
//*/
const fs = require('fs');

let oui = {
    'oui': 'oui',
    'f': (x)=>{x*2}
};


console.log(oui);
fs.writeFileSync('./a.json',JSON.stringify(oui),'utf-8');