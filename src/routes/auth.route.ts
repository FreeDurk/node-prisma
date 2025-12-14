import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

const authController = new AuthController(new AuthService());

const authRoute = Router();

authRoute.post("/auth/signup",authController.signUp)

authRoute.get('/auth/verify', authController.verify);

authRoute.post('/auth/signin', authController.signin);
authRoute.post('/auth/signout', authController.signOut);

export default authRoute;
