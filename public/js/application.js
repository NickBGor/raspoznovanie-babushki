const { speechSynthesis } = window
const form = document.querySelector('#send-image')
const playBtn = document.querySelector('.play')
const stopBtn = document.querySelector('.stop')
const voicesSelect = document.querySelector('.voices')
const textArea = document.querySelector('.text')

let text = ''

let voices = []

function showElement(element) {
  element.classList.add('visible')
  element.classList.remove('hidden')
}

function hideElement(element) {
  element.classList.add('hidden')
  element.classList.remove('visible')
}

textArea.addEventListener('input', () => {
  if (textArea.value !== '') {
    showElement(playBtn)
  } else {
    hideElement(playBtn)
    hideElement(stopBtn)
  }
})

function generateVoices() {
  voices = speechSynthesis.getVoices()

  const voiceList = voices
    .map((voice, index) => voice.lang === 'ru-RU' && `<option value="${index}">${voice.name} ${voice.lang}</option>`)
    .join('')

  voicesSelect.innerHTML = voiceList
}

generateVoices()
speechSynthesis.addEventListener('voiceschanged', generateVoices)

function speak(content) {
  if (speechSynthesis.speaking) {
    console.log('Текст уже воспроизводиться!')
    return
  }
  const speech = new SpeechSynthesisUtterance(content)
  speech.voice = voices[voicesSelect.value]
  speechSynthesis.speak(speech)
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  textArea.value = ''
  const file = document.getElementById('file').files[0]
  if (!file) return

  const { method, action } = form

  const data = new FormData()
  data.append('file', file)

  const response = await fetch(action, {
    method,
    body: data,
  })

  const answer = await response.json()
  const content = answer.text.split('\n')

  content.forEach((el) => {
    text += `${el}\n`
  })

  textArea.value = text

  form.reset()
})

playBtn.addEventListener('click', () => {
  speak(textArea.value)
  if (stopBtn.classList.contains('hidden')) {
    showElement(stopBtn)
  }
})

stopBtn.addEventListener('click', () => {
  speechSynthesis.cancel()
  if (stopBtn.classList.contains('visible')) {
    hideElement(stopBtn)
  }
})
