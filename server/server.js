// loading libraries
const express = require("express")
const fs = require("fs").promises
const path = require("path")

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
    const data = JSON.parse(await fs.readFile(dataFile, { encoding: "utf-8" }))
    const totalVotes = Object.values(data.votes).reduce((prev, curr) => prev + curr, 0)
    const response = Object.entries(data.votes).map((item, index) => {
        return {
            label: item[0].slice(0, 1).toUpperCase() + item[0].slice(1),
            percentage: totalVotes === 0 ? 0 : (percentage = Math.round((item[1] / totalVotes) * 100)),
        }
    })
    res.json(response)
})

app.post("/vote", async (req, res) => {
    const data = JSON.parse(await fs.readFile(dataFile, { encoding: "utf-8" }))
    data.votes[req.body.answer]++
    data.voted = [...data.voted, req.body.person]
    await fs.writeFile(dataFile, JSON.stringify(data))
    res.redirect("/")
    res.end()
})

app.listen(PORT, () => console.log("Server is running..."))