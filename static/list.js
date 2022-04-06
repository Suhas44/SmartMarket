var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://MongoTest:MongoTester1@cluster0.5oqhq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri)

async function findOneListingByName(client, name) {
    const result = await client.db('Users').collection('List').findOne({name: name});
    if (result) {
        console.log(result);
    } else {
        console.log("No result found");
    }
}
findOneListingByName(client, 'Suhas');