
import { config } from "dotenv"
import { app } from "./app"



function init() {
    config({
        path : "./.env"
     })
     const PORT = process.env.PORT ? process.env.PORT : 6000
     app.listen(PORT , ()=>{
        console.log(`server is Running at port ${PORT} `);
        
     })

}

init()
