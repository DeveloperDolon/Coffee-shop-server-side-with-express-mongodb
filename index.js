
require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DATA_USERNAME}:${process.env.DATA_PASSWORD}@cluster0.evacz3b.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("insertCoffeeItems").collection("coffeeItemsCollection");
    const userCollection = client.db("insertCoffeeItems").collection("usersCollection");


    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);

      res.send(result);
    })

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();

      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.deleteOne(query);

      res.send(result);
    })

    app.patch("/users", async (req, res) => {
      const data = req.body;
      const filter = {email : data.email};

      const updatedItem = {
        $set:{
          lastSignInTime: data.lastSignInTime
        }
      }

      const result = await userCollection.updateOne(filter, updatedItem);
      res.send(result);
    })

    app.post("/coffees", async (req, res) => {
        const item = req.body;
        
        const result = await coffeeCollection.insertOne(item);
        res.send(result);
    })

    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};

      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    })

    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};

      const updatedItem = {
        $set: {
          name: item.name,
          supplier: item.supplier,
          category: item.category,
          chef: item.chef,
          taste: item.taste,
          details: item.details,
          photoUrl: item.photoUrl
        }
      }

      const result = await coffeeCollection.updateOne(filter, updatedItem, option);
      res.send(result);
    })

    app.get("/coffees", async (req, res) => {
        const cursor = coffeeCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Welcome to my coffee shop server!");
})

app.listen(port, () => {
    console.log(`Welcome to my coffee shop server : ${port}`);
})