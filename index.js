const express = require("express");

const server = express();

server.use(express.json());

//Query params = ?teste=1
//Route param = /user/1
//request body = { name: "tiago", age: 30}

const users = ["Tiago", "Magno", "Amorim"];

//criando middleware global
server.use((req, res, next) => {
  console.time("request");
  console.log("metodo ", req.method);
  console.log("URL ", req.url);
  next();
  console.timeEnd("request");
});

//criando middleware local
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({
      error: "user name is required"
    });
  }
  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({
      error: "user does not exists"
    });
  }
  req.user = user;
  return next();
}

server.get("/users/:index", checkUserInArray, (req, res) => {
  //const { index } = req.params;
  //return res.json(users[index]);
  return res.json(req.user);
});

server.get("/users/", (req, res) => {
  return res.json(users);
});

server.post("/users/", checkUserExists, (req, res) => {
  const { name } = req.body;
  users.push(name);
  return res.json(users);
});

server.put("/users/:index", checkUserExists, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users[index]);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;
  users.splice(index, 1);
  return res.json({ status: true, users: users });
});

/**
server.get("/name/:name", (request, response) => {
  console.log(response, request);
  return response.json({ MESSAGE: request.query.name });
  return response.json({ MESSAGE: request.params.name });
  return response.json({ MESSAGE: request.params.name });
}); */

server.listen(3333, function() {
  console.log("server ok");
});
