import { Request, Response, Router, NextFunction } from "express";
import { ValidationError } from "../lib/utils/errors";
import { ApiResponse } from "../lib/utils/response";
import { supabase } from "../lib/supabase";

const authRoute = Router();

authRoute.post(
  "/auth/signup",
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    try {
      if (!email || !password)
        throw new ValidationError("Email or password is required.");
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.APP_URL}/api/auth/verify?`,
        },
      });

      if (error) next(error);

      const emailConfirmation = !data.session;

      return res.json({
        message: emailConfirmation
          ? "Verification email sent. Please check your inbox."
          : "User created successfully",
        user: data.user
      });
    } catch (error) {
      next(error);
    }
  }
);

authRoute.get('/auth/verify', async (req: Request, res: Response) => {
  const { access_token } = req.query;
  console.log(access_token);
  
});

export default authRoute;
