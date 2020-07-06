'use strict';

const stripe = require('stripe')('pk_test_4MbmUEdZmjnDIi3UEUFhVk3U00ngyNRjem');

const session = stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
        price_data: {
            currency: 'usd',
            product_data: {
                name: 'T-shirt',
            },
            unit_amount: 500,
        },
        quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://',
    cancel_url: 'http://example.com/cancel',
});

const mysql = require("mysql2");
const express = require('express');
const server = express();

const PORT = process.env.PORT || 3000;

server.use("/public", express.static('public'));

/*const connection = mysql.createConnection({
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
});*/

server.get('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

server.get('/checkout', function(request, response){

});

server.listen(PORT, () => {
    console.log(`Server has been started on ${PORT} port...`)
});

/*
  // sending mail
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