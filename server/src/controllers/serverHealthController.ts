import { Request, Response } from "express";

export const serverHealthController = (_: Request, response: Response) => {
  console.log('health check');
  const healthStatus = {
    status: 'UP',
    timestamp: new Date(),
  };
    response.status(200).json(healthStatus);
};