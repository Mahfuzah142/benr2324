const express = require('express');
const app = express();
const port = process.env.PORT || 5500;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const cors = require('cors'); 

const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');
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

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "999", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.tokenData = decoded;
    next();
  });
}

app.post('/user', async (req, res) => {
  try {
    let existingPlayer = await client.db("Mahfuzah03").collection("player").findOne({ username: req.body.username });
    let existingAdmin = await client.db("Mahfuzah03").collection("admin").findOne({ username: req.body.username });

    if (existingPlayer || existingAdmin) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const role = req.body.password === 'sayaadmintau' ? 'admin' : 'player';
    const hash = bcrypt.hashSync(req.body.password, 10);

    let result = await client.db("Mahfuzah03").collection(role).insertOne({
      username: req.body.username,
      password: hash,
      name: req.body.name,
      email: req.body.email,
      role: role
    });

    res.status(201).json(result);
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  try {
    console.log('Login attempt for username:', req.body.username);

    let user = await client.db("Mahfuzah03").collection("player").findOne({
      username: req.body.username
    });

    if (!user) {
      console.log('Username not found in player collection, checking admin collection');

      user = await client.db("Mahfuzah03").collection("admin").findOne({
        username: req.body.username
      });

      if (!user) {
        console.log('Username not found in admin collection');
        return res.status(404).json({ error: "Username not found" });
      }
    }

    console.log('User found:', user);

    if (bcrypt.compareSync(req.body.password, user.password)) {
      console.log('Password match');
      const role = user.role;
      const token = jwt.sign({ username: user.username, role: role }, "999", { expiresIn: '1h' });
      res.json({ message: "Login successful", token, role });
    } else {
      console.log('Password mismatch');
      res.status(401).json({ error: "Wrong password" });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.patch('/updateUser', async (req, res) => {
  try {
    const { currentUsername, updatedInfo } = req.body;

    let user = await client.db('Mahfuzah03').collection('player').findOne({ username: currentUsername });
    let collection = 'player';

    if (!user) {
      user = await client.db('Mahfuzah03').collection('admin').findOne({ username: currentUsername });
      collection = 'admin';

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    if (updatedInfo.password) {
      updatedInfo.password = bcrypt.hashSync(updatedInfo.password, 10);
    }

    updatedInfo.role = user.role; // Ensure role is not changed

    console.log(`Updating ${collection} user: ${currentUsername}`, updatedInfo);

    const updateResult = await client.db('Mahfuzah03').collection(collection).updateOne(
      { username: currentUsername },
      { $set: updatedInfo }
    );

    if (updateResult.modifiedCount === 1) {
      res.json({ message: 'User information updated successfully' });
    } else {
      console.error(`Failed to update user information for ${currentUsername}`);
      res.status(500).json({ error: 'Failed to update user information' });
    }
  } catch (err) {
    console.error('Error during user update:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/requestDeleteToken', async (req, res) => {
  const { passkey } = req.body;

  if (passkey === "999") {
    const token = jwt.sign({ role: "admin" }, "999", { expiresIn: "1h" });
    console.log("Generated token:", token); // Log the generated token
    res.json({ token });
  } else {
    res.status(403).json({ error: "Invalid passkey" });
  }
});

app.delete('/deleteUser/:username', verifyToken, async (req, res) => {
  try {
    const username = req.params.username;

    if (req.tokenData.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete user accounts' });
    }

    let deleteResult = await client.db('Mahfuzah03').collection('player').deleteOne({ username });
    if (deleteResult.deletedCount !== 1) {
      deleteResult = await client.db('Mahfuzah03').collection('admin').deleteOne({ username });
      if (deleteResult.deletedCount !== 1) {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    res.json({ message: 'User account deleted successfully' });
  } catch (err) {
    console.error('Error deleting user account:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assignment.html'));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
