import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../lib/utils/errors";
import { asyncHandler } from "../middleware/async.middleware";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../lib/utils/response";
import { UserCreateInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

export class AuthController {
  constructor(protected authService: AuthService) {}

  signUp = asyncHandler(async (req: Request, res: Response) => {
    const { password,...extractPasswordUserData } = req.body 
    
    const { firstname, lastname, email, address } = extractPasswordUserData as UserCreateInput;

    const createUserData = await this.authService.signUp({
      email,
      password,
      options: {
        data: { firstname, lastname, email, address },
      },
    });

    if (createUserData.error)
      return ApiResponse.error(res, createUserData.error.message);

    const { id } = createUserData.data.user!;

    await prisma.user.create({
      data: {
        supabase_id: id,
        firstname,
        lastname,
        email,
        address,
      },
    });

    return ApiResponse.success(res, createUserData);
  });

  signin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      const response = await this.authService.signIn({ email, password });

      if (response.error) return ApiResponse.error(res, response.error.message, response.error.status);

      const { session } = response.data;

      return ApiResponse.success(res, session);
    }
  );

  signOut = asyncHandler(async (_:Request, res: Response) => { 
    const { error } = await this.authService.singOut();

    if (error) return ApiResponse.error(res, error.message, error.status);

    return ApiResponse.success(res, "Signout");
  })

  verify(req: Request, res: Response) {
    return res.json("Success");
  }
}
