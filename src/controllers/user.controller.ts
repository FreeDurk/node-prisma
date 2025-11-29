import { Request, Response,NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { UserRepository } from "../repositories/user_repo";
import { asyncHandler } from "../middleware/async.middleware";
import { ApiResponse } from "../lib/utils/response";
import { NotFoundError, ValidationError } from "../lib/utils/errors";

const userRepo = new UserRepository(prisma);

export class UserController {
  users = asyncHandler(async (req: Request, res: Response) => {
    const users = await userRepo.findAll();
    return ApiResponse.success(res, users);
  });

  findUserById = async(req: Request, res: Response,next: NextFunction) => {
      try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) { 
          throw new ValidationError('Invalid ID')
        }

        const user = await userRepo.findById(id);

        if (!user) throw new NotFoundError('No user found.');

        return ApiResponse.success(res, user);
          
      } catch (error) {
        next(error);
      }
  };
}
