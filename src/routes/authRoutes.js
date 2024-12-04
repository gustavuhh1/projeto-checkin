import { Router } from "express";
import bcrypt from 'bcrypt'
import Parse from "../database.js";
import { generateDateNow } from "./tokenRoutes.js";


const authRoutes = Router();




authRoutes.post("/register", async (req, res) => {
  const { username, password, matricula, isAdmin } = req.body;

  const encryptPassword = bcrypt.hashSync(password, 10);

  const query = new Parse.Query("Alunos");
  query.equalTo("matricula", matricula);

  try {
    await query.first().then(async (exist) => {
      if (!exist) {
        const schema = isAdmin === true ? "Admin" : "Alunos";
        const newAluno = new Parse.Object(schema);
        newAluno.set("username", username);
        newAluno.set("password", encryptPassword);
        newAluno.set("matricula", matricula);
        newAluno.set("isAdmin", isAdmin);
        newAluno.set("lastCheckin", ' ')
        newAluno.set("lastCheckout", ' ')

        const created = await newAluno.save();
        return res.status(201).send({
          created,
          message: `${schema} criado(s) com sucesso`,
        });
      } else {
        throw new Error("Aluno existente");
      }
    });
  } catch (error) {
    res.status(409).send(error);
  }
});

authRoutes.post('/login', async (req, res, next) => {
    const { matricula, password} = req.body;
    
    const queryAlunos = new Parse.Query('Alunos')
    queryAlunos.equalTo('matricula', matricula)
    const queryAdmins = new Parse.Query('Admin')
    queryAdmins.equalTo('matricula', matricula)

    try{
        const query = Promise.all([queryAdmins.find(), queryAlunos.find()])
            .then(([resultAdmin, resultAluno]) => {

        if (resultAluno[0]) {
          return resultAluno[0];
        } else if (resultAdmin[0]) {
          return resultAdmin[0];
        }else{
            throw new Error('Usuário não encontrado')
        }
        })

        const user = await query
        
        const result = bcrypt.compareSync(password, await user.get('password'))
        if(!result){
            throw new Error('Usuário não existente/ou Senha inválida')
        }else{
            user.set("lastCheckin", await generateDateNow(true));

            await user.save()

            const getUser = {
              username: await user.get("username"),
              password: await user.get("password"),
              matricula: await user.get("matricula"),
              isAdmin: await user.get("isAdmin"),
              lastCheckin: await user.get("lastCheckin"),
              lastCheckout: await user.get('lastCheckout')
            };
          
            res.status(200).send({ message: "Usuário logado 🚀", usuario: getUser });
        }
    } catch(Error){
        res.status(401).send(Error);
    }

})

export default authRoutes;