import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { CustomError } from "../utils/CustomError";
import { error } from "console";

export class MeasurementController extends Controller {
  constructor() {
    super();
  }

  add = async (req: Request, res: Response, next: NextFunction) => {
    const { ppm, temperature, source, deviceId } = req.body;

    try {
      const { data, error, status } = await this.supabase.from('measurements')
        .insert({ ppm, temperature, source, deviceId });

      if (error) throw new CustomError(error.message, status);

      return res.status(200).json({
        status: true,
        message: 'measurement added successfully',
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }
}
