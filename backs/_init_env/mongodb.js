const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://mongo:Test001@localhost:3022/trials"
//"mongodb+srv://mongo:Test001@<cluster-url>?retryWrites=true&w=majority";

const mongoTrials = new MongoClient(uri);

async function run() {
    try {
        //const database = client.db('sample_mflix');
        //const movies = database.collection('movies');
        mongoTrials.collection()
        // Query for a movie that has the title 'Back to the Future'
        const query = { title: 'Back to the Future' };
        const movie = await movies.findOne(query);
        console.log(movie);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);