const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i9zoefc.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    // collections here
    const todoCollection = client.db("scic_todo_task").collection("all_todo");

    app.post("/all-todo", async (req, res) => {
      const todo = req.body;
      const result = await todoCollection.insertOne(todo);
      res.send(result);
    });

    app.get("/all-todo", async (req, res) => {
      const result = await todoCollection.find().toArray();
      res.send(result);
    });

    app.patch("/onGoing/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "onGoing",
        },
      };
      const result = await todoCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/complete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "complete",
        },
      };
      const result = await todoCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.patch("/todo/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "todo",
        },
      };
      const result = await todoCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    app.delete("/delete-task", async (req, res) => {
      const data = req.query;
      const filter = { _id: new ObjectId(data.id) };
      const findData = await todoCollection.findOne(filter);
      if (findData.email === data.email) {
        const result = await todoCollection.deleteOne(filter);
        res.send(result);
      } else {
        res.send({ message: false });
      }
    });

    app.get("/todo-data/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.findOne(query);
      res.send(result);
    });

    app.patch("/one-todo", async (req, res) => {
      const data = req.body;
      const query = { _id: new ObjectId(data.id) };
      const updateDoc = {
        $set: {
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          priority: data.priority
        },
      };
      const result = await todoCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("app is running on server");
  });
  
  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
  });
  