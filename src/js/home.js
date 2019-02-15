
(async function load(){
  const API = 'https://api.audioboom.com/'

  /* Elements DOM */
  const home = document.getElementById('home')
  
  const modal = document.getElementById('modal')
  const modalTitle = document.getElementById('modalTitle')
  const modalImage = document.getElementById('modalImage')
  const modalDescription = document.getElementById('modalDescription')
  const btnModal = document.getElementById('btn-modal')
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

  const HTMLTemplate = (podcasts) => {
    return (`
      <div class="podcasts-container" data-id="${podcasts.id}">
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
        const id = parseInt(podcastsElement.dataset.id, 10)
        let podcastModal = allPodcasts.find(podcasts => podcasts.id === id)

        modal.style.display = 'block'
        overlay.classList.add('active')

        modalTitle.textContent = podcastModal.title
        modalImage.setAttribute('src', podcasts.channel.urls.logo_image.original)
        modalDescription.textContent = podcastModal.description


        btnModal.addEventListener('click', () => {
          modal.style.display = 'none'
          overlay.classList.remove('active')
        })

      })
    })
  }

  const removeTemplate = container => {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const str = data.get('search')
    const value = str.replace(/ /g, "-")
    
    const searchTopic = await getData(`audio_clips?find[query]=${value}`)
    featuring.classList.add('enabled')

    removeTemplate(featuring)

    if (searchTopic.length <= 0) {
      const tagMessage = document.createElement('h3')
      const message = document.createTextNode('The topic you wanted was not found')
      tagMessage.appendChild(message)

      return featuring.appendChild(tagMessage)      
    }
    
    renderTemplate(searchTopic, featuring)
  })


  /* Data Api Audioboom */
  const basicPodcasts = await getData('audio_clips')
  const popularPodcasts = await getData('audio_clips/popular')
  const featuredPodcasts = await getData('audio_clips/featured')
  const allPodcasts = basicPodcasts.concat(popularPodcasts, featuredPodcasts)

  /* Render dates */
  renderTemplate(basicPodcasts, basicContainer)
  renderTemplate(popularPodcasts, popularContainer)
  renderTemplate(featuredPodcasts, featuredContainer)
})()



