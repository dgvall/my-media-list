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

function showMore(show) {
  console.log(show)
  //        EPISODE COUNT NOT WORKING
  // const epCount = function() {
  //   fetch(`https://api.tvmaze.com/shows/${show.id}/episodes`)
  //   .then((res) => res.json())
  //   .then(data => data.length)
  // }

  // console.log(epCount())

  //        EPISODE COUNT NOT WORKING

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

  const placeholder = document.createElement("option")
  placeholder.textContent = "Status"
  placeholder.value = "none"

  const planning = document.createElement("option")
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
    console.log(show.runtime)
    console.log(show.totalepisodes)
    if (select.value === "Completed") {
      episodes.childNodes[1].value = show.totalepisodes || show.runtime

    //   if(show.runtime === undefined || null) {
    //   episodes.childNodes[1].value = show.totalepisodes
    // } else episodes.childNodes[1].value = show.runtime
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
  epLabel.textContent = "Episodes Watched"

  const epInput = document.createElement("input")
  epInput.type = "number"
  epInput.name = "number"
  epInput.min = 0
  epInput.max = show.runtime || show.totalepisodes

  epInput.addEventListener("change", (e) => {
    if (parseInt(episodes.childNodes[1].value) === show.runtime || show.totalepisodes) {
      select.value = "Completed"
    }
  })

   // Foot
   const foot = document.createElement("div")
   foot.className = "pop-up-foot"
 
   const saveButton = document.createElement("button")
   saveButton.textContent = "Save"

   saveButton.addEventListener("click", (e) => {
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
        totalepisodes: show.runtime
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
  
  // Fill Information If Logged
  fetch("http://localhost:3000/shows")
  .then((res) => res.json())
  .then((data) => {
    let object = {}

    for(listshow of data) {
      object[listshow.title] = listshow.id

      // // From Search
      // if(listshow.title === show.name) {
      //   select.value = listshow.status
      //   score.childNodes[1].value = listshow.score
      //   episodes.childNodes[1].value = listshow.episodes
      // } 
      // // From List
      // if(show.name === undefined) {
      //   select.value = listshow.status
      //   score.childNodes[1].value = listshow.score
      //   episodes.childNodes[1].value = listshow.episodes
      // }
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

function list () {
  const myList = document.getElementById("list")
  myList.addEventListener("click", (e) => {
    clearSearch()
    createList()
    createFilters()
    // createSort()
  })
}

function createFilters() {
  const filters = document.getElementById("list-filters")
  const container = document.getElementById("card-container")

  if (filters.innerHTML === "") {
    const all = document.createElement("button")
    all.textContent = "All"
    all.addEventListener("click", (e) => {
      clearSearch()
      createList()
      // fetch("http://localhost:3000/shows")
      // .then((res) => res.json())
      // .then((data) => {
      //   for(show of data) {
      //     createCards(show)
      //   }
      // })
    })
    filters.appendChild(all)
  
    const planning = document.createElement("button")
    planning.textContent = "Planning"
    planning.addEventListener("click", (e) => {
      clearSearch()
      createTitle("Planning", "planning-head")
      filterBy("Plan to watch","planning-container")
    })
    filters.appendChild(planning)
  
    const watching = document.createElement("button")
    watching.textContent = "Watching"
    watching.addEventListener("click", (e) => {
     clearSearch()
     createTitle("Watching", "watching-head")
     filterBy("Watching", "watching-container")
    })
    
    filters.appendChild(watching)
  
    const completed = document.createElement("button")
    completed.textContent = "Completed"
    completed.addEventListener("click", (e) => {
      clearSearch()
      createTitle("Completed", "completed-head")
      filterBy("Completed", "completed-container")
    })

    filters.appendChild(completed)
  
    const dropped = document.createElement("button")
    dropped.textContent = "Dropped"
    dropped.addEventListener("click", (e) => {
      clearSearch()
      createTitle("Dropped", "dropped-head")
      filterBy("Dropped", "dropped-container")
    })

    filters.appendChild(dropped)
  }

  // if (container.innerHTML === "") {
  //   filters.innerHTML = ""
  //   container.innerText = "Try Searching First!"
  // }
}

function createList() {
  // fetch("http://localhost:3000/shows")
  // .then((res) => res.json())
  // .then((data) => {
    createTitle("Watching", "watching-head")
    filterBy("Watching", "watching-container")

    createTitle("Completed", "completed-head")
    filterBy("Completed", "completed-container")

    createTitle("Dropped", "dropped-head")
    filterBy("Dropped", "dropped-container")

    createTitle("Planning", "planning-head")
    filterBy("Plan to watch", "planning-container")


  // })
}

function createTitle(headText, headId) {
  let container = document.getElementById(headId)
  let header = document.createElement("h1")
  header.className = "filter-header"
  header.textContent = headText
  container.appendChild(header)
}


// function createSort () {
  // const filters = document.getElementById("list-filters")

  // if you have time, sort by score and alphabetical order
// }
