const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;


const app = express();
const port = process.env.PORT || 5000;

// MiddleWare
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.17stq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("WildernessTrekking");
    const toursCollection = database.collection("tourDetails");
    const bookingCollection = database.collection("bookingDetails");
    console.log("db");

    //   get API: show all data
    app.get("/tours", async (req, res) => {
      const query = {};
      const cursor = toursCollection.find(query);
      const tours = await cursor.toArray();
      res.send(tours);
    });

      // get API : single data
      app.get("/tours/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const tourDetail = await toursCollection.findOne(query);
        res.send(tourDetail);
      });

      // post API : booking information
      app.post("/orders", async (req, res) => {
        const booking = req.body;
        const result = await bookingCollection.insertOne(booking);
        console.log(result);
        res.json(result);
      });
    
    // all bookings
    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = bookingCollection.find(query);
      const bookings = await cursor.toArray();
      res.send(bookings);
    });

    // delete my booking
     app.delete("/myorders/:id", async (req, res) => {
       const id = req.params.id;
       const query = { _id: ObjectId(id) };
       const result = await bookingCollection.deleteOne(query);
       res.send(result);
     });
    
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("running");
});

app.listen(port, () => {
  console.log("running from port:", port);
});
