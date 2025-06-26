require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const db = client.db("parcelDB");
    const parcelsCollection = db.collection("parcels");

    // GET: Get all parcels
    // app.get("/parcels", async (req, res) => {
    //   try {
    //     const allParcels = await parcelsCollection.find().toArray();
    //     res.status(200).send(allParcels);
    //   } catch (error) {
    //     res.status(500).send({ error: "Failed to fetch parcels" });
    //   }
    // });

    // GET /parcels/:id — Get parcel by ID
    app.get("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const parcel = await parcelsCollection.findOne({
          _id: new ObjectId(id),
        });
        if (parcel) {
          res.status(200).send(parcel);
        } else {
          res.status(404).send({ error: "Parcel not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to fetch parcel" });
      }
    });

    // GET: Get all parcels using email
    app.get("/parcels", async (req, res) => {
      try {
        const userEmail = req?.query?.email;
        const query = userEmail ? { created_by: userEmail } : {};
        const options = {
          sort: { createdAt: -1 },
        };

        const parcels = await parcelsCollection.find(query, options).toArray();
        res.status(200).send(parcels);
      } catch (error) {
        res.status(500).send({ error: "Failed to fetch parcels" });
      }
    });

    // POST: Add a new parcel
    app.post("/parcels", async (req, res) => {
      try {
        const parcel = req.body;
        const result = await parcelsCollection.insertOne(parcel);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ error: "Failed to add parcel" });
      }
    });

    // DELETE /parcels/:id — Delete parcel by ObjectId
    app.delete("/parcels/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await parcelsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 1) {
          res
            .status(200)
            .send({ message: "Parcel deleted successfully", result });
        } else {
          res.status(404).send({ error: "Parcel not found" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Failed to delete parcel" });
      }
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Root
app.get("/", (req, res) => {
  res.send("📦 Parcel Server is running");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
