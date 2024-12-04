const btnAcesso = document.getElementById("btnAcesso");
const matriculaInput = document.getElementById("floatingInput");
const senhaInput = document.getElementById("floatingPassword");

// Adiciona evento de clique no botão
btnAcesso.addEventListener("click", async () => {
  // Obtém os valores dos inputs
  const matricula = matriculaInput.value;
  const password = senhaInput.value;
  const href = window.location.href;

  // Verifica se os campos não estão vazios
  if (!matricula || !password) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  // Faz uma requisição fetch
  fetch(`${href}auth/login`, {
    method: "POST", // Método da requisição
    headers: {
      "Content-Type": "application/json", // Tipo de conteúdo
    },
    body: JSON.stringify({ matricula, password }), // Dados a serem enviados
  })
    .then((response) => response.json()) // Trata a resposta como JSON
    .then((data) => {
        const isAdmin = data.usuario.isAdmin || false
        console.log(isAdmin)
      // Lógica para o que fazer com a resposta do servidor
      if (data.usuario) {
        if(isAdmin){
            window.location.href = "./adm.html"
        }else{
            window.location.href = './aluno.html'
        }
        alert("Login bem-sucedido!");
        // window.location.href = "/dashboard"; // Redireciona para outra página
      } else {
        alert("Login ou senha inválidos.");
      }
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("Ocorreu um erro ao tentar fazer login.");
    });
});