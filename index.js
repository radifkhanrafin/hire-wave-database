const express = require('express')
const cors = require('cors')
require('dotenv').config()
const morgan = require("morgan");
const jwt = require('jsonwebtoken');

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


// const verifyJWT = (req, res, next) => {
//     const authorization = req.headers.authorization;
//     // console.log('authorization', authorization)
//     if (!authorization) {
//         return res.status(401).send({ error: true, message: 'unauthorized access 1' });
//     }
//     // bearer token
//     const token = authorization.split(' ')[1];
//     // console.log('token', token)
//     jwt.verify(token, process.env.JWT_ACCESS_TOCKEN, (err, decoded) => {
//         if (err) {
//             return res.status(401).send({ error: true, message: 'unauthorized access 2' })
//         }
//         req.decoded = decoded;
//         next();
//     })
// }


const uri = 'mongodb+srv://hiqmah-607:3bSe7cpTWxq6iTOL@cluster0.v0qnf3o.mongodb.net/';

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const allJobCollection = client.db("test").collection("alljobs");

        const allCandidatesCollection = client.db("test").collection("allcandidates");

        const jobLocationCollection = client.db("test").collection("joblocations");

        const recruitersCollection = client.db("test").collection("recruiters");


        // const verifyAdmin = async (req, res, next) => {
        //     const email = req.decoded.email;
        //     // console.log('decoded email from verify admin', email)
        //     const query = { email: email }
        //     const user = await userscollection.findOne(query);
        //     if (user?.role !== 'admin') {
        //         console.log('se admin na')
        //         return res.status(403).send({ error: true, message: 'forbidden message' });
        //     }
        //     next();
        // }
        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     // console.log('from user /jwt', user)
        //     // console.log(process.env.JWT_ACCESS_TOCKEN)
        //     const token = jwt.sign(user, process.env.JWT_ACCESS_TOCKEN, { expiresIn: '50h' })
        //     res.send({ token })
        // })
        // app.post('/users', async (req, res) => {
        //     const users = req.body;
        //     const query = { email: users.email }
        //     const existingUser = await userscollection.findOne(query);
        //     // console.log("existing", existingUser)
        //     if (existingUser) {
        //         console.log('ai user ase')
        //         return res.send({ mssage: 'user Is already exists' })
        //     }
        //     const result = await userscollection.insertOne(users);
        //     res.send(result)
        // })


        // Post A job 
        app.post(('/allJobs'), async (req, res) => {
            try {
                const newJobPostData = req.body;
                console.log(newJobPostData)
                const newJobPost = await allJobCollection.insertOne(newJobPostData);
                res.status(200).send(newJobPost)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        // Get all Jobs Post
        app.get('/allJobs', async (req, res) => {
            try {
                const Result = await allJobCollection.find().toArray();
                res.status(200).send(Result);
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        // Get a Jobs Post
        app.get('/allJobs/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const Result = await allJobCollection.find(query).toArray();
                res.status(200).send(Result);
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        // Delete A Job Post
        app.delete('/allJobs/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const deleteJobPost = await allJobCollection.deleteOne(query)
                res.status(200).send(deleteJobPost)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })

        // Candidates 
        app.post('/allCandidates', async (req, res) => {
            try {
                const allCandidates = req.body;
                console.log('allCandidates', allCandidates)
                const result = await allCandidatesCollection.insertOne(allCandidates);
                res.status(200).send(result)
            } catch (error) {
                res.status(500).send({ message: error.message })
            }
        })
        app.get('/allCandidates', async (req, res) => {
            try {
                const jobCandidate = await allCandidatesCollection.find().toArray();
                // console.log(jobCandidate)
                res.status(200).send(jobCandidate)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.get('/allCandidates/:id', async (req, res) => {
            try {
                const id = req.params.id;
                console.log(id)
                const query = { _id: new ObjectId(id) }
                const jobCandidate = await allCandidatesCollection.findOne(query);
                console.log(jobCandidate)
                res.status(200).send(jobCandidate)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.delete('/allCandidates/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const jobCandidate = await allCandidatesCollection.deleteOne(query);
                console.log(jobCandidate)
                res.status(200).send(jobCandidate)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })


        // Job By Location 
        app.post('/jobByLocation', async (req, res) => {
            try {
                const newJobLocation = req.body;
                // console.log(newJobLocation)
                const newJobLocationPost = await jobLocationCollection.insertOne(newJobLocation);
                res.status(200).send(newJobLocationPost)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.get('/jobByLocation', async (req, res) => {
            try {
                const allJobLocationPost = await jobLocationCollection.find().toArray();
                res.status(200).send(allJobLocationPost)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.get('/jobByLocation/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const allJobLocationPost = await jobLocationCollection.findOne(query);
                res.status(200).send(allJobLocationPost)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.delete('/jobByLocation/:id', async (req, res) => {
            try {
                const id = req.params.id;
                console.log(id)
                const query = { _id: new ObjectId(id) }
                const deletedJobLocationPost = await jobLocationCollection.deleteOne(query);
                res.status(200).send(deletedJobLocationPost)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })


        //  Recruiters Route
        app.post('/recruiters', async (req, res) => {
            try {
                const newRecruiterData = req.body;
                const newRecruiter = await recruitersCollection.insertOne(newRecruiterData);
                res.status(200).send(newRecruiter)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.get('/recruiters', async (req, res) => {
            try {
                const recruiters = await recruitersCollection.find().toArray()
                res.status(200).send(recruiters)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.get('/recruiters/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const recruiters = await recruitersCollection.findOne(query)
                res.status(200).send(recruiters)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })
        app.delete('/recruiters/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) }
                const deletedRecruiters = await recruitersCollection.deleteOne(query)
                res.status(200).send(deletedRecruiters)
            } catch (error) {
                res.status(404).send({ message: error.message })
            }
        })


    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hire Wave Hiring Agency')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})