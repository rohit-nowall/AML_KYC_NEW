

// main author :- Rohit
var express = require('express');
var app = express();
var db = require('./db.njs');
var hbs = require('express-handlebars');

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout',helpers: {
        formatDate: function (date, format) {
            return moment(date).format(format);
        }}, layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.logger('dev'))
app.use(express.static(__dirname + '/public'))
app.locals.moment = require('moment');

var Handlebars = require("handlebars");
var MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);


// Helpers for template
Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

Handlebars.registerHelper('notequal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue==rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
});

session = require('express-session');
app.use(session({
    secret: '2C44-4D44-WppQ38S',
    resave: true,
    saveUninitialized: true
}));
 

 
 // Rohit's queries
 
 // HOME PAGE

app.get('/', function(req, res){
var sql = 'SELECT DISTINCT *, d.name planned_investment, c.name nationality FROM authentication_kycuserdetail a, (SELECT DISTINCT RULES,USER_ID, customer_status FROM RULES_BROKEN_CUSTOMER WHERE CHAR_LENGTH(RULES) > 20) b, nationality c, planned_investment d WHERE a.planned_investment=d.id and a.user_id = b.user_id AND a.nationality = c.id ORDER BY a.user_id';	
db.query(sql, function (err, result_customer, fields) {          		  
			  
	 res.render('index',{ title : 'Home Page', result_customer : result_customer, message : 'This displays the list of rules broken' })} )});
	 
// Authentication and Authorization Middleware - require for login / logout

var auth = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    //return res.sendStatus(401);
    return       res.send("not alllowed!");
};
 
// Login endpoint
app.get('/login', function (req, res) {
  if (!req.query.username || !req.query.password) {
    res.send('login failed - <br> Please <a href=\"http://localhost:3000/login_page\">click here</a> to go to login page');    
  } else if(req.query.username === "rohit" || req.query.password === "lara") {
    req.session.user = "amy";
    req.session.admin = true;
    res.send("login success! <br> Please <a href=\"http://localhost:3000/\">click here</a> to go to home page");
  }
});
 
// LOGIN PAGE

app.get('/login_page',function(req, res){
	res.render('login_page')})
	
// Logout endpoint
app.get('/logout', function (req, res) {
  req.session.destroy();
  res.send("logout success!  <br> Please <a href=\"http://localhost:3000/login_page\">click here</a> to go to LOGIN page");
});	
	
// SINGLE USER QUERY SUBMISSION

app.get('/singleuserquery', function (req, res) {
  res.render('singleuserquery',
  { title : 'Single User', message : 'This shows the details of a single user' }
  )
})

// SINGLE USER DETAILS DISPLAY

app.get('/userid', function(req, res){
var id = req.query.id;
var sql1 = "SELECT * FROM authentication_kycuserdetail where user_id = '" + id + "'";

db.query(sql1, function (err, result, fields) {
    if (err) throw err;
	 res.render('singleuser',{ title : 'User Details', user_details : result, message : 'This displays details of single user' } )});})

// SINGLE TRANSACTIONS QUERY SUBMISSION

app.get('/singletransactionquery', function (req, res) {
  res.render('singletransactionquery',
  { title : 'Single Transaction', message : 'This shows the details of a single transaction' }
  )
})

// SINGLE TRANSACTIONS QUERY RESULT

app.get('/singletransactionqueryresult', function (req, res) {
var id = req.query.id;
db.query("SELECT * FROM transactions_transaction where id = " + id + "", function (err, result, fields) {
    if (err) throw err;	
	 res.render('singletransaction',{ title : 'Transaction Details', transaction_details : result, message : 'Single Transaction Details' } )});})

// ALL USERS / CUSTOMERS DISPLAY

app.get('/allusers', function(req, res){
db.query("SELECT *, b.name nationality1, c.name country1 FROM authentication_kycuserdetail a, nationality b, country c WHERE a.nationality = b.id  AND a.country_of_residence = c.id order by user_id", function (err, result, fields) {
    if (err) throw err;
	 res.render('allusers',{ title : 'All Users', users : result, message : 'This displays all users' } )});})
	 
// ALL TRANSACTIONS DISPLAY

app.get('/alltransactions', function(req, res){
console.log('rohit');
db.query("SELECT * FROM transactions_transaction", function (err, result, fields) {
    if (err) throw err;	
	 res.render('alltransactions',{ title : 'All Transactions', users : result, message : 'Download all transactions' } )});})
	 
	 // RULES BROKEN CUSTOMERS	 
app.get('/rulesbrokencustomer', function(req, res){
db.query("SELECT *,y3.name acountry, y2.name nationality FROM authentication_kycuserdetail Y1, NATIONALITY Y2, country y3, rules_broken_customer y4 WHERE Y1.NATIONALITY = Y2.ID AND Y1.country_of_residence = Y3.ID AND y1.user_id = y4.user_id", function (err, result, fields) {
    if (err) throw err;
	 res.render('rulesbrokencustomer',{ title : 'Rules broken by customer', users : result, message : 'This displays the rules broken by customers' } )});})	 

	  // CUSTOMER BLOCK	 
app.get('/customer_block', function(req, res){
	customer_block = req.query.customer_block;
	user_id = req.query.user_id;
	wallet_id = req.query.wallet_id;
	
	db.query("update rules_broken_customer set customer_status = '" + customer_block + "' where user_id = '" + user_id + "'", function (err, result, fields) {
    if (err) throw err;
	  var url = "/wallet_id?id='" + wallet_id + "'";
	 res.redirect("/wallet_id?id=" + wallet_id + "");
	 //console.log(url);
	 // res.redirect("/");
	 })});
	 

	 
// RULES BROKEN TRANSACTIONS	 
app.get('/rulesbrokentransaction', function(req, res){
db.query("SELECT *,ROUND(amount*rate,2) usd_rate FROM exchange_rate x1,transactions_transaction a, authentication_kycuserdetail b, rules_broken_customer_detailed c WHERE a.id = c.trans_id AND a.user_id = b.user_id AND x1.from_token = a.token AND DATE_FORMAT(a.tx_timestamp, \"%Y-%m-%d\") = x1.created_date", function (err, result, fields) { 
	 if (err) throw err;
	 res.render('rulesbrokentransaction',{ title : 'Rules broken by transaction', users : result, message : 'This displays the rules broken by transactions' } )});})	 
	 
// VA QUERY SUBMISSION

app.get('/rule', function(req, res) {
  vaID = req.query.vaID;
  vaMSG = getMSG(vaID);
  ruleNo = vaID ;
  if (vaID == 'VA-OSS') {  vaConfig = '5000';  }  
  else if (vaID == 'VA-OSD') {  vaConfig = '10000'; }
  else if (vaID == 'VA-OSM') {  vaConfig = '50000'; }  
  else if (vaID == 'VA-OMD') {  vaConfig = '10000'; }
  else if (vaID == 'VA-OMM') {  vaConfig = '50000'; }
  else if (vaID == 'VA-BSS') {  vaConfig = '5000'; }  
  else if (vaID == 'VA-BSD') { vaConfig = '10000'; }
  else if (vaID == 'VA-BSM') { vaConfig = '50000'; }
  else if (vaID == 'VA-BMD') { vaConfig = '10000'; }
  else if (vaID == 'VA-BMM') { vaConfig = '50000'; }
  else if (vaID == 'VO-OSD') { vaConfig = '20'; }
  else if (vaID == 'VO-OSM') { vaConfig = '100'; }
  else if (vaID == 'VO-OMD') { vaConfig = '20'; }
  else if (vaID == 'VO-OMM') { vaConfig = '100'; }
  else if (vaID == 'VO-BSD') { vaConfig = '20'; }
  else if (vaID == 'VO-BSM') { vaConfig = '100'; }
  else if (vaID == 'VA-BMD') { vaConfig = '20'; }
  else if (vaID == 'VA-BMM') { vaConfig = '100'; }
  else if (vaID == 'VA-OCM') { vaConfig = '50'; }
  else{ vaConfig = '5000'; }

  res.render('VAquery',
  { title : vaID, vaMSG : vaMSG, config : vaConfig, ruleNo : ruleNo }
  )
});

// VA QUERY RESULT

app.get('/Vqueryresult', function(req, res){
var transactionvalue = req.query.transactionvalue;
var ruleNo = req.query.ruleNo;
var vaMSG = req.query.vaMSG;

var sql = getSQL(ruleNo, transactionvalue); vaMSG = getMSG(ruleNo);

  render(sql, ruleNo, vaMSG, res);
 	 })

	 
// SINGLE Wallet DISPLAY

app.get('/wallet_id', function(req, res){
var id = req.query.id;

var sql = "SELECT *,y3.name acountry, y2.name anationality, y4.name industry1, y5.name work1, y6.name id1, y7.name pi1, y8.name pa1 FROM authentication_kycuserdetail Y1, NATIONALITY Y2, country y3,work_industry y4, work_type y5, id_type y6, planned_investment y7, purpose_of_action y8 WHERE Y1.planned_investment = y7.id AND Y1.purpose_of_action = y8.id AND Y1.NATIONALITY = Y2.ID AND Y1.country_of_residence = Y3.ID AND wallet_id = '" + id + "' AND y1.work_type = y5.id AND y1.industry = y4.id AND y1.document_type = y6.id";
db.query(sql, function (err, user_details, fields) {
if (err) throw err;
var sql = "SELECT *,y3.name acountry, y2.name nationality FROM authentication_kycuserdetail Y1, NATIONALITY Y2, country y3, rules_broken_customer y4 WHERE Y1.NATIONALITY = Y2.ID AND Y1.country_of_residence = Y3.ID AND wallet_id = '" + id + "' AND y1.user_id = y4.user_id";
db.query(sql, function (err, basic_rules, fields) { ;
if (err) throw err;
var sql = "SELECT *,FORMAT(amount*rate,0) amount_usd,FORMAT(amount,0) amount_token FROM exchange_rate x1,transactions_transaction a, authentication_kycuserdetail b, rules_broken_customer_detailed c WHERE a.id = c.trans_id AND a.user_id = b.user_id AND b.wallet_id = '" + id + "' AND x1.from_token = a.token AND DATE_FORMAT(a.tx_timestamp, \"%Y-%m-%d\") = x1.created_date";
//var sql = "SELECT *,FORMAT(amount,0) amount1, ROUND((SELECT IFNULL(rate,'100')*0.2*odin_token_equivalent FROM exchange_rate WHERE from_token = token AND DATE_FORMAT(tx_timestamp,'%Y-%m-%d') = exchange_rate.created_date),2) usd_rate  FROM transactions_transaction a, authentication_kycuserdetail b, rules_broken_customer_detailed c WHERE a.id = c.trans_id AND a.user_id = b.user_id AND b.wallet_id = '" + id + "'";
db.query(sql, function (err, advanced_rules, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount ,order1 from month LEFT JOIN (SELECT SUM(amount) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.fromaddress = '" + id + "'  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, value_transaction_sent, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT count(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.fromaddress = '" + id + "'  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, volume_transaction_sent, fields) {
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT SUM(amount) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.toaddress = '" + id + "'  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, value_transaction_received, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT count(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.toaddress = '" + id + "'  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, volume_transaction_received, fields) {
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT SUM(amount) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where (c.toaddress = '" + id + "' or c.fromaddress = '" + id + "')  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, value_transaction_total, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT count(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where (c.toaddress = '" + id + "' or c.fromaddress = '" + id + "')  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, volume_transaction_total, fields) {
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount ,order1 from month LEFT JOIN (SELECT SUM(amount) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.fromaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "'))  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, value_transaction_sent_peer, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT count(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.fromaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "'))  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, volume_transaction_sent_peer, fields) {
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT SUM(amount) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.toaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "'))  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, value_transaction_received_peer, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT count(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where c.toaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "'))  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, volume_transaction_received_peer, fields) {
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT SUM(amount) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where (c.toaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "')) or c.fromaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "')))  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, value_transaction_total_peer, fields) {
if (err) throw err;
var sql = "select month,IFNULL(FORMAT(a,0), 0) amount,order1 from month LEFT JOIN (SELECT count(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c where (c.toaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "')) or c.fromaddress in (select wallet_id from authentication_kycuserdetail where planned_investment in (select planned_investment from authentication_kycuserdetail where wallet_id = '" + id + "')))  group by b order by tx_timestamp) Y ON DATE_FORMAT(month.tx_timestamp, \"%M %Y\") = Y.B order by order1 desc";
db.query(sql, function (err, volume_transaction_total_peer, fields) {
	
var sql = "SELECT customer_status a FROM rules_broken_customer where user_id in (select user_id from authentication_kycuserdetail where wallet_id ='" + id + "') ";
db.query(sql, function (err, volume_transaction_total_peer2, fields) { if (err) throw err;	
	var customer_status = volume_transaction_total_peer2[0].a;
    if ( customer_status == 'green' )	{}
	else if (customer_status == 'black') {}
	else 
	   { customer_status = 'yellow'
		var sql = "update rules_broken_customer set customer_status = 'yellow' where user_id in (select user_id from authentication_kycuserdetail where wallet_id ='" + id + "') ";
        db.query(sql, function (err, volume_transaction_total_peer1, fields) {})   
	   }
		 //console.log('Table Truncated');
	
 
res.render('singleuser',{ title : 'User Details', user_details : user_details, basic_rules : basic_rules, advanced_rules : advanced_rules,
                        value_transaction_sent : value_transaction_sent,volume_transaction_sent : volume_transaction_sent,
                        value_transaction_received : value_transaction_received,volume_transaction_received : volume_transaction_received,
                        value_transaction_total : value_transaction_total,volume_transaction_total : volume_transaction_total,
                        value_transaction_sent_peer : value_transaction_sent_peer,volume_transaction_sent_peer : volume_transaction_sent_peer,
                        value_transaction_received_peer : value_transaction_received_peer,volume_transaction_received_peer : volume_transaction_received_peer,
                        value_transaction_total_peer : value_transaction_total_peer,volume_transaction_total_peer : volume_transaction_total_peer, not_blocked : customer_status,  						
						message : 'KYC SECTION' } )
})})})})})})})})})})})})})})})})})


// render results
function render(sql, ruleNo, vaMSG, res) {
    db.query(sql, function (err, result, fields) {
    if (err) throw err;
	 res.render('VAqueryresult',{ title : ruleNo, users : result, vaMSG : vaMSG } )});	
}


// SQL QUERIES
function getSQL(ruleNo, transactionvalue) {
    if (ruleNo == 'VA-OSS') { var sql = "SELECT * FROM transactions_transaction WHERE amount > " + transactionvalue + "";  }
  else if (ruleNo == 'VA-OSD') { var sql = "select *  from transactions_transaction e, (SELECT SUM(amount) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
 else if (ruleNo == 'VA-OSM') { var sql = "select *  from transactions_transaction e, (SELECT SUM(amount) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'VA-OMD') { var sql = "select *  from transactions_transaction e, (SELECT SUM(amount) a, DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY d HAVING a > " + transactionvalue + ") f where DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
 else if (ruleNo == 'VA-OMM') { var sql = "select *  from transactions_transaction e, (SELECT SUM(amount) a, DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY d HAVING a > " + transactionvalue + ") f where DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'VA-BSS') { var sql = "SELECT * FROM transactions_transaction WHERE amount > " + transactionvalue + "";  }
  else if (ruleNo == 'VA-BSD') { var sql = "select *  from transactions_transaction e,(SELECT SUM(amount) a,fromaddress b, DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY b,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
  else if (ruleNo == 'VA-BSM') { var sql = "select *  from transactions_transaction e,(SELECT SUM(amount) a,fromaddress b, DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY b,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'VA-BMD') { var sql = "select *  from transactions_transaction e,(SELECT SUM(amount) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
  else if (ruleNo == 'VA-BMM') { var sql = "select *  from transactions_transaction e,(SELECT SUM(amount) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'VO-OSD') { var sql = "select *  from transactions_transaction e, (SELECT COUNT(id) a, fromaddress b,toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
 else if (ruleNo == 'VO-OSM') { var sql = "select *  from transactions_transaction e, (SELECT COUNT(id) a, fromaddress b,toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
 else if (ruleNo == 'VO-OMD') { var sql = "select *  from transactions_transaction e,(SELECT COUNT(id) a, fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
  else if (ruleNo == 'VO-OMM') { var sql = "select *  from transactions_transaction e,(SELECT COUNT(id) a, fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'VO-BSD') { var sql = "SELECT *  FROM transactions_transaction e, (SELECT COUNT(id) a,fromaddress b, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
  else if (ruleNo == 'VO-BSM') { var sql = "SELECT *  FROM transactions_transaction e, (SELECT COUNT(id) a,fromaddress b, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'VO-BMD') { var sql = "SELECT *  FROM transactions_transaction e, (SELECT COUNT(id) a, toaddress c, DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d";}
  else if (ruleNo == 'VO-BMM') { var sql = "SELECT *  FROM transactions_transaction e, (SELECT COUNT(id) a, toaddress c, DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d";}
  else if (ruleNo == 'BL-OSS') { var sql = "select * from authentication_user a,authentication_kycuserdetail b, transactions_transaction c where a.user_id=b.user_id and b.wallet_id = c.toaddress and a.not_blocked=0";}
  else if (ruleNo == 'BL-BSS') { var sql = "select * from authentication_user a,authentication_kycuserdetail b, transactions_transaction c where a.user_id=b.user_id and b.wallet_id = c.fromaddress and a.not_blocked=0";}
  else if (ruleNo == 'VA-OCM') { var sql = "select * from authentication_user a,authentication_kycuserdetail b, transactions_transaction c where a.user_id=b.user_id and b.wallet_id = c.fromaddress and a.not_blocked=0";}
  
  
  else { var sql = "SELECT * FROM transactions_transaction WHERE user_id IN (SELECT user_id FROM (SELECT SUM(amount) a,USER_ID, toAddress c FROM transactions_transaction GROUP BY DAY(tx_timestamp),USER_ID, toAddress HAVING a > " + transactionvalue + ") b)";}	
return sql;
  }
  
  
// MESSAGES
function getMSG(ruleNo)
 {
  if (ruleNo == 'VA-OSS') {  vaMSG = 'Single transaction greater than certain monetary threshold paid to one beneficiary'; }
  else if (ruleNo == 'VA-OSB') { vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period paid to one beneficiary';}
  else if (ruleNo == 'VA-OSD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period paid to one beneficiary';}
  else if (ruleNo == 'VA-OSM') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 calendar month period paid to one beneficiary';}
  else if (ruleNo == 'VA-OMB') { vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period paid to multiple beneficiaries';}
  else if (ruleNo == 'VA-OMD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period paid to multiple beneficiaries';}
  else if (ruleNo == 'VA-OMM') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 calendar month period paid to multiple beneficiaries';}
  else if (ruleNo == 'VA-BSS') { vaMSG = '1 transaction greater than certain monetary threshold received from one originator';}
  else if (ruleNo == 'VA-BSB') { vaMSG = 'Transactions greater than certain monetary threshold over a 2 hour period received from one originator';}
  else if (ruleNo == 'VA-BSD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period received from one originator';}
  else if (ruleNo == 'VA-BSM') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 calendar month period received from one originator';}
  else if (ruleNo == 'VA-BMD') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 day period received from multiple originators';}
  else if (ruleNo == 'VA-BMM') { vaMSG = 'Transactions greater than certain monetary threshold over a 1 calendar month period received from multiple originators';}
  else if (ruleNo == 'VO-OSD') { vaMSG = 'Total number of transactions greater than certain number over a 1 day period paid to one beneficiary';}
  else if (ruleNo == 'VO-OSM') { vaMSG = 'Total number of transactions greater than certain number over a 1 calendar month period paid to one beneficiary';}
  else if (ruleNo == 'VO-OMD') { vaMSG = 'Total number of transactions greater than certain number over a 1 day period paid to multiple beneficiaries';}
  else if (ruleNo == 'VO-OMM') { vaMSG = 'Total number of transactions greater than certain number over a 1 calendar month period paid to multiple beneficiaries';}
  else if (ruleNo == 'VO-BSD') { vaMSG = 'Total number of transactions greater than certain number over a 1 day period received from one originator';}
  else if (ruleNo == 'VO-BSM') { vaMSG = 'Total number of transactions greater than certain number over a 1 calendar month period received from one originator';}
  else if (ruleNo == 'VO-BMD') { vaMSG = 'Total number of transactions greater than certain number over a 1 day period received from multiple originators';}
  else if (ruleNo == 'VO-BMM') { vaMSG = 'Total number of transactions greater than certain number over a 1 calendar month received from multiple originators';}
  else if (ruleNo == 'BL-OSS') { vaMSG = 'Sending to blacklist blocked customer';}
  else if (ruleNo == 'BL-BSS') { vaMSG = 'Receiving from blacklist blocked customer';}
  else if (ruleNo == 'VA-OCM') { vaMSG = 'Comparison of customers declared value versus their actual value of transactions sent';}
  
  else { vaMSG = 'Single transaction greater than certain monetary threshold paid to one beneficiary';}	
return vaMSG;
 }

 app.get('/gender', function (req, res) {
     res.render('gender',
     { title : 'Gender Details', message : 'This shows Customers gender details' }
     )
   })

   
   // Archana's queries :-
   
   // Gender QUERY RESULT

   app.get('/gender1', function (req, res) {
   //var id = req.query.id;
   var sql1 = "SELECT COUNT(gender) Cgender,gender FROM authentication_kycuserdetail GROUP BY gender" ;
   db.query(sql1, function (err, result, fields) {
       if (err) throw err;
     res.render('gender',{ title : 'User Details', users : result} )});})



     // Daily transaction QUERY SUBMISSION

     app.get('/aveValuTransDaily1', function (req, res) {
       res.render('aveValuTransDaily',
       { title : 'Gender Details', message : 'This shows Customers gender details' }
       )
     })

     // Daily transaction QUERY RESULT

     app.get('/aveValuTransDaily2', function (req, res) {
     //var id = req.query.id;
     var sql1 = "SELECT CONCAT(10*floor(amount/10), '-', 10*floor(amount/10) + 10) as `AmountRenge`,  COUNT(*) as count FROM (SELECT amount ,  date(tx_timestamp) , SUBDATE(CURRENT_DATE, 1) FROM transactions_transaction WHERE date(tx_timestamp) = SUBDATE(CURRENT_DATE, 1))as t group by `AmountRenge` ORDER BY AmountRenge ASC" ;

     db.query(sql1, function (err, result, fields) {
         if (err) throw err;
       res.render('aveValuTransDaily',{ title : 'User Details', users : result} )});})


    // Nationality QUERY SUBMISSION

     app.get('/nationality1', function (req, res) {
         res.render('nationality',
         { title : 'Gender Details', message : 'This shows Customers Nationality' }
         )
       })

    // Nationality QUERY RESULT

    app.get('/nationality2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "SELECT b.name COUNTRY, COUNT(nationality) NumberOf FROM authentication_kycuserdetail a, country b WHERE a.country_of_residence = b.id GROUP BY b.name" ;
    db.query(sql1, function (err, result, fields) {
        if (err) throw err;
      res.render('nationality',{ title : 'User Details', users : result} )});})


    // Recidency QUERY SUBMISSION

    app.get('/recidency1', function (req, res) {
        res.render('recidency',
        { title : 'Gender Details', message : 'This shows Customers Nationality' }
        )
       })

    // Recidency QUERY RESULT

    app.get('/recidency2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "SELECT b.name RECIDENCY, COUNT(country_of_residence) NumberOf FROM authentication_kycuserdetail a, country b WHERE a.country_of_residence = b.id GROUP BY b.name" ;
    db.query(sql1, function (err, result, fields) {
        if (err) throw err;
      res.render('recidency',{ title : 'User Details', users : result} )});})


    // Occupation QUERY SUBMISSION

    app.get('/occupation1', function (req, res) {
        res.render('occupation',
        { title : 'Gender Details', message : 'This shows Customers Nationality' }
        )
        })

    // Occupation QUERY RESULT

    app.get('/occupation2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "SELECT B.NAME OCCYPATION, COUNT(work_type) NumberOf  FROM authentication_kycuserdetail A, WORK_TYPE B WHERE A.work_type = B.ID GROUP BY work_type" ;
    db.query(sql1, function (err, result, fields) {
        if (err) throw err;
        res.render('occupation',{ title : 'User Details', users : result} )});})

   // BTC & ETH QUERY SUBMISSION

    app.get('/ethBtcTrans1', function (req, res) {
    res.render('ethBtcTrans',
        { title : 'Gender Details', message : 'This shows Customers Nationality' }
        )
        })

  // BTC & ETH QUERY RESULT

    app.get('/ethBtcTrans2', function (req, res) {
    //var id = req.query.id;
    var sql1 = 'SELECT token,  COUNT(token) Token, CONCAT( DATE_FORMAT(tx_timestamp, "%M"),YEAR(tx_timestamp)) LastMonthDate FROM transactions_transaction WHERE YEAR(tx_timestamp) = YEAR(CURRENT_DATE - INTERVAL 1 MONTH) AND MONTH(tx_timestamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) GROUP BY token, MONTH(tx_timestamp),YEAR(tx_timestamp)';

    db.query(sql1, function (err, result, fields) {
      if (err) throw err;
      res.render('ethBtcTrans',{ title : 'User Details', users : result} )});})


    // Monthly Open Account QUERY SUBMISSION

    app.get('/monthlyOpenAccount1', function (req, res) {
    res.render('monthlyOpenAccount',
      { title : 'Gender Details', message : 'This shows Customers Nationality' }
      )
      })

    // Monthly Open Account QUERY RESULT

    app.get('/monthlyOpenAccount2', function (req, res) {
    //var id = req.query.id;
    var sql1 = 'SELECT COUNT(wallet_open_date) CountOfCustomers , CONCAT( DATE_FORMAT(wallet_open_date, "%M"),YEAR(wallet_open_date))WalletOpenDate FROM authentication_kycuserdetail GROUP BY MONTH(wallet_open_date)' ;

    db.query(sql1, function (err, result, fields) {
    if (err) throw err;
    res.render('monthlyOpenAccount',{ title : 'User Details', users : result} )});})

    // Age renge QUERY SUBMISSION

    app.get('/customersAge1', function (req, res) {
    res.render('customersAge',
      { title : 'Gender Details', message : 'This shows Customers Nationality' }
      )
      })

    // Age renge Account QUERY RESULT

    app.get('/customersAge2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "select concat(10*floor(age/10), '-', 10*floor(age/10) + 10) as `range`, count(*) as count from ( select *, TIMESTAMPDIFF(YEAR,date_of_birth,CURDATE()) AS age from authentication_kycuserdetail ) as t group by `range`" ;

    db.query(sql1, function (err, result, fields) {
      if (err) throw err;
    res.render('customersAge',{ title : 'User Details', users : result} )});})


    // Average Value of Transaction per Last Month QUERY SUBMISSION

    app.get('/aveValueTransMonth1', function (req, res) {
    res.render('aveValueTransMonth',
      { title : 'Gender Details', message : 'This shows Customers Nationality' }
        )
      })

    // Average Value of Transaction per Last Month QUERY RESULT

    app.get('/aveValueTransMonth2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "SELECT CONCAT(100*floor(amount/100), '-', 100*floor(amount/100) + 100) as `AmountRenge`,  COUNT(*) as count FROM (SELECT amount  FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH))as t group by `AmountRenge` ORDER BY AmountRenge ASC" ;

    db.query(sql1, function (err, result, fields) {
    if (err) throw err;
    res.render('aveValueTransMonth',{ title : 'User Details', users : result} )});})


    // Average Volumn of Transaction per Last Month QUERY SUBMISSION

    app.get('/aveVolumnTransMonth1', function (req, res) {
    res.render('aveVolumnTransMonth',
      { title : 'Gender Details', message : 'This shows Customers Nationality' }
        )
      })

    // Average Volumn of Transaction per Last Month QUERY RESULT

    app.get('/aveVolumnTransMonth2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "SELECT CONCAT(5*floor(TransactionCount/5), '-', 5*floor(TransactionCount/5) + 5) as `TransactionCountRenge`,  COUNT(*) as count FROM (SELECT user_id, count(*) as TransactionCount FROM wallet.transactions_transaction  WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE - INTERVAL 1 MONTH) group by user_id)as t group by `TransactionCountRenge` ORDER BY TransactionCountRenge ASC" ;


    db.query(sql1, function (err, result, fields) {
    if (err) throw err;
    res.render('aveVolumnTransMonth',{ title : 'User Details', users : result} )});})
	
    // Industry QUERY RESULT

    app.get('/industry2', function (req, res) {
    //var id = req.query.id;
    var sql1 = "SELECT b.name IndustryName, COUNT(industry) NumberOf FROM authentication_kycuserdetail a, work_industry b WHERE a.industry = b.id GROUP BY b.id" ;
    db.query(sql1, function (err, result, fields) {
      if (err) throw err;
      res.render('industry',{ title : 'User Details', users : result} )});})


 
app.listen(3000)
