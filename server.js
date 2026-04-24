import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import { router, router2 } from './routes/tasks.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware, authMiddleware2 } from './middleware/auth.js'
import cookieParser from "cookie-parser";

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PORT = process.env.PORT || 5000;

app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'views')))
app.use("/api/workers", router)
app.use("/assets", express.static(path.resolve("employer-public/dist/assets")))
app.use('/auth', router2)

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'employee-login.html'))
})

app.get('/employer-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'employer-login.html'))
})

app.get('/employer-register', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'employer-register.html'))
})

app.get('/employee', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "employee-public", "index.html"));
});

app.get('/', authMiddleware2, (req, res) => {
  res.sendFile(path.resolve("employer-public", "dist", "index.html"));
});

app.get(/.*/, authMiddleware, (req, res) => {
  res.sendFile(path.resolve("employer-public", "dist", "index.html"));
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.log(err)
      return;
    }
    console.log(`Server is running on PORT ${PORT}`)
  })
})
