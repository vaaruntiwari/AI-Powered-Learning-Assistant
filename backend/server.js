import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'

const __filename=fileURLToPath(import.meta.url)
const __dirname=dirname(__filename)

//Initialize express app
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Connect mongodb
connectDB()


//Middleware to handle CORS

app.use(
    cors({
        origin:"*",
        methods:["GET","POST","PUT","DELETE"],
        allowedHeaders:["Content-Type","Authorization"],
        credentials:true
    })
)

app.use("/api/auth",authRoutes)
app.use("/api/documents",documentRoutes)
app.use("/api/flashcards",flashcardRoutes)
app.use("/api/ai",aiRoutes)
app.use("/api/quizzes",quizRoutes)
app.use("/api/progress",progressRoutes)


//Static folder for uploads
app.use(express.static(path.join(__dirname,'uploads')))
app.use(errorHandler)

app.use((req,res)=>{
    res.status(404).json({
        sucess:false,
        error:'Route not found',
        statusCode:404
    })
})

const PORT=process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`);
    
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error:${err.message}`)
    process.exit(1)
})