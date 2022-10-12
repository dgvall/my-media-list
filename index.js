document.addEventListener("DOMContentLoaded",(e) => {
 search()
 list()
})

// Search Button
function search() {
  let form = document.getElementById("search-form")

  form.addEventListener("submit", (e) =>{
    e.preventDefault()
    clearSearch()
    searchMovies(e.target.text.value)
    clearList()
  })
}

// Prevent searches from stacking
function clearSearch() {
  let container = document.getElementById("card-container")
  container.innerHTML =  ``
}

function clearList() {
  let list = document.getElementById("list-filters")
  list.innerHTML = ``
}

// Get Request for API
function searchMovies(search) {
  fetch(`https://api.tvmaze.com/search/shows?q=${search}`)
  .then((res) => res.json())
  .then((shows) => {
    for(show of shows) {
      createCards(show.show)
    }
   
  })
}

// Create Cards
function createCards(show) {
  const container = document.getElementById("card-container")
  const card = document.createElement("div")
  const img = document.createElement("img")
  const title = document.createElement("div")

  card.className = "card"
  img.className = "cardImg"
  title.className = "title"

  img.src= show.image.medium
  title.innerHTML = show.name 

  // Create Popup Div on Click with more info
  card.addEventListener("click", (e) =>{
    showMore(show)
  })

  container.appendChild(card)
  card.appendChild(img)
  card.appendChild(title)
}

function showMore(show) {
  // Window
  const window = document.createElement("div")
  window.className = "pop-up"

  // Overlay
  const overlay = document.createElement("div")
  overlay.id = "overlay"
  overlay.addEventListener("click", (e) => removeElements(overlay, window))

  // Header
  const header = document.createElement("div")
  header.className = "pop-up-header"

  const title = document.createElement("div")
  title.className = "pop-up-title"
  title.textContent = show.name

  const button = document.createElement("button")
  button.className = "close-button"
  button.innerHTML = "&times;"
  button.addEventListener("click", (e) => removeElements(overlay, window))

  // Pop up body
  const body = document.createElement("div")
  body.className = "pop-up-body"

  // Body 1 (Status)
  const status = document.createElement("div")
  status.className = "pop-up-status"

  const label = document.createElement("label")
  label.className = "pop-up-labels"
  label.textContent = "Status"

  const select = document.createElement("select")
  select.textContent = "Select"

  const placeholder = document.createElement("option")
  placeholder.textContent = "Status"
  placeholder.value = "none"

  const planning = document.createElement("option")
  planning.textContent = "Plan to watch"

  const watching = document.createElement("option")
  watching.textContent = "Watching"

  const completed = document.createElement("option")
  completed.textContent = "Completed"

  const dropped = document.createElement("option")
  dropped.textContent = "Dropped"
  
  // Body 2 (Score)
  const score = document.createElement("div")
  score.className = "pop-up-score"

  const scoreLabel = document.createElement("label")
  scoreLabel.className = "pop-up-labels"
  scoreLabel.textContent = "Score"

  const scoreInput = document.createElement("input")
  scoreInput.type = "text"
  scoreInput.name = "text"

// Body 3 (Episodes)
  const episodes = document.createElement("div")
  episodes.className = "pop-up-episodes"

  const epLabel = document.createElement("label")
  epLabel.className = "pop-up-labels"
  epLabel.textContent = "Episodes Watched"

  const epInput = document.createElement("input")
  epInput.type = "text"
  epInput.name = "text"

   // Foot
   const foot = document.createElement("div")
   foot.className = "pop-up-foot"
 
   const saveButton = document.createElement("button")
   saveButton.textContent = "Save"
 

// Append Elements

  // Pop up
  document.body.appendChild(window)
  document.body.appendChild(overlay)

  // Header
  window.appendChild(header)
  header.appendChild(title)
  header.appendChild(button)

  // Body
  window.appendChild(body)
  
  body.appendChild(status)
  status.appendChild(label)
  status.appendChild(select)
  select.appendChild(placeholder)
  select.appendChild(planning)
  select.appendChild(watching)
  select.appendChild(completed)
  select.appendChild(dropped)

  body.appendChild(score)
  score.appendChild(scoreLabel)
  score.appendChild(scoreInput)

  body.appendChild(episodes)
  episodes.appendChild(epLabel)
  episodes.appendChild(epInput)

  // Foot
  window.appendChild(foot)
  foot.appendChild(saveButton)
}

function removeElements(element1, element2){
  element1.remove()
  element2.remove()
}

// My List

function list () {
  const myList = document.getElementById("list")
  myList.addEventListener("click", (e) => {
    clearSearch()
    createFilters()
    // createSort()
  })
}

function createFilters() {
  const filters = document.getElementById("list-filters")
  const container = document.getElementById("card-container")

  if ( filters.innerHTML === "") {
    const all = document.createElement("button")
    all.textContent = "All"
    filters.appendChild(all)
  
    const planning = document.createElement("button")
    planning.textContent = "Planning"
    filters.appendChild(planning)
  
    const watching = document.createElement("button")
    watching.textContent = "Watching"
    filters.appendChild(watching)
  
    const completed = document.createElement("button")
    completed.textContent = "Completed"
    filters.appendChild(completed)
  
    const dropped = document.createElement("button")
    dropped.textContent = "Dropped"
    filters.appendChild(dropped)
  }
  if (container.innerHTML === "") {
    filters.innerHTML = ""
    container.innerText = "Try Searching First!"
  }
}

// function createSort () {
  // const filters = document.getElementById("list-filters")

  // if you have time, sort by score and alphabetical order
// }
