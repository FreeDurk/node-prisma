import { IsEnum, IsUUID } from "class-validator"
import { BookingStatus } from "../../generated/prisma/enums"

export default class BookingRequestDto  { 
    @IsUUID()
    ticketTypeId: string

    @IsUUID()
    eventId: string

    @IsEnum(BookingStatus, {
        message:`status must be one of: ${Object.values(BookingStatus).join(', ')}`
    })
    status : BookingStatus
}