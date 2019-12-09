/* Node.js static file web server */
   
// Importing necessary modules 
const http = require('http'); 
const url = require('url'); 
const fs = require('fs'); 
const path = require('path'); 
   

   
// Maps file extension to MIME types which 
// helps browser to understand what to do 
// with the file 
const mimeType = { 

    '.html': 'text/html', 

}; 
   
   module.exports = {  

   fileWebserver: function(req,res){

   
    // Parsing the requested URL 
    const parsedUrl = url.parse(req.url); 
   
    // If requested url is "/" like "http://localhost:1800/" 
    if(parsedUrl.pathname==="/Recipes"){ 
        var filesLink="<ul>"; 
        var filesList=fs.readdirSync("./Recipes/"); 
        filesList.forEach(element => { 
            if(fs.statSync("./Recipes/"+element).isFile()){ 
                filesLink+=`<br/><li><a href='/Recipes/${element}'> 
                    ${element} 
                </a></li>` ;

            } 
        }); 
          
        filesLink+="</ul>"; 
       
        res.end("<head> <title>Smart Bake Home</title> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1'> <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'> <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script> <script src='https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js'></script> <script src='https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'></script> </head><div class='container-fluid'> <h2>Recipes</h2><br> <p>Download and use any of our Smart Bake recipies!</p> " + filesLink); 
    } 
   
    /* Processing the requested file pathname to 
    avoid directory traversal like, 
    http://localhost:1800/../fileOutofContext.txt 
    by limiting to the current directory only. */

    const sanitizePath =  
    path.normalize(parsedUrl.pathname).replace(/^(\.\.[\/\\])+/, ''); 
      
    let pathname = path.join("./Recipes",sanitizePath);//__dirname, sanitizePath); 
      
    if(!fs.existsSync(pathname)) { 
          
        // If the file is not found, return 404 
        res.statusCode = 404; 
        res.end(`File ${pathname} not found!`); 
    } 
    else { 
          
        // Read file from file system limit to  
        // the current directory only. 
        fs.readFile(pathname, function(err, data) { 
            if(err){ 
                res.statusCode = 500; 
                res.end(`Error in getting the file.`); 
            }  
            else { 
                  
                // Based on the URL path, extract the 
                // file extention. Ex .js, .doc, ... 
                const ext = path.parse(pathname).ext; 
                  
                // If the file is found, set Content-type 
                // and send data 
                res.setHeader('Content-type', 
                        mimeType[ext] || 'text/plain' ); 
                  
                res.end(data); 
            } 
        }); 
    } 
}
}
