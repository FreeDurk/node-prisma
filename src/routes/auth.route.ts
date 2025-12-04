import { Request, Response, Router, NextFunction } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();
const authController = new AuthController(authService);

const authRoute = Router();

authRoute.post("/auth/signup",authController.auth)

authRoute.get('/auth/verify', authController.verify);

authRoute.post('/auth/signin', authController.signin);

export default authRoute;
