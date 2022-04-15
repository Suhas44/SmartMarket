const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { read } = require('fs');
const app = express();

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://MongoTest:MongoTester1@cluster0.5oqhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

// Sending registering users to MongoDB
app.post('/index', async(req, res) => {
    console.log(req.body)
    writeToAtlas(req.body);
    res.json({ status: 'ok' })
});

/*
*** This is an example of posting data, I will keep this here for reference. The corresponding FETCH command is in list.html***
app.post('/theusers', async(req, res) => {
  res.json({ status: 'ok' })
  console.log("the thing: " + req.body.username);
  readAtlas("username", req.body.username);
});
*/

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

function readAtlas(username, user) {
  MongoClient.connect(url, async function(err, db) {
    var dbo = db.db("Users");
    c = dbo.collection("List");
    r = await c.find({username:user}).toArray();
  });
}

async function readAtlasAll() {
  const db = await MongoClient.connect(url);
  const dbo = db.db("Users");
  const c = dbo.collection("List");
  const r = await c.find({}).toArray();
  console.log(r);
  return r;
}

readAtlasAll().then(r => {
 console.log(r);
}).catch(err => {
  console.log(err);
});