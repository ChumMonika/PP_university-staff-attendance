import type { Request, Response } from "express";

export class HealthController {
  async check(req: Request, res: Response) {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }
}