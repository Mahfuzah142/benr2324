const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');

app.use(express.json())
// new user registration
app.post('/user', async (req, res) => {
  // console.log(req.body)

  const hash = bcrypt.hashSync(req.body.password, 10);
  let result = await client.db('maybank2u').collection('users').insertOne(
    {
      username: req.body.username,
      password: hash,
      name: req.body.name,
      email: req.body.email
    }
  )
  res.send(result)
})

app.post('/login',async(req, res) => {
  //usename: req.body.username
  //password: req.body.password

  //step 1: check if username exist
  let result = await client.db("maybank2u").collection("users").findOne(
  {
    username: req.body.username
  })
  
  if(!result) {
    res.send("username not found")
  }else{
    //Step 2: Check if password is correct
    //result.password = req.body.password

    if(bcrypt.compareSync(req.body.password, result.password) == true){
      res.send("Login successfully")
    }else{
      res.send("Wrong password")
    }
  }
  console.log(result)

})

// get user profile
app.get('/user/:siapadia/:emaildia', async (req, res) => {
  // findOne
  let result = await client.db('maybank2u').collection('users').findOne({
    username: req.params.siapadia,
    email: req.params.emaildia
  })
  res.send(result)
})

// update user account
app.patch('/user', (req, res) => {
  // updateOne
  console.log('update user profile')
})

// delete user account
app.delete('/user', (req, res) => {
  // deleteOne
  console.log('delete user account')
})

app.listen(port, () => {
  console.log("Example app listening on port ${port}")
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://soo:passwordbaharu@cluster0.nehnjjb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Connect the client to the server  (optional starting in v4.7)
    await client.connect();
    console.log('Connected successfully to MongoDB')
  } finally {
  }
}
run().catch(console.dir);