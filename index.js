document.addEventListener("DOMContentLoaded",(e) => {
 search()
 list()
 createFilters()
 createList()
})
// Keeps track of current page
let page = "All"

// Search Button
function search() {
  let form = document.getElementById("search-form")

  form.addEventListener("submit", (e) =>{
    e.preventDefault()
    clearSearch()
    createTitle(`Search Result: ${e.target.text.value}`, "card-head")
    searchMovies(e.target.text.value)
    clearList()
    page = "Search"
  })
}

// Prevent searches and headers from stacking
function clearSearch() {
  let cardHead = document.getElementById("card-head")
  cardHead.innerHTML = ""

  let container = document.getElementById("card-container")
  container.innerHTML =  ""

  let watching = document.getElementById("watching-container")
  watching.innerHTML = ""

  let watchingHead = document.getElementById("watching-head")
  watchingHead.innerHTML = ""

  let completed = document.getElementById("completed-container")
  completed.innerHTML = ""

  let completedHead = document.getElementById("completed-head")
  completedHead.innerHTML = ""

  let dropped = document.getElementById("dropped-container")
  dropped.innerHTML = ""

  let droppedHead = document.getElementById("dropped-head")
  droppedHead.innerHTML = ""

  let planning = document.getElementById("planning-container")
  planning.innerHTML = ""

  let planningHead = document.getElementById("planning-head")
  planningHead.innerHTML = ""
}

function clearList() {
  let list = document.getElementById("list-filters")
  list.innerHTML = ""
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
function createCards(show, id="card-container") {
  const container = document.getElementById(id)
  const card = document.createElement("div")
  const img = document.createElement("img")
  const title = document.createElement("div")

  card.className = "card"
  img.className = "cardImg"
  title.className = "title"
  img.src= show.image.medium || show.image
  title.innerHTML = show.name || show.title

  // Create Popup Div on Click with more info
  card.addEventListener("click", (e) =>{
    showMore(show)
  })

  container.appendChild(card)
  card.appendChild(img)
  card.appendChild(title)
}

async function showMore(show) {
  let result = await
  fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`)
  let data = await result.json()
  const epCount = data.length

  // Episodes determined by db.json
  console.log(show.totalepisodes)
  // Episodes determined by API
  console.log(epCount)

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
  title.textContent = show.name || show.title

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

  const planning = document.createElement("option")
  planning.placeholder = "Status"
  planning.textContent = "Plan to watch"
  planning.value = "Plan to watch"

  const watching = document.createElement("option")
  watching.textContent = "Watching"
  watching.value = "Watching"

  const completed = document.createElement("option")
  completed.textContent = "Completed"
  completed.value = "Completed"

  const dropped = document.createElement("option")
  dropped.textContent = "Dropped"
  dropped.value = "Dropped"

  select.addEventListener("change", (e) => {
    if (select.value === "Completed") {
      episodes.childNodes[1].value = show.totalepisodes || epCount
    }
  })
  
  // Body 2 (Score)
  const score = document.createElement("div")
  score.className = "pop-up-score"

  const scoreLabel = document.createElement("label")
  scoreLabel.className = "pop-up-labels"
  scoreLabel.textContent = "Score"

  const scoreInput = document.createElement("input")
  scoreInput.type = "number"
  scoreInput.name = "number"
  scoreInput.max = 10
  scoreInput.min = 0

// Body 3 (Episodes)
  const episodes = document.createElement("div")
  episodes.className = "pop-up-episodes"

  const epLabel = document.createElement("label")
  epLabel.className = "pop-up-labels"
  epLabel.textContent = "Episode Progress"

  const epInput = document.createElement("input")
  epInput.type = "number"
  epInput.name = "number"
  epInput.min = 0
  epInput.max = show.totalepisodes || epCount
  epInput.addEventListener("change", (e) => {
    if(!show.totalepisodes) {
    if (episodes.childNodes[1].value >= epCount) {
      select.value = "Completed"
    }
  }
    if (episodes.childNodes[1].value >= show.totalepisodes) {
      select.value = "Completed"
    }
  })

   // Foot
   const foot = document.createElement("div")
   foot.className = "pop-up-foot"
 
   const saveButton = document.createElement("button")
   saveButton.textContent = "Save"

   saveButton.addEventListener("click", (e) => {
    if (page === "All") {
      clearSearch()
      createList()
    }
    if (page === "Watching") {
      clearSearch()
      createTitle("Watching", "watching-head")
      filterBy("Watching", "watching-container")
    }
    if (page === "Completed") {
      clearSearch()
      createTitle("Completed", "completed-head")
      filterBy("Completed", "completed-container")
    }
    if (page === "Planning") {
      clearSearch()
      createTitle("Planning", "planning-head")
      filterBy("Plan to watch","planning-container")
    }
    if (page === "Dropped") {
      clearSearch()
      createTitle("Dropped", "dropped-head")
      filterBy("Dropped", "dropped-container")
    }
      
    fetch("http://localhost:3000/shows")
      .then(res => res.json())
      .then((data) => {
        let object = {}
      for(tvshow of data) {
       object[tvshow.title] = tvshow.id
      }

      let found = Object.keys(object).find((element) => element === title.textContent)
      if(found) {
        fetch(`http://localhost:3000/shows/${object[found]}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: select.value,
          score: score.childNodes[1].value,
          episodes: episodes.childNodes[1].value,
        })
      })
      .then((res) => res.json())
      .then((show) => show)
      } 

      else {
         fetch("http://localhost:3000/shows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: show.name,
        status: select.value,
        score: score.childNodes[1].value,
        episodes: episodes.childNodes[1].value,
        image: show.image.medium,
        totalepisodes: epCount
      })
    })
    .then((res) => res.json())
    .then((show) => {})
      }
      })
   })

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
  
  // Fill Information If Logged
  fetch("http://localhost:3000/shows")
  .then((res) => res.json())
  .then((data) => {
    let object = {}

    for(listshow of data) {
      object[listshow.title] = listshow.id
    }
    let fillTitle = Object.keys(object).find(element => element === title.textContent)

    let id = parseInt(object[fillTitle]) - 1
    
    if(fillTitle === title.textContent) {
      select.value = data[id].status
      score.childNodes[1].value = data[id].score
      episodes.childNodes[1].value = data[id].episodes
    }
  })
}

function removeElements(element1, element2){
  element1.remove()
  element2.remove()
}

// My List
function filterBy(status, id) {
  fetch("http://localhost:3000/shows")
    .then((res) => res.json())
    .then((data) => {
     let filteredShows = data.filter((element) => element.status === status)
     for(show of filteredShows) {
      createCards(show, id)
    }
    })
}

// Event listener for "My List"
function list () {
  const myList = document.getElementById("list")
  myList.addEventListener("click", (e) => {
    clearSearch()
    createList()
    createFilters()
  })
}

function createFilters() {
  const filters = document.getElementById("list-filters")
  const container = document.getElementById("card-container")
  const all = document.createElement("button")
  const watching = document.createElement("button")
  const completed = document.createElement("button")
  const planning = document.createElement("button")
  const dropped = document.createElement("button")


  if (filters.innerHTML === "") {
    all.textContent = "All"
    all.className ="filter-button-selected"
    all.addEventListener("click", (e) => {
      all.className = "filter-button-selected"
      watching.className = "filter-button"
      completed.className = "filter-button"
      planning.className = "filter-button"
      dropped.className = "filter-button"

      clearSearch()
      createList()
      page = "All"
    })
    filters.appendChild(all)

    watching.textContent = "Watching"
    watching.className ="filter-button"
    watching.addEventListener("click", (e) => {
      all.className = "filter-button"
      watching.className = "filter-button-selected"
      completed.className = "filter-button"
      planning.className = "filter-button"
      dropped.className = "filter-button"
     clearSearch()
     createTitle("Watching", "watching-head")
     filterBy("Watching", "watching-container")
     page = "Watching"
    })
    filters.appendChild(watching)

   
    completed.textContent = "Completed"
    completed.className ="filter-button"
    completed.addEventListener("click", (e) => {
      all.className = "filter-button"
      watching.className = "filter-button"
      completed.className = "filter-button-selected"
      planning.className = "filter-button"
      dropped.className = "filter-button"
      clearSearch()
      createTitle("Completed", "completed-head")
      filterBy("Completed", "completed-container")
      page = "Completed"
    })
    filters.appendChild(completed)
  
  
    planning.textContent = "Planning"
    planning.className ="filter-button"
    planning.addEventListener("click", (e) => {
      all.className = "filter-button"
      watching.className = "filter-button"
      completed.className = "filter-button"
      planning.className = "filter-button-selected"
      dropped.className = "filter-button"
      clearSearch()
      createTitle("Planning", "planning-head")
      filterBy("Plan to watch","planning-container")
      page = "Planning"
    })
    filters.appendChild(planning)
  

    dropped.textContent = "Dropped"
    dropped.className ="filter-button"
    dropped.addEventListener("click", (e) => {
      all.className = "filter-button"
      watching.className = "filter-button"
      completed.className = "filter-button"
      planning.className = "filter-button"
      dropped.className = "filter-button-selected"
      clearSearch()
      createTitle("Dropped", "dropped-head")
      filterBy("Dropped", "dropped-container")
      page = "Dropped"
    })
    filters.appendChild(dropped)
  }
}

function createList() {
  fetch("http://localhost:3000/shows")
  .then((res) => res.json())
  .then((data) => {
if(data[0] === undefined) {
  createTitle("Search for your favorite shows to start your list!", "watching-head")
} else {
  createTitle("Watching", "watching-head")
    filterBy("Watching", "watching-container")

    createTitle("Completed", "completed-head")
    filterBy("Completed", "completed-container")

    createTitle("Planning", "planning-head")
    filterBy("Plan to watch", "planning-container")

    createTitle("Dropped", "dropped-head")
    filterBy("Dropped", "dropped-container")
}
  })
}

function createTitle(headText, headId) {
  let container = document.getElementById(headId)
  let header = document.createElement("h1")
  header.className = "filter-header"
  header.textContent = headText
  container.appendChild(header)
}
