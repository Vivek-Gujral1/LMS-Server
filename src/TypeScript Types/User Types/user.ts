
export interface RegisterUserBody {
    name : string
    email : string
    password : string
}

export interface verifyCodeBody {
    email : string
    code : string
}

export interface loginUserBody {
    email  : string
    password : string
}