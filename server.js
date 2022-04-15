const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.post('/index', async(req, res) => {
    console.log(req.body)
    writeToAtlas(req.body);
    res.json({ status: 'ok' })
});

app.post('/theusers', async(req, res) => {
  console.log(req)
  res.json({ status: 'ok' })
});

app.listen(9999, () => {
        console.log('Server up at port 9999');
});

async function writeToAtlas(obj) {
    console.log("CALLED!");
    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb+srv://MongoTest:MongoTester1@cluster0.5oqhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
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

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://MongoTest:MongoTester1@cluster0.5oqhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
MongoClient.connect(url, async function(err, db) {
  var dbo = db.db("Users");
  c = dbo.collection("List");
  r = await c.find({"username" : "Suhas"}).toArray();
  console.log(r[0]);
});

