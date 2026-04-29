import { Request, Response } from "express";

export const getAppointments = (req: Request, res: Response) => {
  res.json({ message: "Appointments working" });
};