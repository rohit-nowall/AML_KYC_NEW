
var express = require('express')   
var app = express()
var db = require('./db.njs');
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')
app.use(express.logger('dev'))
app.use(express.static(__dirname + '/public'))
app.locals.moment = require('moment');


// HOME PAGE

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  )
})


// ALL USERS DISPLAY

app.get('/allusers', function(req, res){
db.query("SELECT * FROM authentication_kycuserdetail", function (err, result, fields) {
    if (err) throw err;    
	 res.render('allusers',{ title : 'All Users', users : result, message : 'This displays all users' } )});})

// ALL TRANSACTIONS DISPLAY

app.get('/alltransactions', function(req, res){
console.log('rohit');
db.query("SELECT * FROM transactions_transaction", function (err, result, fields) {
    if (err) throw err;    
	console.log('rohit123');
	 res.render('alltransactions',{ title : 'All Transactions', users : result, message : 'This displays all transactions' } )});})


// SINGLE USER QUERY SUBMISSION

app.get('/singleuserquery', function (req, res) {
  res.render('singleuserquery',
  { title : 'Single User', message : 'This shows the details of a single user' }
  )
})

// VA QUERY RESULT

app.get('/Vqueryresult', function(req, res){
var transactionvalue = req.query.transactionvalue;
var ruleNo = req.query.ruleNo;
var vaMSG = req.query.vaMSG;
//console.log(test);
if (ruleNo == 'VA-OSS') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
if (ruleNo == 'VA-OSS') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-OSB') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-OSD') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-OSM') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-OMB') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-OMD') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-OMM') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT COUNT(*) b, user_id FROM (SELECT DISTINCT user_id, toAddress FROM transactions_transaction WHERE MONTH(tx_timestamp) = 6) a GROUP BY user_id HAVING b > " + transactionvalue + ") c)";}  
  else if (ruleNo == 'VA-BSS') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT amount,USER_ID FROM transactions_transaction where amount > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-BSB') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}
  else if (ruleNo == 'VA-BSD') { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID HAVING a > " + transactionvalue + ") b)";}
  else { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";} 
db.query(sql, function (err, result, fields) {
    if (err) throw err;    
	 res.render('VAqueryresult',{ title : ruleNo, users : result, vaMSG : vaMSG } )});})

// VA QUERY SUBMISSION
	 
app.get('/rule', function(req, res) {
  vaID = req.query.vaID; 
  //console.log(vaID);
  if (vaID == 'VA-OSS') { vaMSG = '1 transaction greater than certain monetary threshold paid to one beneficiary'; vaConfig = '5000'; ruleNo = 'VA-OSS'}
  else if (vaID == 'VA-OSB') { vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period paid to one beneficiary'; vaConfig = '5000'; ruleNo = 'VA-OSB'}
  else if (vaID == 'VA-OSD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period paid to one beneficiary'; vaConfig = '10000'; ruleNo = 'VA-OSD'}
  else if (vaID == 'VA-OSM') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 calendar month period paid to one beneficiary'; vaConfig = '50000'; ruleNo = 'VA-OSM'}
  else if (vaID == 'VA-OMB') { vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period paid to multiple beneficiaries'; vaConfig = '5000'; ruleNo = 'VA-OMB'}
  else if (vaID == 'VA-OMD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period paid to multiple beneficiaries'; vaConfig = '10000'; ruleNo = 'VA-OMD'}
  else if (vaID == 'VA-OMM') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 calendar month period paid to multiple beneficiaries'; vaConfig = '50000'; ruleNo = 'VA-OMM'}
  else if (vaID == 'VA-BSS') { vaMSG = '1 transaction greater than certain monetary threshold received from one originator'; vaConfig = '5000'; ruleNo = 'VA-BSS'}
  else if (vaID == 'VA-BSB') { vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period received from one originator'; vaConfig = '5000'; ruleNo = 'VA-BSB'}
  else if (vaID == 'VA-BSD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period received from one originator'; vaConfig = '10000'; ruleNo = 'VA-BSD'}
  else{ vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period paid to one beneficiary'; vaConfig = '5000'; ruleNo = 'VA-BSD'}   

  res.render('VAquery',
  { title : vaID, vaMSG : vaMSG, config : vaConfig }
  )
});

// SINGLE USER DETAILS DISPLAY

app.get('/userid', function(req, res){
var id = req.query.id;
var sql1 = "SELECT * FROM authentication_kycuserdetail where user_id = '" + id + "'";
  
db.query(sql1, function (err, result, fields) {
    if (err) throw err;    
	 res.render('singleuser',{ title : 'User Details', users : result, message : 'This displays details of single user' } )});})




app.listen(3000)