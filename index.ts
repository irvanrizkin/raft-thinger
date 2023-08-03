require('dotenv').config();
import express, { Request, Response } from "express";
import cors from 'cors'

import { ErrorHandler } from "./src/utils/ErrorHandler";

import { deviceRouter } from "./src/routes/device.routes";
import { measurementRouter } from "./src/routes/measurement.routes";
import { actionRouter } from "./src/routes/action.routes";

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json(
    {
      status: true,
      message: 'Welcome to the main endpoint of RAFT Thinger',
    }
  )
});

app.use('/devices', deviceRouter);
app.use('/measurements', measurementRouter);
app.use('/actions', actionRouter);

app.use(ErrorHandler.handleError);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API for Thinger running in port ${PORT}`);
});
