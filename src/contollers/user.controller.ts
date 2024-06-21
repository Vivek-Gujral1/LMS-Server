import prisma from "../constants/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express"
import { RegisterUserBody } from "../TypeScript Types/User Types/user";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt"
import { emailQueue } from "../constants/emailQueue";

const registerUser = asyncHandler(async (req: Request, res: Response) => {

    try {
        const { name, email, password }: RegisterUserBody = req.body
        console.log(req.body);


        const existedUser = await prisma.user.findFirst({
            where: {
                email,
            }
        })
        console.log(existedUser);


        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        if (existedUser && existedUser.isVerified) {
            return res
                .status(400)
                .json(new ApiResponse(false, "user already registered with this email"))
        }

        else if (existedUser && existedUser.isVerified === false) {
            // in this case we tackle for if one user registers and not verified his email and second user comes and registers with same email then we give email to second user if second user verifies email
            const hashedPassword = await bcrypt.hash(password, 10)

            // update user 
            await prisma.user.update({
                where: {
                    id: existedUser.id
                },
                data: {
                    password: hashedPassword,
                    name,
                    verifyCode,
                    verifyCodeExpiry: expiryDate
                }
            })


        }

        else {
            // creates a new User 


            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            // creating user
            await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate
                }
            })



        }

        // adding email into queue for sending verifycode 
        await emailQueue.add(`${Date.now}`, {
            to: email,
            subject: "Please Verify your Account",
            body: `Dear User , Please verify your email  , your verification code ${verifyCode} `
        })

        return res.json(new ApiResponse(true, "user created"))


    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json(new ApiResponse(false, "error while registering user"))
    }

})

export { registerUser }

