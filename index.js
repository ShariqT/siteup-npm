#!/usr/bin/env node
var program = require("commander");
var cli = require("./lib/cli.js");
cli.setDB(__dirname + "/prod.db.json");

program.command('list')
		.description('lists all live sites on servers.')
		.action(function(){
			cli.list();
			process.exit();
		});

program.command("add <file> <name>")
		.description("Uploads a file to the siteup servers. Must be a zip file.")
		.action(function(file, name){
			cli.add(file, name);
			//process.exit();
		});

program.command("rm <name>")
		.description("Removes a site from the siteup servers.")
		.action(function(name){
			cli.remove(name);
			//process.exit();
		});

program.parse(process.argv);