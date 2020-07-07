'use strict';

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const express = require('express');
const server = express();

const PORT = process.env.PORT || 3000;

// add parser for post request
const urlencodedParser = bodyParser.urlencoded({extended: false});

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

// redirect user to checkout page and save his information to db
server.post('/checkout', urlencodedParser, function(request, response){
    console.log(request.body);
    let purchasePlan;
    console.log(request.body.plan);

    if (!request.body) return response.sendStatus(400);
    
    else if (request.body.plan == 'standart-plan') {
      console.log(true);
     purchasePlan = 1;
    }
    
    else {
      console.log(false);
      purchasePlan = 0;
    }
    connection.execute(`INSERT INTO account_data(user_name, mail, is_standart_plan, api_key, secret_key) VALUES("${request.body.userName}", "${request.body.email}", "${purchasePlan}", "${request.body.apiKey}", "${request.body.secretKey}");`);
    response.sendFile(__dirname + '/views/checkout.html');
});

server.get('*', function(request, response){
    if (request.accepts('html')) {
        response.sendFile(__dirname + '/views/error.html');
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