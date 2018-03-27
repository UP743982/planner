let express = require("express");
let app = express();
let path = require('path');
let bodyParser = require("body-parser");


app.get('/', function(req, resp) {
	resp.sendFile('index.html', {root: path.join(__dirname)});
})


app.listen(8080);
console.log('Server is running..');