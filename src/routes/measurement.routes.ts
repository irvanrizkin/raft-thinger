import { Router } from "express";
import { MeasurementController } from "../controllers/MeasurementController";

const measurementController = new MeasurementController();

export const measurementRouter = Router();

measurementRouter.post('/', measurementController.add);

measurementRouter.post('/read', measurementController.read);

measurementRouter.post('/reset', measurementController.reset);

measurementRouter.get('/:id', measurementController.listByPeriod);
