import { Request, Response, NextFunction } from "express";
import { createReport } from "../services/report.service";
import { createReportSchema } from "../validators/report.validator";

export async function submitReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const input = createReportSchema.parse(req.body);

    const result = await createReport(input);

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}