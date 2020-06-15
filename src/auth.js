import { modal } from "./modal";

export function auth(options = {}) {
  return new Promise((resolve, reject) => {
    const $modal = modal({
      title: "Авторизация",
      width: "600px",
      content: _getAuthForm(),
      closable: true,
      onClose() {
        $modal.destroy();
      },
      footerButtons: [
        {
          text: "Войти",
          type: "primary",
          handler(event) {
            event.preventDefault();
            const apiKey = "AIzaSyCe54dh4ur5uJFoRFMyynTtl5yo9VF6x_c";
            const email = document.querySelector("#email").value;
            const password = document.querySelector("#password").value;
            const btn = event.target;
            btn.disabled = true;
            return fetch(
              `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
              {
                method: "POST",
                body: JSON.stringify({
                  email,
                  password,
                  returnSecureToken: true,
                }),
                headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Request-Method": "*",
                },
              }
            )
              .then((res) => res.json())
              .then((data) => {
                if (data && data.error) {
                  reject(data.error);
                  btn.disabled = false;
                } else {
                  resolve(data.idToken);
                }
                $modal.close();
              });
          },
        },
      ],
    });
    $modal.open();
  });
}

function _getAuthForm() {
  return `
   <form class="mui-form" id="auth-form">
        <div class="mui-textfield mui-textfield--float-label">
            <input type="email" id="email" required>
            <label for="email">Email</label>
        </div>
        <div class="mui-textfield mui-textfield--float-label">
            <input type="password" id="password" required>
            <label for="password">Password</label>
        </div>
    </form>
  `;
}
