var express = require('express');
var bodyParser = require('body-parser');
var lowdb = require('lowdb');
var server = express();
var uuid = require('uuid');


var port = process.env.PORT || 8080;
var db = lowdb('db.json');

//Database Initialization
db.defaults({todos: []})
  .value(); //runs the previous set of commands

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

server.get('/todos', function(request, response){
  var result = db.get('todos')
  // .map('description')
  .value();
response.send(result);
});

server.get('/todos/:id', function(request, response){
  var todo = db.get('todos')
              .find({id: request.params.id})
              .value();
  response.send(todo);

});

server.post('/todos', function(request, response){
  var todo = {
    id: uuid.v4(),
    description: request.body.description,
    isComplete: false
  };

  var result = db.get('todos')
                  .push(todo)
                  .last()
                  .value();

response.send(result);
});

server.put('/todos/:id', function(request, response){
  var updatedTodoInfo = {
    description: request.body.description,
    isComplete: request.body.isComplete,
  };
  var updatedTodo = db.get('todos')
                    .find({id: request.params.id})
                    .assign(updatedTodoInfo)
                    .value();
  response.send(updatedTodo);
});

server.delete('/todos/:id', function (request, response){
  var todo = db.get('todos')
              .remove({id: request.params.id})
              .value();
  response.send(todo);
});

server.listen(port, function(){
  console.log('Now listening on port ...', port);
});
