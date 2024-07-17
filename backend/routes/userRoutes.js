import express from "express";
import {
    createUser, deleteUserById,
    getAllUsers,
    getCurrentUser, getUserById,
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

// ADMIN ROUTES

router.route('/:id')
    .delete(authenticate, authorizeAdmin,deleteUserById)
    .get(authenticate, authorizeAdmin,getUserById)



export default router
