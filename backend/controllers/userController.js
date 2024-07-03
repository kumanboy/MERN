import User from "../models/userModel.js"
import asyncHandler from "../middlewares/asyncHandler.js";
// bcryptjs import qilamiz
import bcrypt from "bcryptjs"

const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body
    // user agar hamma inputlarga malumotlarni kiritmaganda ishlaydigan logic
    if (!username || !email || !password) {
        res.status(400)
        throw new Error("Iltimos har bitta ma'lumot to'liq kiriting")
    }
    //user agar avval mavjud bolgan username yoki email orqali royxatdan otgan bolsa ishlaydigan logic
    const userExist = await User.findOne({email})
    if (userExist) res.status(400).send("Bu email mavjud")

    //user parolni shifrlash
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
    //user yaratish

    const newUser = new User({username, email, password: hashedPassword})

    try {
        await newUser.save()
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            isAdmin: newUser.isAdmin
        })
    } catch (error) {
        res.status(400).send(error.message)
        throw new Error('Invalid user data')
    }
})


export {createUser}
