import prisma from "../constants/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express"
import { RegisterUserBody } from "../TypeScript Types/User Types/user";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt"


const registerUser = asyncHandler(async (req: Request, res: Response) => {

    try {
        const { name, email, password }: RegisterUserBody = req.body

        const existedUserVerified = await prisma.user.findFirst({
            where: {
                email,
            }
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)

        if (existedUserVerified && existedUserVerified.isVerified) {
            return res
                .status(400)
                .json(new ApiResponse(false, "user already registered with this email"))
        }

        else if (existedUserVerified && existedUserVerified.isVerified === false) {
            // in this case we tackle for if one user registers and not verified his email and second user comes and registers with same email then we give email to second user if second user verifies email
            const hashedPassword = await bcrypt.hash(password, 10)

            // update user 
            await prisma.user.update({
                where: {
                    id: existedUserVerified.id
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

        const createdUser = await prisma.user.create({
            data: {
                email: email,
                name: name
            }
        })
        console.log(createdUser);


        return res.json({
            "message": "wah chal pya"
        })
    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(false, "error while registering user"))
    }

})

export { registerUser }

