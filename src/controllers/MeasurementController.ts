import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { CustomError } from "../utils/CustomError";
import { error } from "console";
import { sub } from "date-fns";

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

  listByPeriod = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const { data, error, status } = await this.listLatest30Min(id);

      if (error) throw new CustomError(error.message, status);

      return res.status(200).json({
        status: true,
        message: 'measurement for last 30 minute listed successfully',
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  private listLatest30Min = async (deviceId: string) => {
    return await this.supabase.from('measurements')
      .select()
      .eq('deviceId', deviceId)
      .gte('createdAt', sub(new Date(), { minutes: 30 }).toISOString())
      .order('createdAt');
  }
}
