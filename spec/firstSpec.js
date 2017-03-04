var intercept = require("intercept-stdout");
var p = require("../lib/cli.js");
var low = require("lowdb");
describe("Command line options", function() {
	
	
  	it("expects to have a list command", function() {
  		
		var captured_text = "";
		var unhook_intercept = intercept(function(txt) {
		    	captured_text += txt;
		});
		p.setDB(__dirname + "/test.db.json");
  		p.list();
  		unhook_intercept();
    	expect(captured_text.trim(" ")).toContain("test");
  	});


  	it("expects to have an add command", function(){
  		var captured_text = "";
		var unhook_intercept = intercept(function(txt) {
		    	captured_text += txt;
		});
		

  		p.add("/var/path/to/file", "test2");
  		unhook_intercept();
  		expect(captured_text.trim(" ")).toContain("Uploading /var/path/to/file as test2");
  	});

  	it("expects to show an updating message when a name is already taken", function(){
  		var captured_text = "";
		var unhook_intercept = intercept(function(txt) {
		    	captured_text += txt;
		});
		
		p.add("/var/one/file", "test");
		unhook_intercept();

  		expect(captured_text.trim(" ")).toContain("Updating test with contents in /var/one/file");
  	});

  	it("expects to have a rm command", function(){
  		var captured_text = "";
		var unhook_intercept = intercept(function(txt) {
		    	captured_text += txt;
		});
		

  		p.remove("test");
  		unhook_intercept();
  		expect(captured_text.trim(" ")).toContain("Removing site: test");
  	});

  	it("expects to show error message when you try to remove a site that is not there", function(){
  		var captured_text = "";
		var unhook_intercept = intercept(function(txt) {
		    	captured_text += txt;
		});
		

  		p.remove("test2");
  		unhook_intercept();
  		expect(captured_text.trim(" ")).toContain("Could not find site: test2");
  	});

});