
(async function load(){
  const API = 'https://api.audioboom.com/'

  /* Function get data api Audioboom */
  async function getData(URL) {
    const result = await fetch(`${API}${URL}`)
    const { body: { audio_clips } } = await result.json()

    return audio_clips
  }
  
  /* Data Api Audioboom */
  const basicPodcasts = await getData('audio_clips')
  const popularPodcasts = await getData('audio_clips/popular')
  const featuredPodcasts = await getData('audio_clips/featured')

  /* Elements DOM */
  const home = document.getElementById('home')
  const modal = document.getElementById('modal')

  const basicContainer = document.getElementById('basicContainer')
  const popularContainer = document.getElementById('popularContainer')
  const featuredContainer = document.getElementById('featuredContainer')
  
  /* Functions to manipulate the HTML (create and add) */
  const HTMLTemplate = podcasts => {
    return (`
      <div>
        <figure>
          ${ /* <img 
            src="${podcasts.urls.image || podcasts.channel && podcasts.channel.urls.logo_image.original}" 
            alt="${podcasts.title}"
          > */ ''}
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
    container.querySelector('img').remove()

    list.forEach(podcasts => {
      const HTMLString = HTMLTemplate(podcasts)
      const podcastsElement = createTemplate(HTMLString)
         
      container.append(podcastsElement)
    })
  }
  
  debugger
  
  /* Render dates */
  renderTemplate(basicPodcasts, basicContainer)
  renderTemplate(popularPodcasts, popularContainer)
  renderTemplate(featuredPodcasts, featuredContainer)
  
  debugger
})()



