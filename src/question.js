export class Question {
  static create(question) {
    return fetch('https://ask-me-e1691.firebaseio.com/questions.json', {
      method: 'POST',
      body: JSON.stringify(question),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(res => {
      question.id = res.name
      return question
    })
    .then(addToLocalStorage)
    .then(Question.renderList)
  }

  static fetch(token) {
    if (!token){
      return Promise.resolve(`<p class="error">Нет токена</p>`)
    }
    return fetch(`https://ask-me-e1691.firebaseio.com/questions.json?auth=${token}`)
      .then(res => res.json())
      .then(res => {
        if (res && res.error) {
          return `<p class="error">${res.error}</p>`
        }

        return res ? Object.keys(res).map(key => ({
          ...res[key],
            id: key
        })) : []
      })
  }

  static listToHtml(list) {
    return list.length
    ? `<ol>${list.map(el => `<li>${el.text}</li>`).join('')}</ol>`
      : `<p>Нет вопросов</p>`
  }

  static renderList() {
    const questions = getQuestionsFromLocalStorage()

    const html = questions.length
      ? questions.map(toCard).join('')
      : `<div class="mui--text-headline">Вы пока ничего не спрашивали</div>`

    const list = document.getElementById('list')
    list.innerHTML = html
  }
}

function addToLocalStorage(question) {
  const all = getQuestionsFromLocalStorage()
  all.push(question)
  localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
  return JSON.parse(localStorage.getItem('questions') || "[]")
}

function toCard(question) {
  return `
    <div class="mui--text-black-54">
        ${new Date(question.date).toLocaleDateString()}
        ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br>
  `
}