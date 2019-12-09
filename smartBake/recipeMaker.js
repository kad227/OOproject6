let http = require('http');
let fs = require('fs');
var qs = require('querystring');

   module.exports = {  

   recipeMaker: function(request,response){

    if (request.method == 'POST') {
        var body = '';

        request.on('data', function (data) {
            body += data;
            console.log(data.toString())

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);

        var filename = post['recipe'].toString();
        var ingr = post['ingredient'].toString();
        var w = post['weight'].toString();
        var desc = post['description'].toString();




    function Recipe(name){
        this.name = name
        this.type = "Recipe"
    }

 
    function Ingredient(name){
        this.name = name
        this.type = "Ingredient"
    }

    function Weight(name){
        this.name = name
        this.type = "Weight"
    }
    function Description(name){
        this.name = name
        this.type = "Description"
    }

    //Factory Pattern
    function RecipeFactory(){
        this.create = (name, type) => {
            switch(type){

            case 0:
                return new Recipe(name)
                break;           
            case 1:
                return new Ingredient(name)
                break;
            case 2:
                return new Weight(name)
                break;
            case 3:
                return new Description(name)
                break;
            }
        }
    }

    //iterator pattern, traverses through collection of input objects to retrieve 
    //only the element we want (weights)
    function iterator(){

        if(this.type == "Weight"){



            fs.appendFile(`data/${filename}.txt`, this.name, (err) => { 

            if (err) throw err;    

            })

        }



        

        
    }
    var array = [[ingr.split(',')], [w.split(',')]]
    /*console.log(array[0][0])
    console.log(typeof filename)
    console.log(desc)
    console.log(typeof ingr)
    console.log(w)*/

   var recipeContent = `<!DOCTYPE html> <html lang="en"> <head> <title>Recipe</title> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"> </head> <body> <div class="Top"> <a href="http://localhost:8000/Recipes"> <h1 class="Gohome" type="text"> <strong> back to RecipeBook </strong> </h1> </a> <br><h2>'${filename}'</h2><br><h5>${desc}</h5><br><h3>Ingredients: ${ingr}</h3><br><h3>Weights: ${w}</h3></html>`
   fs.writeFile(`Recipes/${filename}.html`, recipeContent, (error) => { /* handle error */ });





    const recipeFactory = new RecipeFactory()
    const recipeBook = []

    recipeBook.push(recipeFactory.create(`${filename}`, 0))
    recipeBook.push(recipeFactory.create(`${desc}`, 3))
    recipeBook.push(recipeFactory.create(`${ingr}`, 1))
    recipeBook.push(recipeFactory.create(`${w}`, 2))


    recipeBook.forEach( item => {

        //call to iterate
        iterator.call(item) 

    })





    });

    }
}
}