async function getToken() {
    const href = window.location.href;
    const url = href.replace("/adm.html", "");
    const requestUrl = `${url}/token/`;

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const token = await response.json()

    console.log(token.token)

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

    console.log(results)
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
