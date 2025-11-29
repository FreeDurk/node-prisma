import express from "express";
import bodyParser from "body-parser";
import userRoute from "./src/routes/user.route";
import { ApiResponse } from "./src/lib/utils/response";
import { errorHandler } from "./src/middleware/error.middleware";

const app = express();

app.use(express.json());
app.use(bodyParser.json());

app.use('/api', userRoute)

app.use((req, res) => {
  ApiResponse.notFound(res, 'Route not found');
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Running.....");
});
