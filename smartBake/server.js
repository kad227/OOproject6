let http = require('http');
let fs = require('fs');
var qs = require('querystring');
const display = require('./recipeBook')
const recipeMaker = require('./recipeMaker')





let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });

    if (request.url == "/AddRecipe.html"){
        fs.readFile('./AddRecipe.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                respone.write('Whoops! File not found!');
        }   else {
            response.write(data);
        }
        response.end();

    });

    }

    else if (request.url == "/explore.html"){
        fs.readFile('./explore.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                response.write('Whoops! File not found!');
        }   else {
            response.write(data);
        }
        response.end();

    });        
    }

        else if (request.url == "/home.html" ||  request.url == "/"){
        fs.readFile('./home.html', null, function (error, data) {
            if (error) {
                response.writeHead(404);
                respone.write('Whoops! File not found!');
        }   else {
            response.write(data);
        }
        response.end();

    });       
    }

    else if(request.url == "/Recipes"){
    display.fileWebserver(request, response);  

    }


    else{
         

        fs.readFile('.'+request.url, null, function (error, data) {
            if (error) {
                response.writeHead(404);
                respone.write('Whoops! File not found!');
        }   else {
            response.write(data);
        }
        response.end();

    }); 


    }
        
      

    }


 



const server = http.createServer(handleRequest).listen(8000);

// add additional listener
server.on('request', function (request, response) {

    recipeMaker.recipeMaker(request,response);




});  

