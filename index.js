const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      var token = jwt.sign({
        _id: result._id,
        username : result.username
      }, 'mysupersecretpasskey',{expiresIn: 10*60});
      res.send(token)
    }else{
      res.send("Wrong password")
    }
  }
  console.log(result)

})

app.post('/buy', async (req, res) => {
  const token=(req.headers.authorization.split(' ')[1])

  var decoded = jwt.verify(token, 'mysupersecretpasskey');
  console.log(decoded)
})
// get user profile
app.get('/user/:id', async (req, res) => {
  // findOne)
  const token=(req.headers.authorization.split(' ')[1])
  let decoded = jwt.verify(token, 'mysupersecretpasskey');

  if (decoded) {
    if (decoded._id == req.params.id){
      let result = await client.db('maybank2u').collection('users').findOne({
        _id: new ObjectId(req.params.id)  
      })
      res.send(result)
    }else{
      res.status(401).send('Unauthorized Access') 
    }
  }
}); // Add closing parenthesis and semicolon here

// update user account
app.patch('/user/:id', async (req, res) => {
  // updateOne
  let result = await client.db('maybank2u').collection('users').updateOne()
  {
    _id: new  ObjectId(req.params.id)
  }
  {
    $set: {
      name: req.body.name
    }
  }
      
})

// delete user account
app.delete('/user/:id', (req, res) => {
  //let result = await client.db('maybank2u').collection('users').deleteOne(
   // {
    //  _id: ObjectId(req.params.id)
  //  }
 // )
})

app.listen(port, () => {
  console.log("Example app listening on port ${port}")
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    // Connect the client to the server  (optional starting in v4.7)
    await client.connect();
    console.log('Connected successfully to MongoDB')
  } finally {
  }
}
run().catch(console.dir);