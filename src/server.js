import { app } from "./app.js";
import env from "./env.js";


app.listen(env.PORT, env.NODE_ENV === 'production'? '0.0.0.0' : 'localhost' 
    , () => {
    console.log(`Servidor rodando no http://localhost:${env.PORT}`)
})