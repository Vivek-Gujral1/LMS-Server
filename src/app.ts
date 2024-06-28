import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true
}))

app.use(express.json({limit : "20kb"}))
app.use(express.urlencoded({extended: true , limit : "20kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import UserRouter from "./routes/user.routes"
import CourseRouter from "./routes/course.routes"
import videoRouter from "./routes/video.routes"

app.use("/api/user" , UserRouter)
app.use("/api/course" , CourseRouter )
app.use("/api/video" , videoRouter)

export {app}