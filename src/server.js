import { app } from "./app.js";
import env from 'dotenv'
env.config()


app.listen(process.env.PORT, 
    'localhost', () => {
    console.log(`Servidor rodando no http://localhost:${process.env.PORT}`)
})