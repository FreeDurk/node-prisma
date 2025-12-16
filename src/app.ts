import 'reflect-metadata';

import express from "express";
import bodyParser from "body-parser";
import userRoute from "./routes/user.route";
import { ApiResponse } from "./lib/utils/response";
import { errorHandler } from "./middleware/error.middleware";
import authRoute from "./routes/auth.route";
import { requireAuth } from "./middleware/require.auth.middleware";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./graphql/schema.graph";
import eventRoute from "./routes/event.route";
import bookingRoute from "./routes/booking.route";
import BookingRequestDto from './dto/booking.request.dto';
import { validateBody } from './middleware/validate.body';


const app = express();

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}
// GraphQL
app.use("/graphql", requireAuth ,createHandler({ schema}));

app.use(express.json());
app.use(bodyParser.json());

app.use("/api", authRoute);
app.use("/api", requireAuth, userRoute);
app.use("/api", requireAuth, eventRoute);
app.use("/api", requireAuth, validateBody(BookingRequestDto), bookingRoute);

app.use((req, res) => {
  ApiResponse.notFound(res, "Route not found");
});

// app.use(errorHandler);

app.listen(3000, () => {
  console.log("Running.....");
  console.log("GraphQL running on http://localhost:3000/graphql");
});
