const fs = require('fs');

function lerJson(file) { 
    try {
        let dbFile = fs.readFileSync(file);
        let dbJson = JSON.parse(dbFile);
        return dbJson;
    
    } catch(err) {
        if(err.code !== 'ENOENT') { 
            console.error(err);
        } else {
            console.log("Arquivo não encontrado!");
        }
        return false;
    }
}

function corrigirNomes(dbJson) {
    let dbString = JSON.stringify(dbJson);
    dbString = dbString.replace(/æ/g, "a");
    dbString = dbString.replace(/¢/g, "c");
    dbString = dbString.replace(/ø/g, "o");
    dbString = dbString.replace(/ß/g, "b");

    return JSON.parse(dbString);
}

function corrigirPrecos(dbJson) {
    for( i=0; i < dbJson.length; i++) {
        if( typeof dbJson[i].price === 'string' ) {
            dbJson[i].price = parseFloat(dbJson[i].price, 10);
        }
    }

    return dbJson;
}

function corrigirQuantidades(dbJson) {
    for( i=0; i < dbJson.length; i++) {
        if(!(dbJson[i].hasOwnProperty('quantity'))) {
            dbJson[i].quantity = 0;
        }
    }

    return dbJson;
}

function gravarJson(dbJson) {
    try {
        fs.writeFileSync('saida.json', JSON.stringify(dbJson, null, 2));

    } catch(err) {
        console.error(err);
    }
}
function ordenarProdutos(dbJson) {
    let listaOrdenada = dbJson.sort(function (a, b) {
        if(a.category > b.category) {
            return 1;
        }
        if(a.category < b.category) {
            return -1;
        }
        if(a.id > b.id) {
            return 1;
        }
        if(a.id < b.id) {
            return -1;
        }
        return 0
    });
    //console.log(listaOrdenada);
    listaOrdenada.forEach(element => {
        console.log(element.name);
    });
}

function calcularValorEstoque(dbJson) {
    if(dbJson) {
        let estoques = new Object();
        for(i = 0; i < dbJson.length ; i++) {
            if(estoques.hasOwnProperty(dbJson[i].category)) {
                estoques[dbJson[i].category] += dbJson[i].price*dbJson[i].quantity;
            } else {
                estoques[dbJson[i].category] = dbJson[i].price*dbJson[i].quantity;
            }
        }
        Object.keys(estoques).forEach(element => {
            console.log(element+": "+estoques[element]);
        });
    }
}

let dbJson = lerJson('broken-database.json');
if(dbJson) {
    dbJson = corrigirNomes(dbJson);
    dbJson = corrigirPrecos(dbJson);
    dbJson = corrigirQuantidades(dbJson);
    gravarJson(dbJson);
}

let dbJsonCorrigido = lerJson('saida.json');
if(dbJsonCorrigido) {
    ordenarProdutos(dbJsonCorrigido);
    calcularValorEstoque(dbJsonCorrigido);
}

/*
Foram utilizadas como fontes de consulta:
https://stackabuse.com/reading-and-writing-json-files-with-node-js/
https://nodejs.dev/learn/reading-files-with-nodejs
https://www.geeksforgeeks.org/node-js-fs-readfilesync-method/
https://www.w3schools.com/jsref/jsref_replace.asp/
*/