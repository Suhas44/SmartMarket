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
app.post('/index', async(req, res) => {
    console.log(req.body);
    writeToAtlas(req.body);
    res.json({ status: 'ok' });
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
app.get('/auth', async(req, res) => {
});

app.listen(9999, () => {
  console.log('Server up at port 9999');
});

async function writeToAtlas(obj) {
    console.log("CALLED!");
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      console.log("Im inside now")
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
  console.log(r);
  return r;
}

async function readAtlasAll() {
  const db = await MongoClient.connect(url);
  const dbo = db.db("Users");
  const c = dbo.collection("List");
  const r = await c.find({}).toArray();
  return r;
}