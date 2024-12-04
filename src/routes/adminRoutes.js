import { Router } from "express";
import bcrypt from "bcrypt";
import Parse from "../database.js";

const adminRoutes = Router();

adminRoutes.get('/log', async (req, res) => {

    const query = new Parse.Query('Alunos')
    query.select("username","matricula", "lastCheckin","lastCheckout")
    try{
        const results = await query.find();
        const objectsArray = results.map((result) => ({
          username: result.get("username"),
          matricula: result.get("matricula"),
          lastCheckin: result.get("lastCheckin"),
          lastCheckout: result.get("lastCheckout"),
        }));
        
        return res.status(200).send(objectsArray)

    }catch(e){
        return res.status(400).send({message: 'Erro na busca do banco de dados'})
    }
})

export default adminRoutes;