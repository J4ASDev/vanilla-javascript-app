
(async function load(){
  const API = 'https://api.audioboom.com/'

  /* Elements DOM */
  const home = document.getElementById('home')

  const modal = document.getElementById('modal')
  const overlay = document.getElementById('overlay')
  
  const form = document.getElementById('form')
  const featuring = document.getElementById('featuring')

  const basicContainer = document.getElementById('basicContainer')
  const popularContainer = document.getElementById('popularContainer')
  const featuredContainer = document.getElementById('featuredContainer')

  /* Function get data api Audioboom */
  async function getData(URL) {
    const result = await fetch(`${API}${URL}`)
    const { body: { audio_clips } } = await result.json()

    return audio_clips
  }
  
  /* Functions to manipulate the HTML (create and add) */
  const HTMLTemplate = podcasts => {
    return (`
      <div class="podcasts-container">
        <figure>
          <img
            class="podcasts-cover"
            src="${podcasts.urls.image || podcasts.channel && podcasts.channel.urls.logo_image.original}" 
            alt="${podcasts.title}"
          >
        </figure>
        <h4>${podcasts.title}</h4>
      </div>
    `)
  }

  const createTemplate = HTMLString => {
    const html = document.implementation.createHTMLDocument()
    html.body.innerHTML = HTMLString
    
    return html.body.children[0]
  }

  const renderTemplate = (list, container) => {
    if (container.querySelector('img')) container.querySelector('img').remove()

    list.forEach(podcasts => {
      const HTMLString = HTMLTemplate(podcasts)
      const podcastsElement = createTemplate(HTMLString)
         
      container.append(podcastsElement)
      
      podcastsElement.addEventListener('click', () => {

        console.log(podcastsElement)
        modal.style.display = 'block'
      })
    })
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const str = data.get('search')
    const value = str.replace(/ /g, "-")
    
    const searchTopic = await getData(`audio_clips?find[query]=${value}`)
    featuring.classList.add('enabled')

    renderTemplate(searchTopic, featuring)
  })


  /* Data Api Audioboom */
  const basicPodcasts = await getData('audio_clips')
  const popularPodcasts = await getData('audio_clips/popular')
  const featuredPodcasts = await getData('audio_clips/featured')

  /* Render dates */
  renderTemplate(basicPodcasts, basicContainer)
  renderTemplate(popularPodcasts, popularContainer)
  renderTemplate(featuredPodcasts, featuredContainer)
  
})()



