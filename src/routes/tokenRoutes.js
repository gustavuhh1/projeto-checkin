import {Router} from 'express'
import Parse from '../database.js'

const tokenRoutes = Router()


function generateAlphanumericToken(length = 4) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token.toUpperCase();
}

export async function generateDateNow(withHours) {
  const today = new Date();
  const dateString = today.toISOString().split("T")[0];

  if (withHours) {
    // Se withHours for true, incluir hora, minuto e segundo
    const timeString = today.toISOString().split("T")[1].split(".")[0]; // Remove a parte dos milissegundos
    return `${dateString} ${timeString}`; // Ex: "2024-12-04 15:30:45"
  }

  // Se não, retorna apenas a data
  return dateString; // Ex: "2024-12-04"
}

tokenRoutes.get('/' , async (req, res) => {
    try {
        const dateString = await generateDateNow(false); // Formato YYYY-MM-DD
        // Cria uma query para buscar um token com a data de hoje
        const TokenClass = Parse.Object.extend('Token');
        const query = new Parse.Query(TokenClass);
        query.equalTo('dateCreated', dateString);

        const existingToken = await query.first();
        if (existingToken) {
            // Retorna o token já existente
            return res.status(202).json({ token: existingToken.get('tokenDigit') });
        } else {
            // Cria um novo token
            const newStringToken = generateAlphanumericToken()
            const newToken = new Parse.Object('Token')
            newToken.set('tokenDigit', newStringToken)
            newToken.set('dateCreated', dateString)
            await newToken.save()

            return res.status(201).send({message: `token criado: ${newStringToken}`})  
        }
    }catch(e){
        return 'a'
    }
}    
)

tokenRoutes.post('/checkout', async (req, res) => {
    const { token, user } = req.body

    
    console.log("Token recebido:", token)
    console.log("Usuário recebido:", user)
    // token
    const queryToken = new Parse.Query('Token') 
    queryToken.equalTo('tokenDigit', token)
    // Usuário
    const queryUser = new Parse.Query('Alunos')
    queryUser.equalTo('matricula', user.matricula)
    
    try{
        const dateNow = await generateDateNow(false)
        const user = await queryUser.first()
        const resultToken = await queryToken.first()
        const tokenDate = resultToken.get('dateCreated')
        const tokenDigit = resultToken.get('tokenDigit') 
        console.log(`Token encontrado ${tokenDigit} Data: ${tokenDate}, data de hoje ${dateNow}`)
        if (!resultToken || tokenDate !== dateNow) {
          console.error({error: 'Token invalido'})
        } else {
          const DateWithHourNow = await generateDateNow(true)
          user.set("lastCheckout", DateWithHourNow);
          await user.save()

          return res
            .status(202)
            .send({ token: tokenDigit, "Checkout:": DateWithHourNow });
        }


    }catch(error){
        return res.status(404).send({ message: "Token invalido", error });
    }
})


export default tokenRoutes