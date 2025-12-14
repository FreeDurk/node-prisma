import { Request, Response,NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { UserRepository } from "../repositories/user_repo";
import { asyncHandler } from "../middleware/async.middleware";
import { ApiResponse } from "../lib/utils/response";
import { NotFoundError, ValidationError } from "../lib/utils/errors";
import { User } from "../../generated/prisma/client";
import { supabase } from "../lib/supabase";

const userRepo = new UserRepository(prisma);

export class UserController {

  profile = asyncHandler(async (req: Request, res: Response) => {
    const user = await supabase.auth.getUser();
    return ApiResponse.success(res, user);
  });

  findUserById = async(req: Request, res: Response,next: NextFunction) => {
      try {
        const id = req.params.id as string

        const user = await userRepo.findById(id);

        if (!user) throw new NotFoundError('No user found.');

        return ApiResponse.success(res, user);
          
      } catch (error) {
        next(error);
      }
  };

  register = asyncHandler(async (req: Request, res: Response) => {
    const user: User = req.body

    return await prisma.user.create({data: user})
  });
}
