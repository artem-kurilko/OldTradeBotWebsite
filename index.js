'use strict';

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const express = require('express');
const server = express();

const PORT = process.env.PORT || 3000;

// Parser for post request
const urlencodedParser = bodyParser.urlencoded({extended: false});

server.use("/public", express.static('public'));

// Connect to database
const connection = mysql.createConnection({
  host: "51.195.154.13",
  port: "3000",
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
    response.sendFile(__dirname + '/view/index.html');
});

// Redirect user to checkout page and save his information to db
server.post('/checkout', urlencodedParser, function(request, response){
    let purchasePlan;

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
    response.sendFile(__dirname + '/view/checkout.html');
});

// Contact url
server.post('/send-mail', urlencodedParser, function(request, response){
    let mailOptions = {
        from: 'cryptodealbot@gmail.com',
        to: `${request.body.receiverEmail}`,
        subject: 'Ответ от cryptoDealBot команды',
        text: 'Здравствуйте.\n\nСпасибо, что связались с нами.\n\nБудем рады ответить на ваши вопросы по поводу нашего сервиса.\n\nМы увидим ваше письмо и обязательно ответим вам в течении 6 часов.\n\nС уважением,\ncryptoDealBot команда.'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
    });

    response.redirect('https://cryptodealbot.com');
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

// Sending Email
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cryptodealbot@gmail.com',
    pass: 'Atmp123key'
  }
});

