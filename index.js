const express = require('express');
const app = express();
const port = process.env.PORT || 5500;
const bcrypt = require('bcrypt');
const path = require('path');
const cors = require('cors'); 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://nurmahfuzah03:Mahfuzah03@mahfuzah03.blu6t3a.mongodb.net/?retryWrites=true&w=majority&appName=Mahfuzah03";

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
    console.log('Connected successfully to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}

run().catch(console.dir);

app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

app.post('/register', async (req, res) => {
  try {
    const hash = bcrypt.hashSync(req.body.password, 10);
    let result = await client.db('Mahfuzah03').collection('Registration').insertOne({
      username: req.body.username,
      password: hash,
      name: req.body.name,
      email: req.body.email
    });
    res.send('Successfully Registered');
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Registration failed');
  }
});

app.post('/login', async (req, res) => {
  try {
    let result = await client.db("Mahfuzah03").collection("Registration").findOne({
      username: req.body.username
    });

    if (!result) {
      res.status(404).send("Username not found");
    } else {
      if (bcrypt.compareSync(req.body.password, result.password)) {
        res.send("Login successfully");
      } else {
        res.status(401).send("Wrong password");
      }
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).send('Login failed');
  }
});

app.patch('/updateUser', async (req, res) => {
  try {
    const { currentUsername, updatedInfo } = req.body;
    
    // Check if the currentUsername exists in the database
    const user = await client.db('Mahfuzah03').collection('Registration').findOne({ username: currentUsername });
    if (!user) {
      return res.status(404).send('User not found');
    }
    
    // Hash the updated password if it exists
    if (updatedInfo.password) {
      updatedInfo.password = bcrypt.hashSync(updatedInfo.password, 10);
    }
    
    // Update the user's information
    const updateResult = await client.db('Mahfuzah03').collection('Registration').updateOne(
      { username: currentUsername },
      { $set: updatedInfo }
    );

    if (updateResult.modifiedCount === 1) {
      res.send('User information updated successfully');
    } else {
      res.status(500).send('Failed to update user information');
    }
  } catch (err) {
    console.error('Error during user update:', err);
    res.status(500).send('Internal server error');
  }
});

app.delete('/deleteUser/:username', async (req, res) => {
  try {
    const username = req.params.username;

    // Delete the user account from the database
    const deleteResult = await client.db('Mahfuzah03').collection('Registration').deleteOne({ username });

    if (deleteResult.deletedCount === 1) {
      res.send('User account deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error('Error deleting user account:', err);
    res.status(500).send('Internal server error');
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assignment.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
