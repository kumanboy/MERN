import express from "express";
import {
    createUser,
    getAllUsers,
    getCurrentUser,
    loginUser,
    logoutUser,
    updateCurrentUser
} from "../controllers/userController.js";
import {authenticate, authorizeAdmin} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route('/').post(createUser).get(authenticate, authorizeAdmin,getAllUsers)
router.post('/auth', loginUser)
router.post('/logout', logoutUser)
router.route('/profile').get(authenticate, getCurrentUser).put(authenticate,updateCurrentUser)

export default router
