var low = require("lowdb");
var fs = require("fs");
var unirest = require("unirest");
var status = require("node-status");

module.exports = {
	db: null,



	list: function(){
		var values = this.db.get("sites").value();
		if(values.length == 0){
			console.log("No sites");
			
		}else{
			
			for(var i = 0; i < values.length; i++){
				console.log(values[i].name + ": Site is at " + values[i].hash);
			}
		}

		//process.exit(0);

	},

	add: function(path, name){
		var results = this.db.get("sites").filter({"name": name}).value();
		if(results.length == 0){
			console.log("Uploading " + path + " as " + name);
			this._sendToServer(name, "add", path);
		}else{
			console.log("Updating " + results[0].name + " with contents in " + path);
			this._sendToServer(name, "update", path);
		}

		
	},

	remove: function(name){
		var values = this.db.get("sites").filter({"name": name}).value();
		if(values.length == 0){
			console.log("Could not find site: " + name);
			process.exit(0);
		}else{
			console.log("Removing site: " + values[0].name);
			this._sendToServer(values[0].name, "delete", null, values[0].hash);
			//process.exit(0);
		}
	},

	setDB: function(source){
		this.db = low(source);
		this.db.defaults({ sites: []}).write();

	},

	_sendToServer: function(name, type, path = null, hash = null){
		if(type == "add" || type == "update"){
			console.log(name);
			console.log(type);
			console.log(path);
			var returnHash = "";
			var self = this;
			unirest.post('http://127.0.0.1:5000/sites/')
					.header('Accept', 'application/json')
					.attach('site', fs.createReadStream(path))   
					.end(function (response) {
						console.log(response.body);
					  	if(response.code !== 200){
					  		console.error("Error: " + response.body.error);
					  	}else{
					  		if(type == "add"){
					  			self.db.get("sites").push({"name":name, "hash": response.body.site}).write();
					  		}
					  		if(type == "update"){
					  			self.db.get("sites").find({"name": name}).assign({"hash": response.body.site}).write();
					  		}
					  	}
					  	process.exit();
					});
		}

		if(type == "delete"){
			unirest.delete("http://127.0.0.1:5000/sites/" + hash)
					.header("Accept", 'application/json')
					.end(function(response){
						if(response.code !== 200){
							console.error(response.body.error);
						}else{
							this.db.get("sites").remove({"name":name}).write();
						}

						process.exit(0);
					});
		}

	}
}