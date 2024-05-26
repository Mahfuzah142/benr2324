const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nurmahfuzah03:Mahfuzah03@mahfuzah03.blu6t3a.mongodb.net/?retryWrites=true&w=majority&appName=Mahfuzah03";

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
    await client.connect();
    console.log('Connected successfully to MongoDB')
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.use(express.json())

app.post('/register',async (req, res) => {
  const hash = bcrypt.hashSync(req.body.password, 10);
  let result = await client.db('Mahfuzah03').collection('Registration').insertOne(
    {
      username: req.body.username,
      password: hash,
      name: req.body.name,
      email: req.body.email
    }
  )
  res.send('Successfully Registered')
})


app.post('/login',async(req, res) => {
 // usename: req.body.username
  //password: req.body.password

  //step 1: check if username exist
  let result = await client.db("Mahfuzah03").collection("Registration").findOne(
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
  let result = await client.db('Mahfuzah03').collection('Registration').findOne({
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
   console.log(`Example app listening on port ${port}`)

})





