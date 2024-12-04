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

tokenRoutes.get('/' , async (req, res) => {
    try {
        const today = new Date();
        const dateString = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
        console.log(dateString + ' data de hoje')
        // Cria uma query para buscar um token com a data de hoje
        const TokenClass = Parse.Object.extend('Token');
        const query = new Parse.Query(TokenClass);
        query.equalTo('dateCreated', dateString);

        const existingToken = await query.first();
        if (existingToken) {
            // Retorna o token já existente
            return res.json({ token: existingToken.get('tokenDigit') });
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


export default tokenRoutes