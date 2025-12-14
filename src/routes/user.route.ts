import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoute = Router();

const userController = new UserController();

userRoute.get('/users/profile', userController.profile);
userRoute.get('/users/:id', userController.findUserById);

export default userRoute;

