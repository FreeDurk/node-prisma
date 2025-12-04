import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../lib/utils/errors";
import { supabase } from "../lib/supabase";
import { asyncHandler } from "../middleware/async.middleware";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../lib/utils/response";
import { SignInWithPasswordCredentials } from "@supabase/supabase-js";

export class AuthController {
  constructor(protected authService: AuthService) {}

  signin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      const response = await this.authService.signIn({ email, password });
      const { session } = response.data;

      return ApiResponse.success(res, session);
    }
  );

  auth = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;
      if (!email || !password)
        throw new ValidationError("Email or password is required.");
      const { data, error } = await this.authService.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.APP_URL}/api/auth/verify?`,
        },
      });

      if (error) next(error);

      const emailConfirmation = !data.session;

      const response = {
        message: emailConfirmation
          ? "Verification email sent. Please check your inbox."
          : "User created successfully",
        user: data.user,
      };

      return ApiResponse.success(res, response);
    }
  );

  verify(req: Request, res: Response) {
    return res.json("Success");
  }
}
