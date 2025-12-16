import { Router } from "express";
import EventController from "../controllers/event.controller";

const eventController = new EventController();

const eventRoute = Router();

eventRoute.post('/events', eventController.create);
eventRoute.get('/events', eventController.list);
eventRoute.get('/events/:id', eventController.details);

export default eventRoute;