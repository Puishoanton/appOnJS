export class Question {
  static create(question) {
    return fetch(
      'https://question-app-puisho-default-rtdb.europe-west1.firebasedatabase.app/question.json',
      {
        method: 'POST',
        body: JSON.stringify(question),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then(response => response.json())
      .then(response => {
        question.id = response.name
        return question
      })
      .then(addToLocalStorage)
      .then(Question.renderList)
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve(`<p class= 'error'>You have not token</p>`)
    }
    return fetch(
      `https://question-app-puisho-default-rtdb.europe-west1.firebasedatabase.app/question.json?auth=${token}`
    )
      .then(response => response.json())
      .then(response => {
        if (response && response.error) {
          return `<p class= 'error'>${error}</p>`
        }
        return response
          ? Object.keys(response).map(key => ({
              ...response[key],
              id: key,
            }))
          : []
      })
  }

  static listToHTML(questions) {
    return questions.length
      ? `<ol>${questions.map(question => `<li>${question.text}</li>`).join('')}</ol>`
      : `<div> <h2>There are no questions yet.</h2></div>`
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage()

    const html = questions.length
      ? questions.map(toCard).join('')
      : `<div> <h2>There are no questions yet.</h2></div>`

    const list = document.getElementById('list')
    list.innerHTML = html
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage()
  all.push(question)
  localStorage.setItem('question', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('question') || '[]')
}

function toCard(question) {
  return `
    <div>
    <div>
    ${new Date(question.data).toLocaleDateString()}
    ${new Date(question.data).toLocaleTimeString()}
     </div>
    <div>${question.text}</div>
    </div>
    <br>`
}
