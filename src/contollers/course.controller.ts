import prisma from "../constants/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request , Response } from "express";



const createCourse = asyncHandler(async(req : Request , res : Response)=>{
    const user = req.user
    if (!user) {
        return res.status(401).json({
            success : false ,
            message :"Not Authenticated"
        })
    }
    try {
        const {name , description} : {name : string , description? : string} = req.body

        if(name.trim() === ""){
            return res.status(400).json({
                success : false ,
                message : "All fields are required"
            })
        }
        
        const socketRoomName = `${user.id}_${name}` // we already check that we get only unique name by user from user courses
      
       // creates course

       await prisma.course.create({
        data : {
            name ,
            description ,
            socketRoomName ,
            courseOwner : {
                connect : {
                    id : user.id
                }
            }
        }
       })
      
       return res.status(200).json({
        success  : true ,
        message : "Course Created Successfully"
       })

    }
    catch{
        return res.status(500).json({
            success : false ,
            message : "error while creating course"
        })
    }
})

const CheckExistingCourseByUser = asyncHandler(async(req : Request , res : Response)=>{
    const user = req.user
    if(!user){
        return res.status(401).json({
            success : false ,
            message : "Not Authenticated"
        })
    }
    try {
        const {name} = req.query
        if (!name) {
            res.status(400).json({
                success : false ,
                message :"All fields are required"
            })
        }
        const CheckExistingCourseByUser = await prisma.course.findFirst({
            where :{
                AND :[
                    {
                        name : String(name)
                    } ,
                    {
                        id : user.id
                    }
                ]
            }
        })
        if (CheckExistingCourseByUser) {
            return res.status(400).json({
                success  : false ,
                message : "User Already created course with this name"
            })
        }else{
            return res.status(200).json({
                success : true ,
                message : "Course name is Unique"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success : false ,
            message : "error while checking course name"
        })
    }
})


export {CheckExistingCourseByUser , createCourse}