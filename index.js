document.addEventListener("DOMContentLoaded",(e) => {
 search()
})

// Search Button
function search() {
  let form = document.getElementById("search-form")
  form.addEventListener("submit", (e) =>{
    e.preventDefault()
    searchMovies(e.target.text.value)
  })
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
  let container = document.getElementById("card-container")
  let card = document.createElement("div")
  let img = document.createElement("img")
  let title = document.createElement("div")

  card.className = "card"
  img.className = "cardImg"
  title.className = "title"

  img.src= show.image.medium
  title.innerHTML = show.name 

  // Create Forward Div on Click with more info
  card.addEventListener("click", (e) =>{
    console.log(e)
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

