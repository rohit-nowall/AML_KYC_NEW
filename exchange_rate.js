
var db = require('./db.njs');
var request = require('request');
//var today = new Date();
var vc = [];
var today = new Date();
var today1 = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){
    dd='0'+dd;
} 
if(mm<10){
    mm='0'+mm;
} 
var today = yyyy+'-'+mm+'-'+dd;
//console.log(today1);

function delete_today() {
    var sqlt = "DELETE FROM exchange_rate WHERE created_date=CURRENT_DATE()";	
   db.query(sqlt, function (errt, resultt, fieldst) { if (errt) throw errt;});
   console.log('Rows deleted');
}

function get_rate(vc1) {
				
						     var token1 = vc1;
							 console.log(token1);
						      request('https://min-api.cryptocompare.com/data/price?fsym=' + token1 + '&tsyms=USD,JPY,EUR', function (error, response, body) {    
							     var obj = JSON.parse(body);
							     console.log(token1);
								 console.log(obj['USD']);
							     var rate = obj['USD'];
							     var sql1 = "INSERT INTO exchange_rate (rate,created_date,from_token,to_token) values ('" + rate + "','" + today + "', '" + token1 + "', 'USD')"; 
								 db.query(sql1, function (err, result, fields) {if (err) throw err;})});						

}

delete_today();
setTimeout(get_rate, 3000, 'ETH');
setTimeout(get_rate, 3000, 'ODN');
setTimeout(get_rate, 3000, 'NOK');
setTimeout(get_rate, 3000, 'ICX');
setTimeout(get_rate, 3000, 'IDEA');
setTimeout(get_rate, 3000, 'PEN');