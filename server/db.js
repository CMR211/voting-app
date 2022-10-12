const { MongoClient } = require("mongodb")
require("dotenv").config()
const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true })

async function load() {
    await client.connect()
    const db = client.db("projects").collection("voting-app")
    const document = await db.findOne({ _name: "votes" })
    client.close()
    return document
}

async function update(content) {
    await client.connect()
    const db = client.db("projects").collection("voting-app")
    await db.updateOne(
        { _name: "votes" },
        {
            $set: { votes: content.votes },
        }
    )
    client.close()
}

module.exports = { load, update }
