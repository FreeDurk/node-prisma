import { NextFunction, Request, Response } from "express";
import { supabase } from "../lib/supabase";
import { asyncHandler } from "./async.middleware";
import { ApiResponse } from "../lib/utils/response";

export const requireAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return ApiResponse.error(res,'unauthenticated.')

    const token = authHeader?.split(" ")[1];

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) return ApiResponse.error(res,'unauthenticated.')

    req.user = data.user;

    next();
  }
);
