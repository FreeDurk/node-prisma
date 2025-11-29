import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRoute = Router();

const userController = new UserController();

userRoute.get('/users', userController.users);
userRoute.get('/users/:id', userController.findUserById);

export default userRoute;

