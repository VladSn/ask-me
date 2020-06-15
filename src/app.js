import "./style.css";
import { isValid } from "./utils";
import { modal } from "./modal";
import { Question } from "./question";
import { auth } from "./auth";

const modalBtn = document.getElementById("modal-btn");
const modalBtnOut = document.getElementById("modal-btn-out");
const form = document.getElementById("form");
const input = form.querySelector("#question-input");
const submitBtn = form.querySelector("#submit");
const $modal = modal({
  width: "400px",
  closable: true,
});

window.addEventListener("load", Question.renderList);
modalBtn.addEventListener("click", openModal);
modalBtnOut.addEventListener("click", logOut);
form.addEventListener("submit", submitFormHandler);
input.addEventListener("input", () => {
  submitBtn.disabled = !isValid(input.value);
});

function submitFormHandler(event) {
  event.preventDefault();

  if (isValid(input.value)) {
    const question = {
      text: input.value.trim(),
      date: new Date().toJSON(),
    };

    submitBtn.disabled = true;
    // Async request to the server to save data
    Question.create(question).then(() => {
      input.value = "";
      input.className = "";
      submitBtn.disabled = false;
    });
  }
}

function openModal() {
  const token = JSON.parse(localStorage.getItem("token" || ""));
  if (!token) {
    auth()
      .then(Question.fetch)
      .then(renderModalAfterAuth)
      .catch(renderModalAfterAuth);
  } else {
    Question.fetch(token)
      .then(renderModalAfterAuth)
      .catch(renderModalAfterAuth);
  }
}

function renderModalAfterAuth(content) {
  if (content && content.message) {
    $modal.setTitle("Ошибка");
    $modal.setContent(`<p class="error">${content.message}</p>`);
    $modal.open();
  } else {
    $modal.setTitle("Список вопросов");
    $modal.setContent(`${Question.listToHtml(content)}`);
    $modal.open();
  }
}

function logOut() {
  const token = JSON.parse(localStorage.getItem("token" || ""));
  if (token) {
    localStorage.removeItem("token");
    $modal.setTitle("Оповещение");
    $modal.setContent("<p>Вы успешно вышли из системы.</p>");
    $modal.open();
  }
}
