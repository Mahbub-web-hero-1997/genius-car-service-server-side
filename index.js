const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// user : geniusCarService
// Password : emlnwNTqC5Ax1jhc

const uri = `mongodb+srv://
${process.env.DB_USER}:${process.env.DB_Password}@cluster0.eabcz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const serviceCollection = client.db('geniusCarService').collection('service');
        const orderCollection = client.db('geniusCarService').collection('order');
        // Get Multiple collection 
        app.get('/', (req, res) => {
            res.send('Hi! I am Md. Mahbub Alam')
        })
        app.get('/service', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray()
            res.send(services)
        })
        // Fiend single collection using params
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service);
        })
        // Post Collection
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService)
            res.send(result)
        })
        // Delete Api
        app.delete('/service/:id', (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = serviceCollection.deleteOne(query)
            res.send(result)
        })
        // Get order collection
        app.get('/order', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray()
            res.send(orders)
        })
        // Post Order Collection Api
        app.post('/order', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(console.dir)

app.listen(port, () => {
    console.log('Listening the port', port);
})