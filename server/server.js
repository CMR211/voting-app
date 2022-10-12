// loading libraries
const express = require("express")
const fs = require("fs").promises
const path = require("path")
require("dotenv").config()
const db = require("./db.js")

const PORT = process.env.PORT || 3000

// setting up a server
const app = express()

// global const for votes file
const dataFile = path.join(__dirname, "votes.json")

app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    next()
})

app.use(express.static(path.join(__dirname, "../client")))

// "/votes" GET method
app.get("/votes", async (req, res) => {
    const data = await db.load()
    console.log(data)
    const totalVotes = data.votes.length
    const response = {
        yes: getPercentageOfVotes({ data: data, vote: "yes", totalVotes: totalVotes }),
        no: getPercentageOfVotes({ data: data, vote: "no", totalVotes: totalVotes }),
        tentative: getPercentageOfVotes({ data: data, vote: "tentative", totalVotes: totalVotes }),
    }
    res.json(response)
})

app.post("/vote", async (req, res) => {
    const data = await db.load()
    const { person, answer } = req.body
    let newData = { ...data }

    const date = new Date()
    const timestamp = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`

    const indexOfPerson = data.votes.findIndex((entry) => entry.person.toLowerCase() === person.toLowerCase())
    if (indexOfPerson > -1) {
        newData.votes[indexOfPerson] = {
            person,
            vote: answer,
            timestamp,
        }
    } else {
        newData.votes.push({
            person,
            vote: answer,
            timestamp,
        })
    }

    await db.update(newData)
    res.redirect("/")
    res.end()
})

app.listen(PORT, () => console.log("Server is running..."))

function getPercentageOfVotes({ data, vote, totalVotes }) {
    return Math.round((data.votes.filter((i) => i.vote === vote).length / totalVotes) * 100)
}
