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

async function generateDateNow(){
    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; 
    return dateString
}

tokenRoutes.get('/' , async (req, res) => {
    try {
        const dateString = await generateDateNow(); // Formato YYYY-MM-DD
        console.log(dateString + ' data de hoje')
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

tokenRoutes.post('/checkin', async (req, res) => {
    const { token } = req.body

    
    console.log("Token recebido:", token)
    const queryToken = new Parse.Query('Token') 
    queryToken.equalTo('tokenDigit', token)
    
    try{

        const dateNow = await generateDateNow()
        const result = await queryToken.first()
        const tokenDate = result.get('dateCreated')
        const tokenDigit = result.get('tokenDigit') 
        console.log(`Token encontrado ${tokenDigit} Data: ${tokenDate}, data de hoje ${dateNow}`)
        if (!result || tokenDate !== dateNow) {
          console.error({error: 'Token invalido'})
        } else {
          return res.status(202).send({ token: tokenDigit, "Data:": tokenDate });
        }


    }catch(error){
        return res.status(404).send({ message: "Token invalido", error });
    }
})


export default tokenRoutes