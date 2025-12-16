import { NextFunction, Request, response, Response } from "express";
import { asyncHandler } from "../middleware/async.middleware";
import { EventCreateInput } from "../../generated/prisma/models";
import { ApiResponse } from "../lib/utils/response";
import { prisma } from "../lib/prisma";
import { TicketType } from "../../generated/prisma/client";

export type createEventDto = {
  title: string;
  description: string;
  location: string;
  capacity: number;
  ticket_available: TicketType[];
};

export default class EventController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const { ticket_available, ...eventDetails } = req.body as createEventDto;

    const eventData = await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({
        data: {
          ...eventDetails,
          tickets: {
            create: ticket_available,
          },
        },
      });

      return event;
    });
    return ApiResponse.success(res, eventData);
  });

  list = asyncHandler(async (_, res: Response) => {
    const events = await prisma.event.findMany({
      include: {
        tickets: true,
      },
    });

    return ApiResponse.success(res, events);
  });

  details = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const event = await prisma.event.findUnique({
        where: {
          id,
        },
        include: {
          tickets: true,
        },
      });

      if (!event) return ApiResponse.error(res, "Not found.");

      return ApiResponse.success(res, event);
    } catch (error) {
      next(error);
    }
  };
}
