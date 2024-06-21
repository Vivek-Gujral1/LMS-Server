import { Queue } from "bullmq"

export const emailQueue = new Queue("email-queue", {
    connection : {
        host : "localhost",
        port : 6379 , 
    }
})