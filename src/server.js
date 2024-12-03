import { app } from "./app.js";
import env from "./env.js";


app.listen(env.PORT, 
    'localhost', () => {
    console.log(`Servidor rodando no http://localhost:${env.PORT}`)
})