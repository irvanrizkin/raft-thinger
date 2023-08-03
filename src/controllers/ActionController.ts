import { NextFunction, Request, Response } from "express";
import { Controller } from "./Controller";
import { CustomError } from "../utils/CustomError";
import axios from "axios";

export class ActionController extends Controller {
  constructor() {
    super();
  }

  openValve = async (req: Request, res: Response, next: NextFunction) => {
    const { id, flow } = req.params;

    try {
      const { data } = await this.supabase.from('devices')
        .select()
        .eq('id', id)
        .limit(1)
        .single();

      if (!data) throw new CustomError('device not found for open valve', 404);

      const { url, token } = data;

      if (!url) throw new CustomError('null url on device', 400);

      const response = await axios.post(url, flow, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json;charset=UTF-8',
          'Accept': 'application/json, text/plain, */*'
        },
      });

      return res.status(200).json({
        status: true,
        message: 'open valve command sent successfully by thinger',
        results: data.id,
      });
    } catch (error) {
      next(error);
    }
  }
}
