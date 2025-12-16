import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middleware/async.middleware";
import { ApiResponse } from "../lib/utils/response";
import BookingRequestDto from "../dto/booking.request.dto";
import { prisma } from "../lib/prisma";

export default class BookingController {
  book = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.user;
      const data: BookingRequestDto = req.body;

      const booking = await prisma.$transaction(async (tx) => {
        return await tx.booking.create({
          data: {
            ...data,
            userId: id,
          },
          include: {
            ticketType: true,
            event: true,
          },
        });
      });

      return ApiResponse.success(res, booking);
    }
  );
}
