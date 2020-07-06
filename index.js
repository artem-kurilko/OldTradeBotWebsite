'use strict';

const mysql = require("mysql2");
const express = require('express');
const server = express();

const PORT = process.env.PORT || 3000;

server.use("/public", express.static('public'));

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "tradebot",
  password: "Atmp123key"
});

connection.connect(function (err) {
  if (err)
    return console.error("Error: " + err.message);
  else
    console.log("Connected to MySQL.");
});

// Website's API
server.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

server.post('/checkout', function(request, response){
    response.sendFile(__dirname + '/views/checkout.html');
});

server.get('*', function(request, response){
    if (request.accepts('html')) {
        response.sendFile(__dirname + '/view/error.html');
        return;
    }
});

server.listen(PORT, () => {
    console.log(`Server has been started on ${PORT} port...`)
});

/*
// Sending Email
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kurilko365@protonmail.com',
    pass: 'Cfd802vds36'
  }
});

var mailOptions = {
  from: 'kurilko365@protonmail.com',
  to: `${RECEIVER_EMAIL}`,
  subject: 'Заявка на доступ к трейд боту',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
*/