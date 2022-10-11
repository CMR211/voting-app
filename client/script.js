const SERVER_PATH = "http://localhost:3000"

setFormActionPath(SERVER_PATH + "/vote")
changeViewIfVoted()
displayResults()

async function displayResults() {
    const votes = await fetchVotesData()
    for (let item of votes) {
        const bar = document.getElementById("bar-" + item.label.toLowerCase())
        const maxWidth = bar.parentElement.offsetWidth
        const width = Math.round((item.percentage / 100) * maxWidth)
        bar.style = `--width: ${width}px`
        const span = document.getElementById("percent-" + item.label.toLowerCase())
        span.innerText = `${item.percentage}%`
    }
}

function changeViewIfVoted() {
    const hasVoted = localStorage.getItem("hasVoted")
    if (hasVoted) {
        document.getElementById("form").classList.add("hidden")
        document.getElementById("results").classList.remove("hidden")
    }
}

function setFormActionPath(path) {
    const form = document.getElementById("form")
    form.setAttribute("action", path)
}

async function fetchVotesData() {
    const data = await fetch(SERVER_PATH + "/votes")
    const json = await data.json()
    return json
}

function handleSubmitClick() {
    let voter = document.getElementById("voter").value
    localStorage.setItem("hasVoted", voter)
}
