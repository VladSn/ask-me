import './style.css'
import {isValid} from "./utils";
import {modal} from "./modal";
import {Question} from "./question";
import {auth} from "./auth";

const modalBtn = document.getElementById('modal-btn')
const form = document.getElementById('form')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')
const $modal = modal({
  width: '400px',
  closable: true,
})

window.addEventListener('load', Question.renderList)
modalBtn.addEventListener('click', openModal)
form.addEventListener('submit', submitFormHandler)
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event) {
  event.preventDefault()

  if (isValid(input.value)) {
  const question = {
    text: input.value.trim(),
    date:new Date().toJSON()
  }

    submitBtn.disabled = true
    // Async request to the server to save data
    Question.create(question).then(() => {
      console.log(question);
      input.value = ''
      input.className = ''
      submitBtn.disabled = false
    })
  }
}

function openModal() {
  auth()
  .then(Question.fetch).then(renderModalAfterAuth)
  .catch(renderModalAfterAuth)
}

function renderModalAfterAuth(content) {
  if (content && content.message) {
    $modal.setTitle('Ошибка')
    $modal.setContent(`<p class="error">${content.message}</p>`)
    $modal.open()
  } else {
    $modal.setTitle('Список вопросов')
    $modal.setContent(`${Question.listToHtml(content)}`)
    $modal.open()
  }
  console.log('2',content);
}