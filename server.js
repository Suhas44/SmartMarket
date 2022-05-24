const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

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
      writeToAtlas(req.body);
      res.json({status: true, message: 'User registered'});
    }
  });
});

// Loading users from MongoDB
app.get('/list', async(req, res) => {
  readAtlasAll().then(r => {
    res.json(JSON.stringify(r));
   }).catch(err => {
     console.log(err);
   });
});

// Authenticating a User from Login
app.post('/auth', async(req, res) => {
  var user = req.body;
  console.log(user);
  const authenticated = await authenticateUser(user.username, user.password).then(r => {
    return (r) ? res.json({status: true, message: 'User authenticated'}) : res.json({status: false, message: 'User not authenticated'});
  });
});

/*
app.get('/transferuser', async(req, res) => {
  const user = readAtlasUser(req.body.username).then(r => {
    postData(r);
  });
});

function postData(r) {
  app.post('/loaduser', async(req, res) => {
    console.log("sending user data");
    res.json({username: r[0].username, password: r[0].password});
  });
}
*/

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

async function readAtlasAll() {
  const db = await MongoClient.connect(url);
  const dbo = db.db("Users");
  const c = dbo.collection("List");
  const r = await c.find({}).toArray();
  return r;
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

async function authenticateUser(username, password) {
  const result = await readAtlasUser(username).then(r => {
    return (r[0] != null) ? (r[0].password == password) : false;
  });
  return result;
};