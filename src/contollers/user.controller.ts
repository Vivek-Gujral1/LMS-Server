import prisma from "../constants/prisma";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import {
  RegisterUserBody,
  loginUserBody,
  verifyCodeBody,
} from "../TypeScript Types/User Types/user";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcrypt";
// import { emailQueue } from "../constants/emailQueue";
import { ApiError } from "../utils/ApiError";
import { UserService } from "../utils/UserService";
import jwt from "jsonwebtoken";

const generateAccessAndRerfreshTokens = async (userID: string) => {
  try {
    const userService = await UserService.findUserById(userID);

    if (!userService) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = userService.generateAccessToken();
    const refreshToken = userService.generateRefreshToken();

    // saving refresh token in database
    await userService.saveRefreshToken(refreshToken);

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Somehting went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { name, email, password }: RegisterUserBody = req.body;

    if ([name, email, password].some((filed) => filed.trim() === "")) {
      return res
        .status(400)
        .json(new ApiResponse(false, "All fields is required"));
    }

    const existedUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    console.log(existedUser);

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (existedUser && existedUser.isVerified) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, "user already registered with this email")
        );
    } else if (existedUser && existedUser.isVerified === false) {
      // in this case we tackle for if one user registers and not verified his email and second user comes and registers with same email then we give email to second user if second user verifies email
      const hashedPassword = await bcrypt.hash(password, 10);

      // update user
      await prisma.user.update({
        where: {
          id: existedUser.id,
        },
        data: {
          password: hashedPassword,
          name,
          verifyCode,
          verifyCodeExpiry: expiryDate,
        },
      });
    } else {
      // creates a new User

      const hashedPassword = await bcrypt.hash(password, 10);

      // creating user
      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
        },
      });
    }

    // adding email into queue for sending verifycode
    // await emailQueue.add(`${Date.now}`, {
    //   to: email,
    //   subject: "Please Verify your Account",
    //   body: `Dear ${name} , Please verify your email  , your verification code ${verifyCode} `,
    // });

    return res.json(new ApiResponse(true, "user created"));
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json(new ApiResponse(false, "error while registering user"));
  }
});

const verifycode = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, code }: verifyCodeBody = req.body;

    if ([email, code].some((filed) => filed.trim() === "")) {
      return res
        .status(400)
        .json(new ApiResponse(false, "All fields is required"));
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json(new ApiResponse(false, "User not Found"));
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeNotExpired && isCodeValid) {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
        },
      });

      return res
        .status(200)
        .json(new ApiResponse(true, "Account verification successfully"));
    } else if (!isCodeNotExpired) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            false,
            "Verification Code expired , Please Sign-In again"
          )
        );
    } else {
      return res
        .status(400)
        .json(new ApiResponse(false, "Incorrect verification code"));
    }
  } catch {
    return res
      .status(500)
      .json(new ApiResponse(false, "error while verifying code"));
  }
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { email, password }: loginUserBody = req.body;

    if ([email, password].some((filed) => filed.trim() === "")) {
      return res
        .status(400)
        .json(new ApiResponse(false, "All fields is required"));
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(404)
        .json(new ApiResponse(false, `User not found with ${email}`));
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json(new ApiResponse(false, "Please verify your account first"));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json(new ApiResponse(false, "Password Incorrect"));
    }

    const { accessToken, refreshToken } = await generateAccessAndRerfreshTokens(
      user.id
    );

    const cookkieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookkieOptions)
      .cookie("refreshToken", refreshToken, cookkieOptions)
      .json(new ApiResponse(true, " User login Successfully"));
  } catch (error) {
    return res.status(500).json("error while login User");
  }
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(400, "Unauthorized request");
    }

    // updating user
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken: null,
      },
    });

    const cookkieOptions = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", cookkieOptions)
      .clearCookie("refreshToken", cookkieOptions)
      .json(new ApiResponse(true, "User Logout Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(false, "error while logout User"));
  }
});

const refreshTooken = asyncHandler(async (req: Request, res: Response) => {
  try {
    const InComingrefreshToken = req.cookies.refreshToken;

    if (!InComingrefreshToken) {
      throw new ApiError(401, "unauthorized Request");
    }

    const decodedToken = jwt.verify(
      InComingrefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as { id: string };

    const user = await prisma.user.findFirst({
      where: {
        id: decodedToken.id,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid Refresfh Token");
    }

    if (InComingrefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh Token Expired");
    }

    const cookkieOptions = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRerfreshTokens(
      user.id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookkieOptions)
      .cookie("refreshToken", refreshToken, cookkieOptions)
      .json(new ApiResponse(true, "Access Token Refreshed Successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(false, "error while refreshig accessToken"));
  }
});

const chechEmailUnique = asyncHandler(async (req: Request, res: Response) => {
  try {
    const email = req.query.email;
    console.log( email , "email");
    

    if (!email) {
      throw new ApiError(400, "invalid query Parameters");
    }
    const ExistingEmailAndVerified = await prisma.user.findFirst({
      where: {
        email: String(email),
        isVerified: true,
      },
    });

    if (ExistingEmailAndVerified) {
      return res
        .status(200)
        .json(new ApiResponse(false, "email already in use "));
    }
    return res.status(200).json(new ApiResponse(true, "email is unique"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(false, "error while checking email"));
  }
});

export { registerUser, verifycode, loginUser, logoutUser, refreshTooken , chechEmailUnique };
