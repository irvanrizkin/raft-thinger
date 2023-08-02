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

  add = async (req: Request, res: Response, next: NextFunction) => {
    const { id, name, url, token } = req.body;

    try {
      const { data, error, status } = await this.supabase.from('devices')
        .insert({ id, name, url, token });

      if (error) throw new CustomError(error.message, status);

      return res.status(200).json({
        status: true,
        message: 'device added successfully',
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }

  remove = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const { data } = await this.supabase.from('devices')
        .select()
        .eq('id', id)
        .limit(1)
        .single();

      if (!data) throw new CustomError('device not found for deletion', 404);

      const { error } = await this.supabase.from('devices')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);

      return res.status(204).json({
        status: true,
        message: 'device removed successfully',
        results: data,
      });
    } catch (error) {
      next(error);
    }
  }
}
