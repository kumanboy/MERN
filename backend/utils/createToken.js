import jwt from "jsonwebtoken"

const generateToken = (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET,
        {expiresIn: "30d"})

//cookie sifatida JWT token ornatmiz
    res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV,
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return token
}

export default generateToken


