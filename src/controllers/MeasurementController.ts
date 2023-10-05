import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { CustomError } from "../utils/CustomError";
import { sub } from "date-fns";

export class MeasurementController extends Controller {
  private count = 0;

  constructor() {
    super();
  }

  add = async (req: Request, res: Response, next: NextFunction) => {
    const { ppm, temperature, source, deviceId } = req.body;

    try {
      // const { data, error, status } = await this.supabase.from('measurements')
      //   .insert({ ppm, temperature, source, deviceId });

      // if (error) throw new CustomError(error.message, status);

      this.count++;

      return res.status(200).json({
        status: true,
        message: 'measurement added successfully',
        // results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  read = (req: Request, res: Response) => {
    console.log(this.count);

    return res.status(200).json({
      status: true,
      message: 'count read',
      results: this.count,
    })
  }

  reset = (req: Request, res: Response) => {
    this.count = 0

    return res.status(200).json({
      status: true,
      message: 'count reset',
    })
  }

  listByPeriod = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { period } = req.query;

    try {
      if (period) {
        const procedure = this.getProcedureFromPeriod(period.toString());

        const { data, error, status } = await this.listAverageByPeriod(id, procedure);

        if (error) throw new CustomError(error.message, status);

        return res.status(200).json({
          status: true,
          message: 'measurement sampled ${period} listed successfully',
          results: data,
        });
      }

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

  private listAverageByPeriod = async (
    deviceId: string,
    procedure: "get_daily_sample" | "get_weekly_sample",
  ) => {
    return await this.supabase.rpc(procedure, {
      p_deviceid: deviceId,
    });
  }

  private getProcedureFromPeriod(period: string) {
    if (period === '1d') {
      return "get_daily_sample";
    }
    if (period === '1w') {
      return "get_weekly_sample";
    }
    throw new Error("Invalid period value. Only '1d' or '1w' are supported.");
  }
}
