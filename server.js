const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
app.use('/', express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());

app.post('/api/register', async(req, res) => {
    console.log(req.body)
    writeToAtlas(req.body);
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
      var dbo = db.db("Users");
      dbo.collection("List").insertOne(obj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });
}