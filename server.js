const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
var request = require("request");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://MongoTest:MongoTester1@cluster0.5oqhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'public/pages')));
app.use(bodyParser.json());

// Sending registering users to MongoDB
app.post('/register', async(req, res) => {
  const duplicate = await readAtlasUser(req.body.username).then(r => {
    if (r[0] != null) {
      res.json({status: false, message: 'Username already exists'});
    } else {
      req.body.portfolios = {};
      writeToAtlas(req.body);
      res.json({status: true, message: 'User registered'});
    }
  });
});

// Authenticating a User from Login
app.post('/auth', async(req, res) => {
  var user = req.body;
  const authenticated = await authenticateUser(user.username, user.password).then(r => {
    return (r[0]) ? res.json({status: true, message: 'User authenticated', user: r[1]}) : res.json({status: false, message: 'User not authenticated'});
  });
});

// Loading users from MongoDB
app.post('/search', async(req, res) => {
  var ticker = req.body.ticker;
  await getStockPrice(ticker).then(r => {
    res.json(r);
  }).catch(err => {
    console.log("AN ERROR OCCURRED");
    console.log(err);
  });
});

app.post('/update', async(req, res) => {
  const user = req.body;
  const updated = await updateAtlas(user).then(r => {
    res.json({status: true, message: 'User updated'});
  }).catch(err => {res.json({status: false, message: 'An error has occured'});});
});

app.listen(9999, () => {
  console.log('Server up at port 9999');
});

async function writeToAtlas(obj) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("Users");
      var collection = dbo.collection("List");
      collection.insertOne(obj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
}

async function readAtlasUser(username) {
  const db = await MongoClient.connect(url);
  const dbo = db.db("Users");
  const c = dbo.collection("List");
  const r = await c.find({"username" : username}).toArray();
  if (r.length == 0) {
    r.push(null);
  }
  return r;
}

async function updateAtlas(client) {
  const db = await MongoClient.connect(url);
  const dbo = db.db("Users");
  const c = dbo.collection("List");
  const r = await c.updateOne({"username" : client.user.username}, {$set: {portfolios : client.user.portfolios}}).then(r => {console.log("Updated Portfolio")});
  return r;
}

async function authenticateUser(username, password) {
  const user = await readAtlasUser(username).then(r => {
    return r[0];
  });
  const authenticated = (user != null) ? (user.password == password) : false;
  return [authenticated, user];
};

async function getStockPrice(symbol) {
  return new Promise ((resolve) => {
    var query = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.API_KEY}`;
    request.get(
      {url: query, json: true, headers: { "User-Agent": "request" }},
      (err, res, data) => {
          resolve ((err || res.statusCode != 200) ? ("There has been an error") : ((data["Global Quote"]["05. price"] != undefined) ? (data["Global Quote"]["05. price"]) : (`${symbol} is not a valid ticker`)));
      }
    );
  });
}