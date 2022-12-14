const { MongoClient } = require("mongodb");

const mDatabase = "trials"
const mCollection = "patients"
const uri = 'mongodb://mongo:Test001@localhost:3022/?authSource=admin'

const docDate = new Date().toISOString()
const exemplDoc = { trial: "tri000", login: "pat000", date: docDate, note: "longue complainte" }
const pet = { name: 'jappy2', kind: 'dog' }

async function mFindDoc(query) {
    const mClient = new MongoClient(uri, { monitorCommands: true });
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
    const mClient = new MongoClient(uri, { monitorCommands: true });
    try {
        console.log('patient doc', doc)
        const mDB = mClient.db(mDatabase);
        const mCol = mDB.collection(mCollection);
        console.log(mCol)
        console.log("type of col: ", typeof mCol)
        console.log(mDatabase, mCollection)
        const doc0 = { ...doc } //ensure to create a new object to avoid raise duplicate error
        console.log('patient doc0', doc0)
        return await mCol.insertOne(doc0).catch((err) => { console.log("___err for mAddDoc___", err); { err: "Error when recording note" } })
    } finally {
        await mClient.close();
    }
}

mAddDoc(pet)
let doc = {
    login: 'Pat230',
    date: '2022-12-24T06:53:00.000Z',
    inv: 'Inv000',
    note: 'Eu minim sint do deserunt dolor fugiat amet. Commodo incididunt magna consectetur velit pariatur aliqua id incididunt sunt non in do officia.'
}
mAddDoc(doc)

async function mDelDoc(query) {
    const mClient = new MongoClient(uri, { monitorCommands: true });
    try {
        const mDB = mClient.db(mDatabase);
        const mCol = mDB.collection(collection);
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

async function createDbCol2() {
    //const MongoClient = require('mongodb').MongoClient;
    //const uri =    'mongodb+srv://dbUser:<dbpassword>@cluster0.dcu5m.mongodb.net/sample_airbnb?retryWrites=true&w=majority';
    const client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect((err) => {
        const collection = client.db(mDatabase).createCollection(mCollection);
        // perform actions on the collection object
        client.close();
    });
}

function resolveAfterSeconds(seconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}

//const clesure = await mClient.close();

module.exports.mAddDoc = mAddDoc
module.exports.mFindDoc = mFindDoc
module.exports.mClearCol = mClearCol
module.exports.createDbCol = createDbCol
module.exports.createDbCol2 = createDbCol2
