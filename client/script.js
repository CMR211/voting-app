// setFormActionPath("/vote")
changeViewIfVoted()
displayResults()

async function displayResults() {
    const results = await fetchVotesData()
    for (let item of Object.keys(results)) {
        const bar = document.getElementById("bar-" + item)
        const maxWidth = bar.parentElement.offsetWidth
        const width = Math.round((results[item] / 100) * maxWidth)
        bar.style = `--width: ${width}px`
        const span = document.getElementById("percent-" + item)
        span.innerText = `${results[item]}%`
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
    const data = await fetch("/votes")
    const json = await data.json()
    return json
}

function handleSubmitClick() {
    let voter = document.getElementById("voter").value
    localStorage.setItem("hasVoted", voter)
}
