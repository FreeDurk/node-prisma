import express from "express";
import bodyParser from "body-parser";
import userRoute from "./src/routes/user.route";
import { ApiResponse } from "./src/lib/utils/response";
import { errorHandler } from "./src/middleware/error.middleware";
import authRoute from "./src/routes/auth.route";
import { requireAuth } from "./src/middleware/require.auth.middleware";
import { createHandler } from "graphql-http/lib/use/express";
import schema from "./src/graphql/schema.graph";
import resolver from "./src/graphql/resolver.graph";

const app = express();

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}
// GraphQL
app.use("/graphql", createHandler({ schema: schema, rootValue:resolver }));

app.use(express.json());
app.use(bodyParser.json());

app.use("/api", authRoute);
app.use("/api", requireAuth, userRoute);

app.use((req, res) => {
  ApiResponse.notFound(res, "Route not found");
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Running.....");
  console.log("GraphQL running on http://localhost:3000/graphql");
});
