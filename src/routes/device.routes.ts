import { Router } from "express";
import { DeviceController } from "../controllers/DeviceController";

const deviceController = new DeviceController();

export const deviceRouter = Router();

deviceRouter.get('/', deviceController.list);
