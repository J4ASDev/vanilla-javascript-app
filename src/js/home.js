
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
    const { body: { audio_clips }} = await result.json()
  
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

      const image = podcastsElement.querySelector('img')

      image.addEventListener('load', (event) => {
        event.srcElement.classList.add('fadeIn')
      })

      podcastsElement.addEventListener('click', () => {
        const id = parseInt(podcastsElement.dataset.id, 10)
        const allPodcasts = basicPodcasts.concat(popularPodcasts, featuredPodcasts)
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

      featuring.classList.replace('featuring', 'featuring-not-found')
      return featuring.appendChild(tagMessage)      
    }
    
    featuring.classList.replace('featuring-not-found', 'featuring')
    renderTemplate(searchTopic, featuring)
  })

  const setLocalStorage = (name, data) => {
    window.localStorage.setItem(name, JSON.stringify(data))
  }

  async function cacheExist (name, URL) {
    const listName = `${name}Podcasts`
    const cache = window.localStorage.getItem(listName)

    if(cache) {
      return JSON.parse(cache)
    }

    const data = await getData(URL)
    setLocalStorage(listName, data)

    return data
  }
  
  const basicPodcasts = await cacheExist('basic', 'audio_clips')
  renderTemplate(basicPodcasts, basicContainer)
  
  const popularPodcasts = await cacheExist('popular', 'audio_clips/popular')
  renderTemplate(popularPodcasts, popularContainer)
  
  const featuredPodcasts = await cacheExist('featured', 'audio_clips/featured')
  renderTemplate(featuredPodcasts, featuredContainer)

})()



