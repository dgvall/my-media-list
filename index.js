document.addEventListener("DOMContentLoaded",(e) => {
 search()
})

// Search Button
function search() {
  let form = document.getElementById("search-form")
  form.addEventListener("submit", (e) =>{
    e.preventDefault()
    clearSearch()
    searchMovies(e.target.text.value)
  })
}

// Prevent searches from stacking
function clearSearch() {
  let container = document.getElementById("card-container")
  container.innerHTML =  ``
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

  // Create Forward Div on Click with more info
  card.addEventListener("click", (e) =>{
    showMore(show)
  })


  // // Show name on Mouse Over
  // card.addEventListener("mouseover", (e) =>{
  //   let title = document.createElement("div")
  //   title.textContent = show.name
  //   title.className = "hoverText"
  //   card.append(title)
  // })

  // // Hide name on Mouse Out
  // card.addEventListener("mouseout", (e) =>{
  //   let text = document.getElementsByClass("hoverText")
  //   text.className = "hidden"
  // })

  container.appendChild(card)
  card.appendChild(img)
  card.appendChild(title)
}

function showMore(show) {
  const window = document.createElement("div")
  const overlay = document.createElement("div")
  const header = document.createElement("div")
  const title = document.createElement("div")
  const button = document.createElement("button")
  const body = document.createElement("div")
  const status = document.createElement("div")
  const score = document.createElement("div")
  const episodes = document.createElement("div")
  const foot = document.createElement("div")
  const saveButton = document.createElement("button")


  window.className = "pop-up"
  overlay.id = "overlay"
  header.className = "pop-up-header"
  title.className = "pop-up-title"
  button.className = "close-button"
  body.className = "pop-up-body"
  foot.className = "pop-up-foot"


  title.textContent = show.name
  button.innerHTML = "&times;"
  saveButton.textContent = "Save"

  button.addEventListener("click", (e) => removeElements(overlay, window))
  overlay.addEventListener("click", (e) => removeElements(overlay, window))

  // Pop up body


  // Status
  status.className = "pop-up-status"

  const label = document.createElement("label")
  const select = document.createElement("select")
  const placeholder = document.createElement("option")
  const planning = document.createElement("option")
  const watching = document.createElement("option")
  const completed = document.createElement("option")
  const dropped = document.createElement("option")

  label.className = "pop-up-labels"

  label.textContent = "Status"
  select.textContent = "Select"
  placeholder.textContent = "Status"
  placeholder.value = "none"
  planning.textContent = "Plan to watch"
  watching.textContent = "Watching"
  completed.textContent = "Completed"
  dropped.textContent = "Dropped"




  // Score
  const scoreLabel = document.createElement("label")
  const emojis = document.createElement("div")
  const smile = document.createElement("div")
  const neutral = document.createElement("div")
  const frown = document.createElement("div")

  emojis.className = "emojis"
  score.className = "pop-up-score"
  scoreLabel.className = "pop-up-labels"
  smile.className = "emoji"
  neutral.className = "emoji"
  frown.className = "emoji"

  scoreLabel.textContent = "Score"
  smile.innerText = String.fromCodePoint(0x1F642)
  neutral.innerText = String.fromCodePoint(0x1F610)
  frown.innerText = String.fromCodePoint(0x1F641)

// Episodes
  episodes.className = "pop-up-episodes"
  const epLabel = document.createElement("label")
  const epInput = document.createElement("input")

  epLabel.className = "pop-up-labels"
  epLabel.textContent = "Episodes Watched"
  epInput.type = "text"
  epInput.name = "text"

  document.body.appendChild(window)
  document.body.appendChild(overlay)
  window.appendChild(header)
  header.appendChild(title)
  header.appendChild(button)
  window.appendChild(body)
  window.appendChild(foot)
  foot.appendChild(saveButton)

  //Status
  body.appendChild(status)
  status.appendChild(label)
  status.appendChild(select)
  select.appendChild(placeholder)
  select.appendChild(planning)
  select.appendChild(watching)
  select.appendChild(completed)
  select.appendChild(dropped)


  // Score
  body.appendChild(score)
  score.appendChild(scoreLabel)
  score.appendChild(emojis)
  emojis.appendChild(smile)
  emojis.appendChild(neutral)
  emojis.appendChild(frown)

  // Episodes
  body.appendChild(episodes)
  episodes.appendChild(epLabel)
  episodes.appendChild(epInput)
}

function removeElements(element1, element2){
  element1.remove()
  element2.remove()
}

