'use strict';

const mysql = require("mysql2");
const bodyParser = require("body-parser");
const paypal = require('paypal-rest-sdk');
const express = require('express');
const server = express();
const log = require('fs');

let planCost;
let createdAt = new Date().toLocaleString();

paypal.configure({
    'mode': 'live',
    'client_id': 'AdOp_5ndL3gYSKO6pLTtyLbQrLEaS2f3vzfhbp0spNHDZze612iyN3198pme6tpgb1NyusSEcmpVeCUV',
    'client_secret': 'EGOHd5LPu8TpeIvoIBKPLZzzHN7HQCLK30v80HCuVuju2cCpf1ueDEQmfiwbUgz4-poXD2P8qtvb2Sva'
});

const PORT = process.env.PORT || 3000;

// Parser for post request
const urlencodedParser = bodyParser.urlencoded({extended: false});

server.use("/public", express.static('public'));

// Connect to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "top_root",
  password: "CryptoBot_000",
  database: "tradebot"
});

connection.connect(function (err) {
    
    if (err)
      log.writeFileSync('log123.txt', err.message + "\n")
    else
       log.writeFileSync('log123.txt', "Connected to MySQL" + "\n");  
});

// Website's API
server.get('/', function(request, response) {
    response.sendFile(__dirname + '/view/index.html');
});

/***** Payment *****/

// Redirect user to checkout page and save his information to db
server.post('/checkout', urlencodedParser, function(request, response){
    let purchasePlan;

    if (!request.body) return response.sendStatus(400);
    
    else if (request.body.plan == 'standart-plan') {
        planCost = 5;
        purchasePlan = 1;
    }
    
    else {
      planCost = 7.49;
      purchasePlan = 0;
    }

    let user = [request.body.userName, request.body.email, purchasePlan, request.body.apiKey, request.body.secretKey, createdAt];
    let mysqlRequest = "INSERT INTO account_data(user_name, mail, is_standart_plan, api_key, secret_key, created_at) VALUES(?, ?, ?, ?, ?, ?);";

    connection.query(mysqlRequest, user, function(err, results){
        if (err) log.writeFileSync('log123.txt', err.message + "\n");
        else  log.writeFileSync('log123.txt',"Данные добавлены" + "\n");
    });

    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "https://cryptodealbot/success",
            "cancel_url": "https://cryptodealbot/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Trade bot",
                    "sku": "001",
                    "price": planCost,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": planCost
            },
            "description": "Crypto deal bot monthly payment"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                    response.redirect(payment.links[i].href);
                }
            }
        }
    });
});

server.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": planCost
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });

    res.redirect('/paid')
});

server.get('/cancel', (req, res) => res.send('Cancelled')); /* End of payment */

server.get('/paid', function(req, res){
    res.sendFile(__dirname + '/view/paid.html');
});

/* Contact url */
server.post('/sendMail', urlencodedParser, function(request, response){
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


    response.redirect('/');
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

/* Sending Email */
var nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'cryptodealbot@gmail.com',
    pass: 'Atmp123key'
  }
});


