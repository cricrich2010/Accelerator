const { MongoClient } = require("mongodb");

const mDatabase = "trials"
const mCollection = "patients"
const uri = 'mongodb://mongo:Test001@localhost:3022/?authSource=admin'

const docDate = new Date().toISOString()
const exemplDoc = { trial: "tri000", login: "pat000", date: docDate, note: "longue complainte" }
const pet = { name: 'jappy2', kind: 'dog' }

async function mFindDoc(query) {
    const mClient = new MongoClient(uri, { monitorCommands: true });
    //const mConnextion = await mClient.connect(uri, 'mongo', 'Test001')
    //mClient.connect("mongodb://localhost:3022/trials", "mongo", "Test001")

    try {
        const mDB = mClient.db(mDatabase);
        const patientsCol = mDB.collection(mCollection);
        const options = {
            // sort returned documents in ascending order by date (A->Z)
            sort: { date: 1 },
            // Include only the `title` and `imdb` fields in each returned document
            projection: { _id: 0 },
        };
        const cursor = patientsCol.find(query, options);
        await cursor.forEach(console.dir);
        return await cursor.toArray().catch((err) => { console.log("___err for mFindDoc___", err); { err: "Error when retreving note" } })
    } finally {
        await mClient.close();
    }
}

async function mAddDoc(doc) {
    const mClient = await connectToCluster(uri)
    const mDB = mClient.db(mDatabase);
    const mCol = mDB.collection(mCollection);
    //const doc0 = { ...doc } //ensure to create a new object to avoid raise duplicate error
    //console.log('patient doc0', doc0)
    try {
        let insertResult = await mCol.insertOne(doc) // .catch((err) => { console.log("___err for mAddDoc___", err); return { err: "Error when recording note" } })
        console.log('__INSERT DOC___', insertResult)
        return insertResult
    } catch (error) {
        console.log('err', error)
    } finally {
        await mClient.close();
    }
}

async function mDelDoc(query) {
    const mClient = new MongoClient(uri, { monitorCommands: true });
    try {
        const mDB = mClient.db(mDatabase);
        const mCol = mDB.collection(mCollection);
        //let query = { name: doc };
        const cursor0 = await mCol.deleteMany(query).catch((err) => console.log("___err for mDelDoc___", err))
        console.log("Successfully deleted one document.", cursor0)
    } finally {
        await mClient.close();
    }
}

async function mClearCol() {
    const mClient = new MongoClient(uri, { monitorCommands: true });

    let client = await MongoClient.connect(uri);
    const db = await client.db(mDatabase);
    let adminDB = await db.admin();
    let DBS = await adminDB.listDatabases();
    let dbExist = DBS.databases.filter(it => it.name == mDatabase)
    if (dbExist.length > 0) {
        try {
            const mDB = mClient.db(mDatabase);
            console.log("mDB.listCollections", await mDB.listCollections().toArray())
            const mCol = mDB.collection(mCollection);
            await mCol.drop()
                .then((result) => console.log("___SUCCESS for drop collection", result))
                .catch((err) => { console.log("___err for drop collection", err) })
            await mDB.dropDatabase()
                .then((result) => { console.log("___SUCCESS for drop database", result) })
                .catch((err) => { console.log("___err for drop database", err) })
        } finally {
            await mClient.close();
        }
    } else {
        console.log("db does't exist")
    }
}

async function manyDel() {
    await resolveAfterSeconds(4)
    console.log('check')
    await mFindPatientsDoc()
    console.log('del jappy2')
    await mDelDoc("trials", "patients", "jappy2")
    await mFindPatientsDoc()
    console.log('del jappy')
    await mDelDoc("trials", "in", "jappy")
    await mFindPatientsDoc()

    console.log('del spot')
    await mDelDoc("trilas", "patients", "spot")
    await mFindPatientsDoc()

}
async function createDbCol() {
    const mClient = new MongoClient("mongodb://mongo:Test001@localhost:3022/trials?authSource=admin", { monitorCommands: true });
    console.log("step1")
    const mmClient = await mClient.connect()
    console.log("step2", mmClient)
    try {
        console.log("step3")
        const mDB = await mmClient.db(mDatabase);
        console.log(mDB)
        console.log("step4")

        const mCol = await mDB.createCollection(mCollection).catch(err => console.log("___err for createCollection", err));
        console.log(mCol)
        console.log("___SUCCESS for createDbCol")
    } catch { err => console.log("___err for mClearCol", err) }
    finally {
        await mClient.close();
    }
}

function resolveAfterSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}

async function connectToCluster(uri) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(uri);
        //console.log('Connecting to MongoDB Atlas cluster...');
        await mongoClient.connect();
        //console.log('Successfully connected to MongoDB Atlas!');

        return mongoClient;
    } catch (error) {
        console.error('Connection to MongoDB Atlas failed!', error);
        process.exit();
    }
}

module.exports.mAddDoc = mAddDoc
module.exports.mFindDoc = mFindDoc
module.exports.mClearCol = mClearCol
module.exports.createDbCol = createDbCol
