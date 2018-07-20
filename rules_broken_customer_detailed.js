
var db = require('./db.njs');
var transactionvalue = '';

// truncate table
function truncate_table() {
    var sqlt = "truncate table rules_broken_customer_detailed";
   db.query(sqlt, function (errt, resultt, fieldst) { if (errt) throw errt;});
   console.log('Table Truncated');
}

function insert_records() {
    var sql = "SELECT b.user_id,b.id trans_id FROM transactions_transaction b";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;
                        var trans_id = result[i].trans_id;						
						var sql1 = "INSERT INTO rules_broken_customer_detailed (user_id,rules,trans_id) values ('" + user_id + "','|','" + trans_id + "')"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					}
	   
		   }
		   });
		   console.log('user_ids inserted');
}


function rule_VAOSS() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "SELECT * FROM transactions_transaction a,exchange_rate b WHERE amount*rate > " + transactionvalue + " AND STATUS = '1' AND a.token = b.from_token AND DATE_FORMAT(a.tx_timestamp, \"%Y-%m-%d\") = b.created_date";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OSS|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VAOSS');
}

function rule_VAOSD() {
	var user_id1 = '';
	transactionvalue = 10000;
	var sql = "SELECT *  FROM transactions_transaction e,( SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") b,toAddress c  FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date  GROUP BY b,c HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.b and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OSD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VAOSD');
}

function rule_VAOSM() {
	var user_id1 = '';
	transactionvalue = 50000;
	var sql = "SELECT *  FROM transactions_transaction e,( SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b,toAddress c  FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY b,c HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.b and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OSM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VAOSM');
}

function rule_VAOMD() {
	var user_id1 = '';
	transactionvalue = 10000;
	var sql = "SELECT * FROM transactions_transaction WHERE status = '1' and id IN (SELECT id FROM (SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") b  FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY b HAVING a > " + transactionvalue + " )a)";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OMD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VAOMD');
}

function rule_VAOMM() {
	var user_id1 = '';
	transactionvalue = 50000;
	var sql = "select *  from transactions_transaction e,(SELECT SUM(amount*rate) a,fromaddress b, DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY b,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OMM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VAOMM');
}

function rule_VABSS() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "SELECT * FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date and amount*rate > " + transactionvalue + " and status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BSS|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VABSS');
}

function rule_VABSD() {
	var user_id1 = '';
	transactionvalue = 10000;
	var sql = "select *  from transactions_transaction e,(SELECT SUM(amount*rate) a,fromaddress b, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BSD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VABSD');
}

function rule_VABSM() {
	var user_id1 = '';
	transactionvalue = 50000;
	var sql = "select *  from transactions_transaction e,(SELECT SUM(amount*rate) a,fromaddress b, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BSM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VABSM');
}

function rule_VABMD() {
	var user_id1 = '';
	transactionvalue = 10000;
	var sql = "select *  from transactions_transaction e,(SELECT SUM(amount*rate) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BMD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VABMD');
}

function rule_VABMM() {
	var user_id1 = '';
	transactionvalue = 50000;
	var sql = "select *  from transactions_transaction e,(SELECT SUM(amount*rate) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM exchange_rate x1,transactions_transaction x2 where x1.from_token = x2.token AND DATE_FORMAT(x2.tx_timestamp, \"%Y-%m-%d\") = x1.created_date GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BMM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VABMM');
}

function rule_VAOCM() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "select *,e.x5, e.x6 user_id1 from transactions_transaction d , (SELECT SUM(amount*rate) x1, fromaddress x2,DATE_FORMAT(tx_timestamp, \"%M %Y\") x3, c.upper_value x4, first_name x5, a.user_id x6 from exchange_rate x11,authentication_kycuserdetail a, transactions_transaction b,planned_investment c where x11.from_token = b.token AND DATE_FORMAT(b.tx_timestamp, \"%Y-%m-%d\") = x11.created_date and a.wallet_id = b.fromaddress and a.planned_investment=c.id GROUP BY x2,x3) e where DATE_FORMAT(d.tx_timestamp, \"%M %Y\") = e.x3 and d.fromaddress = e.x2  and d.status = '1' order by user_id1";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id1;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OCM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VAOCM');
}

function rule_VABCM() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "select *,e.x5, e.x6 user_id1 from transactions_transaction d , (SELECT SUM(amount*rate) x1, toaddress x2,DATE_FORMAT(tx_timestamp, \"%M %Y\") x3, c.upper_value x4, first_name x5, a.user_id x6 from exchange_rate x11,authentication_kycuserdetail a, transactions_transaction b,planned_investment c where x11.from_token = b.token AND DATE_FORMAT(b.tx_timestamp, \"%Y-%m-%d\") = x11.created_date and a.wallet_id = b.toaddress and a.planned_investment=c.id GROUP BY x2,x3) e where DATE_FORMAT(d.tx_timestamp, \"%M %Y\") = e.x3 and d.toaddress = e.x2  and d.status = '1' order by user_id1";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id1;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BCM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VABCM');
}

function rule_VOOSD() {
	var user_id1 = '';
	transactionvalue = 20;
	var sql = "select *  from transactions_transaction e,(SELECT COUNT(id) a,fromaddress b, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OSD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VOOSD');
}

function rule_VOOSM() {
	var user_id1 = '';
	transactionvalue = 100;
	var sql = "select *  from transactions_transaction e,(SELECT COUNT(id) a,fromaddress b, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY b,c,d HAVING a > " + transactionvalue + ") f where e.fromaddress = f.b and e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OSM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VOOSM');
}


function rule_VOOMD() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "select  COUNT(id1) a,fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d, id1, id3 from ( select *, x2.id2 id1, x1.user_id id3 from transactions_transaction x1,  (SELECT COUNT(id) a, fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d, toaddress e, id id2 FROM transactions_transaction GROUP BY c,d,e HAVING a > 0 order by  fromaddress,amount  ) x2  where x1.id = x2.id2) x3 group by c,d";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var count1 = result[i].a;						
						var trans_id = result[i].id1;
                        var user_id = result[i].id3;						
						if (count1 > 1)
						    {
						   var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OMD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
			                 }
						//console.log(sql1);	
					}
	   
		   }
		   });
		   console.log('Finished rule_VOOMD');
}

function rule_VOOMM() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "select  COUNT(id1) a,fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d, id1, id3 from ( select *, x2.id2 id1, x1.user_id id3 from transactions_transaction x1,  (SELECT COUNT(id) a, fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d, toaddress e, id id2 FROM transactions_transaction GROUP BY c,d,e HAVING a > 0 order by  fromaddress,amount  ) x2  where x1.id = x2.id2) x3 group by c,d";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var count1 = result[i].a;						
						var trans_id = result[i].id1;
                        var user_id = result[i].id3;						
						if (count1 > 1)
						    {
						   var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OMM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
			                 }
						//console.log(sql1);	
					}
	   
		   }
		   });
		   console.log('Finished rule_VOOMM');
}

function rule_VOBSD() {
	var user_id1 = '';
	transactionvalue = 20;
	var sql = "select *  from transactions_transaction e,(SELECT COUNT(id) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %d %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-BSD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VOBSD');
}

function rule_VOBSM() {
	var user_id1 = '';
	transactionvalue = 100;
	var sql = "select *  from transactions_transaction e,(SELECT COUNT(id) a, toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d FROM transactions_transaction GROUP BY c,d HAVING a > " + transactionvalue + ") f where e.toaddress = f.c and DATE_FORMAT(e.tx_timestamp, '%M %Y') = f.d and e.status = '1'";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var user_id = result[i].user_id;						
						var trans_id = result[i].id;						 
						var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-BSM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
					    
					}
	   
		   }
		   });
		   console.log('Finished rule_VOBSM');
}

function rule_VOBMD() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "select  COUNT(id1) a,toaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d, id1, id3 from ( select *, x2.id2 id1, x1.user_id id3 from transactions_transaction x1,  (SELECT COUNT(id) a, fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %d %Y\") d, toaddress e, id id2 FROM transactions_transaction GROUP BY c,d,e HAVING a > 0 order by  toaddress,amount  ) x2  where x1.id = x2.id2) x3 group by c,d";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var count1 = result[i].a;						
						var trans_id = result[i].id1;
                        var user_id = result[i].id3;						
						if (count1 > 1)
						    {
						   var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-BMD|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
			                 }
						//console.log(sql1);	
					}
	   
		   }
		   });
		   console.log('Finished rule_VOBMD');
}

function rule_VOBMM() {
	var user_id1 = '';
	transactionvalue = 5000;
	var sql = "select  COUNT(id1) a,toaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d, id1, id3 from ( select *, x2.id2 id1, x1.user_id id3 from transactions_transaction x1,  (SELECT COUNT(id) a, fromaddress c,DATE_FORMAT(tx_timestamp, \"%M %Y\") d, toaddress e, id id2 FROM transactions_transaction GROUP BY c,d,e HAVING a > 0 order by  toaddress,amount  ) x2  where x1.id = x2.id2) x3 group by c,d";
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  
			  var n = result.length;			  
			  for (i = 0; i < result.length; i++) {					
						var count1 = result[i].a;						
						var trans_id = result[i].id1;
                        var user_id = result[i].id3;						
						if (count1 > 1)
						    {
						   var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OMM|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
			                 }
						//console.log(sql1);	
					}
	   
		   }
		   });
		   console.log('Finished rule_VOOMM');
}

function rule_VAOCH() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from exchange_rate x1,transactions_transaction c, authentication_kycuserdetail d where x1.from_token = c.token AND DATE_FORMAT(c.tx_timestamp, \"%Y-%m-%d\") = x1.created_date and c.fromaddress = d.wallet_id AND MONTH(c.tx_timestamp ) > MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) AND YEAR(c.tx_timestamp ) = YEAR(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 1.5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OCH|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VAOCH');
}

function rule_VABCH() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from exchange_rate x1,transactions_transaction c, authentication_kycuserdetail d where x1.from_token = c.token AND DATE_FORMAT(c.tx_timestamp, \"%Y-%m-%d\") = x1.created_date and c.toaddress = d.wallet_id AND MONTH(c.tx_timestamp ) > MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) AND YEAR(c.tx_timestamp ) = YEAR(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 1.5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BCH|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VABCH');
}



function rule_VOOCH() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT COUNT(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id AND MONTH(c.tx_timestamp ) > MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) AND YEAR(c.tx_timestamp ) = YEAR(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 1.5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OCH|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VOOCH');
}


function rule_VOBCH() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT COUNT(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c, authentication_kycuserdetail d where c.toaddress = d.wallet_id AND MONTH(c.tx_timestamp ) > MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) AND YEAR(c.tx_timestamp ) = YEAR(DATE_ADD(CURRENT_DATE(), INTERVAL -6 MONTH)) group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 1.5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-BCH|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VOBCH');
}


function rule_VAOCP() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from exchange_rate x1,transactions_transaction c, authentication_kycuserdetail d  where x1.from_token = c.token AND DATE_FORMAT(c.tx_timestamp, \"%Y-%m-%d\") = x1.created_date and c.fromaddress = d.wallet_id group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-OCP|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VAOCP');
}


function rule_VABCP() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT SUM(amount*rate) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from exchange_rate x1,transactions_transaction c, authentication_kycuserdetail d where x1.from_token = c.token AND DATE_FORMAT(c.tx_timestamp, \"%Y-%m-%d\") = x1.created_date and c.toaddress = d.wallet_id group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VA-BCP|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VABCP');
}

function rule_VOOCP() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT COUNT(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-OCP|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VOOCP');
}

function rule_VOBCP() {
	
	var sql = "SELECT SUM(a)/COUNT(*) f FROM (SELECT COUNT(id) a,DATE_FORMAT(tx_timestamp, \"%M %Y\") b, tx_timestamp from transactions_transaction c, authentication_kycuserdetail d where c.toaddress = d.wallet_id group by b order by tx_timestamp) a";
						
	db.query(sql, function (err, result, fields) { if (err) throw err;
	if (result) 
		   {  	var trans_count1 = result[0].f;						 
						var sql1 = "SELECT COUNT(id) a from transactions_transaction c, authentication_kycuserdetail d where c.fromaddress = d.wallet_id and MONTH(tx_timestamp ) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp ) = YEAR(CURRENT_DATE())"; 
						db.query(sql1, function (err1, result1, fields1) {if (err1) throw err1;						
						var trans_count2 = result1[0].a;
						if (trans_count2 > 5*trans_count1)
						//if (trans_count2 < trans_count1)	
						{   var user_id1 = '';
							var sql = "SELECT * FROM transactions_transaction WHERE MONTH(tx_timestamp) = MONTH(CURRENT_DATE()) AND YEAR(tx_timestamp) = YEAR(CURRENT_DATE())";
							db.query(sql, function (err, result, fields) { if (err) throw err;
							if (result) 
								   {  
									  var n = result.length;			  
									 var user_id = result[i].user_id;						
									var trans_id = result[i].id;						 
									var sql1 = "UPDATE rules_broken_customer_detailed SET rules = CONCAT(rules, '|VO-BCP|') WHERE user_id='" + user_id + "' and trans_id='" + trans_id + "'"; db.query(sql1, function (err, result, fields) {if (err) throw err;});
															   
								   }
								   });
							
						}
						console.log(trans_count1);
						console.log('test');
						console.log(trans_count2);
					    });
					   
		   }
		   });
		   console.log('Finished rule_VOBCP');
}



truncate_table();


setTimeout(insert_records, 3000);


setTimeout(rule_VAOSS, 6000);



setTimeout(rule_VAOSD, 6000);

setTimeout(rule_VAOSM, 6000);

setTimeout(rule_VAOMD, 6000);

setTimeout(rule_VAOMM, 6000);

setTimeout(rule_VABSS, 6000);

setTimeout(rule_VABSD, 6000);

setTimeout(rule_VABSM, 6000);

setTimeout(rule_VABMD, 6000);

setTimeout(rule_VABMM, 6000);

setTimeout(rule_VOOSD, 6000);

setTimeout(rule_VOOSM, 6000);

setTimeout(rule_VOOMD, 6000);

setTimeout(rule_VOOMM, 6000);

setTimeout(rule_VOBSD, 6000);

setTimeout(rule_VOBSM, 6000);

setTimeout(rule_VOBMD, 6000);

setTimeout(rule_VOBMM, 6000);

setTimeout(rule_VOOCP, 6000);

setTimeout(rule_VOBCP, 6000);

setTimeout(rule_VAOCP, 6000);

setTimeout(rule_VABCP, 6000);

setTimeout(rule_VAOCH, 6000);

setTimeout(rule_VABCH, 6000);

setTimeout(rule_VOOCH, 6000);

setTimeout(rule_VOBCH, 6000);

setTimeout(rule_VABCM, 6000);

setTimeout(rule_VAOCM, 6000);

setTimeout(rule_VOOMD, 6000);

