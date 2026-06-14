import express, {Application} from "express";
import flightsRoutes from "./routes/flights.routes";
// import airportsRoutes from "./routes/airports.routes";
import cors from "cors";

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use("/api/flights", flightsRoutes);
// app.use("/api/airports", airportsRoutes);

export default app;
