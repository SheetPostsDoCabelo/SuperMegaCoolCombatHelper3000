const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();












//---------------------------------------------------


///////model for fetch//
    //fetch(url, options).then((res)=>{})//inside .then is a callbackFunction

///////fazer tratamento de erros
    
/* 
function handleErrors(res) {
    if (!res.ok) {
        throw Error(res.statusText);
    }
    return res;
}
fetch("")
    .then(handleErrors)
    .then(res => console.log("ok") )
    .catch(error => console.log(error) );
 */