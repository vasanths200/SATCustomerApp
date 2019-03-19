/* var insVl = {};
	insVl['property'] = "AWS test";
	insVl['value'] = "152";
	
	LDB.insertUpdate("login_user_info",insVl);
	LDB.executeQuery("insert into login_user_info ('property','value') values ('bbb','002')"); */


var LDB = {
db: null,
createDatabase: function(){
	
		this.db = window.openDatabase(
			"sat_localdb.db",
			"1.0",
			"SAT Local DB",
			1000000);
			
		this.db.transaction(
			function(tx){
				//Run sql here using tx
				
				tx.executeSql(
					"CREATE TABLE IF NOT EXISTS login_user_info (id INTEGER PRIMARY KEY, property TEXT NOT NULL UNIQUE, value TEXT,updated_at DATETIME )",
					[],
					function(tx, results){},
					function(tx, error){
						console.log("Error while creating the table: " + error.message);
					}
				);
			},
			function(error){
				console.log("Transaction error: " + error.message);
			},
			function(){
				console.log("Create DB transaction completed successfully");
			}
		);

	},executeQuery: function(qryStr,get_option_callback,valArgs){
	
		if(typeof(valArgs) == "undefined") valArgs = [];
			
		this.db = window.openDatabase(
			"sat_localdb.db",
			"1.0",
			"SAT Local DB",
			1000000);
			
		this.db.transaction(
			function(tx){
				//Run sql here using tx

				tx.executeSql(
					qryStr,
					valArgs,
					function(tx, results){ 
					
						//item = results.rows.item(0);
						
						if(typeof(get_option_callback) != "undefined" && get_option_callback != '') get_option_callback(results);
						
						return;

					},
					function(tx, error){
						console.log("Error while creating the table: " + error.message);
					}
				);
				
				
			},
			function(error){
				console.log("Transaction error: " + error.message);
			},
			function(){
				console.log("Query exicuted successfully");
			}
		);

	},
	selectObj2Obj: function(inpObj,keyAs){
		 var len = inpObj.rows.length;			 
		 var optObj = {};
		
		if(typeof(keyAs) == "undefined") keyAs = "id";
		
		 if(len > 0)
		 {				 
			 for(var n = 0; n < len; n++){
				 
				 optObj[inpObj.rows.item(n)[keyAs]] = inpObj.rows.item(n);
			 }
		 }	   	   
		 
		 return optObj;
	},
	insertUpdate:function(table,dataObj){
		
		var valusAra = Object.values(dataObj);
		var colAra = Object.keys(dataObj);
		
		var qryStr = "INSERT OR REPLACE INTO login_user_info ("+ colAra.join(',') +") VALUES(?, ?)";
		
		this.executeQuery(qryStr,'',valusAra);		
	}
};