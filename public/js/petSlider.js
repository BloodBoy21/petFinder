/* eslint-disable  no-unused-vars, no-undef  */
const swiper = new Swiper('.mySwiper', {
  slidesPerView: 1,
  spaceBetween: 30,
  centeredSlides: true,
  loop: true,
  autoplay: {
    delay: 10000,
    disableOnInteraction: false
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
})
const urlBase = 'http://192.168.100.42:3000/api'
const displayContainer = document.getElementById('json-container')
const searcButton = document.getElementById('search-btn')
const searchInput = document.getElementById('search-input')
searcButton.addEventListener('click', () => {
  const mainContainer = document.getElementById('api-data')
  if (mainContainer.classList.contains('hidden')) {
    mainContainer.classList.remove('hidden')
  }
  const data = searchInput.value ? searchInput.value : 'adopt/1'
  const url = `${urlBase}/${data}`
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayContainer.innerHTML = ''
      const showData = Array.isArray(data) ? displayPets : displayPet
      showData(data)
    })
})

function displayPets(data) {
  data.forEach(async (pet) => {
    await displayPet(pet)
  })
}
async function displayPet(data) {
  const petDiv = await jsonStruct(data)
  displayContainer.appendChild(petDiv)
}
function jsonStruct(data) {
  return new Promise((resolve, reject) => {
    try {
      const bracketR = document.createElement('p')
      const bracketL = document.createElement('p')
      bracketL.textContent = '{'
      bracketR.textContent = '}'
      const div = document.createElement('div')
      div.classList.add(...'m-4 mx-5 flex flex-col w-full'.split(' '))
      div.appendChild(bracketL)
      Object.keys(data).forEach((key) => {
        const p = document.createElement('p')
        p.innerText = `${key}: ${data[key]}`
        div.appendChild(p)
      })
      div.appendChild(bracketR)
      resolve(div)
    } catch (e) {
      reject(e)
    }
  })
}
/* Pet Carousel */
function createCard(data) {
  const elements = createElements()
  elements.aside.appendChild(createCardImage(data.image))
  elements.content.appendChild(createCardContent(data.name))
  elements.card.appendChild(elements.aside)
  elements.card.appendChild(elements.content)
  elements.cardContainer.appendChild(elements.card)
  return elements.cardContainer
}
function createElements() {
  const cardContainer = document.createElement('div')
  cardContainer.classList.add(
    ...'swiper-slide flex items-center justify-center md:w-full'.split(' ')
  )
  const content = document.createElement('div')
  const aside = document.createElement('aside')
  const card = document.createElement('div')
  card.classList.add('card')
  aside.classList.add('card-img')
  content.classList.add('card-content')
  return { content, card, aside, cardContainer }
}
function createCardImage(image) {
  const img = document.createElement('img')
  img.src = image
  return img
}
function createCardContent(value) {
  const p = document.createElement('p')
  p.classList.add(...'capitalize text-xl font-mono'.split(' '))
  p.textContent = `${value}`
  return p
}

async function fetchPet(id) {
  return new Promise((resolve, reject) => {
    fetch(`${urlBase}/adopt/${id}`)
      .then((response) => {
        if (response.status === 404) {
          reject(new Error('Pet not found'))
        }
        return response.json()
      })
      .then((data) => {
        data.name = data.name.toLowerCase()
        const card = createCard(data)
        swiper.appendSlide(card)
        resolve(data)
      })
      .catch((e) => {
        reject(e)
      })
  })
}

async function createRandomCards() {
  const randomPet = Math.floor(Math.random() * 205) + 1
  try {
    await fetchPet(randomPet)
  } catch (e) {
    await createRandomCards()
  }
}

window.onload = async function () {
  await fetchPet(206)
  petProcess = []
  for (let i = 0; i < 4; i++) {
    petProcess.push(createRandomCards())
  }
  await Promise.all(petProcess)
}
