var express = require('express');
var bodyParser = require('body-parser');
var lowdb = require('lowdb');
var server = express();
var uuid = require('uuid');

var Todo = require('./models/todo.js');

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
  var todo = new Todo(request.body.description);

  //  BELOW IS THE OLD CODE WE USED BEFORE WE SIMPLIFIED TO THE CODE ABOVE
  //  id: uuid.v4(),
  //   description: request.body.description,
  //   isComplete: false
  // };

  var result = db.get('todos')
                  .push(todo)
                  .last()
                  .value();

response.send(result);
});

server.put('/todos/:id', function(request, response){
  var todo = new Todo(request.body.description);
  todo.updateComplete(request.body.isComplete);

  // var updatedTodoInfo = {
  //   description: request.body.description,
  //   isComplete: request.body.isComplete,
  // };

  var updatedTodo = db.get('todos')
                    .find({id: request.params.id})
                    .assign(todo)
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
