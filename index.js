require("dotenv").config()
const express = require('express')
const app = express()
const port = 3000;
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors({
  origin: ["http://localhost:5173", "https://focura-waitlist.netlify.app/"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.MONGO_NAME}:${process.env.MONGO_PASS}@cluster-1.atolsgl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster-1`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const db = client.db("waitlist");
    const emailCollection = db.collection("emails");

    app.post("/waitlist-email", async (req, res) => {
  const { email } = req.body;

  const existing = await emailCollection.findOne({ email });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Email already in waitlist"
    });
  }

  const result = await emailCollection.insertOne({ email });

  res.status(200).json({
    success: true,
    message: "Email added",
    result
  });
});

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
