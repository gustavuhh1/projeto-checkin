import express from "express";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = dirname(fileURLToPath(import.meta.url));

import authRoutes from "./routes/authRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

export const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/auth', authRoutes)
app.use('/token', tokenRoutes)
app.use('/adm', adminRoutes)

app.use('/', express.static(path.join(__dirname, './public/pages/'), {
    extensions: ['html, css'],
    redirect: '/'
}))