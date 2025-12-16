import { Router } from "express";
import BookingController from "../controllers/booking.controller";

const bookingController = new BookingController()

const bookingRoute = Router();

bookingRoute.post('/bookings',bookingController.book)

export default bookingRoute;

