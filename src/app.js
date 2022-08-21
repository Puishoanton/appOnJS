import { isValid, createModal } from './utils'
import { Question } from './question'
import { getAuthForm, authWithEmailandPassword } from './auth'
import './style.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHAndler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
  submitBtn.disabled = !isValid(input.value)
})

function submitFormHAndler(event) {
  event.preventDefault()

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      data: new Date().toJSON(),
    }

    submitBtn.disabled = true

    //Async request to server for saving question

    Question.create(question).then(() => {
      input.value = ''
      input.className = ''
    })
  }
}
function openModal() {
  createModal('Log in', getAuthForm())
  document.getElementById('auth-form').addEventListener('submit', authFormHandler, { once: true })
}

function authFormHandler(event) {
  event.preventDefault()
  const email = event.target.querySelector('#email').value
  const password = event.target.querySelector('#password').value
  const btn = event.target.querySelector('button')

  btn.disabled = true
  authWithEmailandPassword(email, password)
    .then(token => Question.fetch(token))
    .then(content => renderModalAfterAuth(content))
    .then(() => {
      btn.disabled = false
    })
}

function renderModalAfterAuth(content) {
  if (typeof content === 'string') {
    return createModal('Error', content)
  } else {
    return createModal('Questions list:', Question.listToHTML(content))
  }
}
