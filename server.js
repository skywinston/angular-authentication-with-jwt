var express = require('express');
var faker = require('faker');
var cors = require('cors');

var app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());
app.use(express.static(__dirname + '/public'));

app.get('/random-user', function(req, res){
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

app.listen(3000, function(){
  console.log("App listening on port 3000...");
});
