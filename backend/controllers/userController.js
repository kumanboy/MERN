import User from "../models/userModel.js"
import asyncHandler from "../middlewares/asyncHandler.js";
// bcryptjs import qilamiz
import bcrypt from "bcryptjs"
import createToken from "../utils/createToken.js";

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
        createToken(res, newUser._id)
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

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

// mavjud user email tekshiradigan kod

    const existingUser = await User.findOne({email})

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (isPasswordValid) {
            createToken(res, existingUser._id)
            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin
            })
        }
    }
})

const logoutUser = asyncHandler(async (req,res)=>{
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    })
    res.status(200).send("User Logged out")
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.send(users)
})

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

const updateCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        if (req.body.password) {
            const salt = await bcrypt.genSalt(12)
            user.password = await bcrypt.hash(req.body.password, salt);
        }
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password")

    if (user){
        res.json(user)
    }else {
        res.status(404)
        throw new Error("User not found")
    }
})

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
export {createUser, loginUser,logoutUser,getAllUsers,getCurrentUser,updateCurrentUser,deleteUserById,getUserById,updateUserById}
