import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { CustomError } from "../utils/CustomError";

export class DeviceController extends Controller {
  constructor() {
    super();
  }

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, error, status } = await this.supabase.from('devices')
        .select()
        .order('name');

      if (error) throw new CustomError(error.message, status);

      return res.status(200).json({
        status: true,
        message: 'devices listed successfully',
        results: data,
      })
    } catch (error) {
      next(error);
    }
  }
}
