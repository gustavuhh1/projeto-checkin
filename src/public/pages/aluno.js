// Logica de escrita e pagar Inputs tokenCamp
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".tokenCamp");

  inputs.forEach((input, index) => {
    input.addEventListener("input", (e) => {
      // Avança para o próximo input automaticamente
      if (e.target.value && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      // Volta para o campo anterior ao apertar Backspace
      if (e.key === "Backspace" && !e.target.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".tokenCamp");
  const chekinButton = document.getElementById("checkinbtn");

  // Evento de clique no botão
  chekinButton.addEventListener("click", async () => {
    // Coleta os valores dos inputs
    const tokenValues = Array.from(inputs).map((input) => input.value.trim());
    const tokenLowcase = tokenValues.join("");
    const token = tokenLowcase.toUpperCase() // Combina os 4 dígitos em uma string
    // Valida se todos os campos foram preenchidos
    if (token.length !== 4 || tokenValues.includes("")) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const href = window.location.href;
    const url = href.replace('/aluno.html', '')
    const requestUrl = `${url}/token/`


    await fetch(requestUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    
    try{
        const response = await fetch(`${requestUrl}checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({token}),
        })
    
        if(response.ok){
            const data = await response.json();
            console.log(data)
            alert('Checkin feito com sucesso')
        }else {
            const errorData = await response.json();
            console.error(errorData)
            alert('Error: Token não encontrado', errorData)
        }

    }catch (error) {
      console.error("Erro na requisição:", error);
    }

  });
});


