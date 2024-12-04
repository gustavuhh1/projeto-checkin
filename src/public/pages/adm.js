async function getTokenFromBackend() {
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
  const tokenResponse = await getTokenFromBackend();
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
displayTokenInSpans()

document.addEventListener('DOMContentLoaded', () => {
    const btnBack = document.getElementById("btnBack");




    btnBack.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "/";
    });
})
