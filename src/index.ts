import express, { type Request, type Response } from "express";
import morgan from 'morgan';
import studentRoutes from "./routes/studentRoutes.js";
import coureRoutes from "./routes/courseRoutes.js";

const app: any = express();

//Middleware
app.use(express.json());
app.use(morgan('dev'));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "lab 15 API service successfully"
  });
});

app.use("/me", studentRoutes);

app.use("/api/v2",coureRoutes);

app.listen(3000, () =>
  console.log("🚀 Server running on http://localhost:3000")
);

export default app;