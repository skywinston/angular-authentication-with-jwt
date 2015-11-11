require('dotenv').load();
var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

// In lieu of a database, we're just going to include a user object here.
var user = {
  username: 'skywinston',
  password: 'p'
};

var app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({secret: process.env.JWTTOKEN}).unless({path: ['/login']})); // This totally broke the get random user function.  
app.use(express.static(__dirname + '/public'));

app.get('/random-user', function(req, res){
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

// Use the authenticate middleware function to see if the user exists.
// We've hardcoded a user insteaad of making a call to a DB.
app.post('/login', authenticate, function(req, res){
  console.log("Authenticated!");
  // Encode the user with JWT
  // We are not including everything that the JWT spec recommends, so we would actually need more here.
  var token = jwt.sign({
    username: user.username
  }, process.env.JWTTOKEN)
  res.send({
    token: token,
    user: user // You would never actually send this in the payload as it has the password, but whatevs...
  });
})

app.listen(3000, function(){
  console.log("App listening on port 3000...");
});

// UTIL FUNCTIONS

function authenticate(req, res, next){
  var body = req.body;
  console.log(body);
  if (!body.username || !body.password){
    res.status(400).send('Must provide username or password');
  }
  if (body.username !== user.username || body.password !== user.password){
    res.status(401).send('Username or password incorrect');
  }
  next();
}
