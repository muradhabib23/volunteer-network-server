const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser')
const cors = require('cors')

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2azhx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(cors())


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
client.connect(err => {
  const eventCollection = client.db("volunteerNetwork").collection("newEvents");
  const eventRegisterCollection = client.db("volunteerNetwork").collection("events");
  app.get('/', (req, res) => {
    res.send('Server Connected')
  })

  app.post('/addEvent', (req, res) => {
    const event = req.body;
    eventCollection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/registeredEvents', (req, res) => {
    const registerData = req.body;
    eventRegisterCollection.insertOne(registerData)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
      app.get('/events', (req, res) => {
        eventCollection.find({})
          .toArray((err, documents) => {
            res.send(documents);
          })
      })
      app.get('/allRegisteredEvents', (req, res) => {
        eventRegisterCollection.find({})
          .toArray((err, documents) => {
            res.send(documents);
          })
      })
      app.get('/eventWorks', (req, res) => {
        console.log(req.query)
        eventRegisterCollection.find({ email: req.query.email })
        // console.log(req.query)
          .toArray((err, documents) => {
            res.send(documents);
          })
      })
      app.delete('/delete/:id', (req, res) => {
        eventRegisterCollection.deleteOne({ _id: ObjectId(req.params.id) })
          .then(result => {
            res.send(result.deletedCount > 0);
          })
      })
      app.delete('/deleteRegisteredTask/:id', (req, res) => {
        eventRegisterCollection.deleteOne({ _id: ObjectId(req.params.id) })
          .then(result => {
            res.send(result.deletedCount > 0);
          })
      })
  })
  
});
app.listen(process.env.PORT || port)
