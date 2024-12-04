async function getToken() {
    const href = window.location.href;
    const url = href.replace("/adm.html", "");
    const requestUrl = `${url}/token/`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const token = await response.json()

    return JSON.stringify(token.token)
}

// Função para exibir o token nos spans
async function displayTokenInSpans() {
  // Obter os spans dentro de #numberBox
  const spans = document.querySelectorAll("#numberBox span");

  // Obter o token do backend
  const tokenResponse = await getToken();
  const token = tokenResponse.replace('"', '')
  const token_digits = token.split('')

  spans.forEach((span, index) => {
    if (index < token_digits.length) {
      span.textContent = token_digits[index];
    } else {
      span.textContent = ""; // Limpar spans extras, se houver
    }
  });

}

async function displayUsersInList() {
    
    const href = window.location.href;
    const url = href.replace("/adm.html", "");
    const requestUrl = `${url}/adm/log`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    const results = await response.json()
    
    const ul = document.getElementById("listAluno");

    results.forEach((result) => {
        const user = {
          username: result.username,
          matricula: result.matricula,
          lastCheckin: result.lastCheckin,
          lastCheckout: result.lastCheckout,
        };

        const li = document.createElement('li')

        li.innerHTML = `<b>${user.username}</b>: ${user.matricula} <br>Checkin: ${user.lastCheckin}<br>Checkout: ${user.lastCheckout}`
        li.className = 'liItem'
        ul.appendChild(li)
    })


}   

document.addEventListener('DOMContentLoaded', () => {
    displayUsersInList();
    displayTokenInSpans();
    const btnBack = document.getElementById("btnBack");

    btnBack.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/";
    });
})


const toggleBtn = document.querySelector(".toggle-btn");
const formContainer = document.getElementById("formContainer");
const sendBtn = document.getElementById("sendBtn");

toggleBtn.addEventListener("click", () => {
  if (formContainer.style.display === "none" || formContainer.style.display === "") {
    formContainer.style.display = "flex";
    toggleBtn.textContent = "Fechar";
  } else {
    formContainer.style.display = "none";
    toggleBtn.textContent = "Novo Usuário";
  }
});

sendBtn.addEventListener("click", async () => {
  const username = document.getElementById("nome").value;
  const matricula = document.getElementById("matricula").value;
  const password = document.getElementById("senha").value;
  const isAdmin = document.getElementById("admin").checked;

  const data = {
    username,
    password,
    matricula,
    isAdmin
  };
  console.log(data)
const href = window.location.href;
const url = href.replace("/adm.html", "");
const requestUrl = `${url}/auth/register`;
  try {
    const response = await fetch(`${requestUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert("Cadastro realizado com sucesso!");
    } else {
      alert("Erro ao realizar cadastro.");
    }
  } catch (error) {
    alert("Erro na requisição: " + error.message);
  }
});