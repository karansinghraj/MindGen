import { Request, Response } from "express";
import * as weatherServices from "../services/weatherServices";

async function getWeather(req: Request, res: Response) {
  const model = req.query;
  const response = await weatherServices.getWeather(model);
  res.status(response.status).json(response);
}

export { getWeather };
