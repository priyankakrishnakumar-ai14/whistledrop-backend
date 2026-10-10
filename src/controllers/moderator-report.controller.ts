import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

import {
  getReports,
  getReportById,
  updateReportStatus,
} from "../services/moderator-report.service";

import { updateStatusSchema } from "../validators/status.validator";

export async function listReports(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reports = await getReports();

    return res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSingleReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const reportId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "Report ID is required",
      });
    }

    const report = await getReportById(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const reportId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: "Report ID is required",
      });
    }

    const moderatorId = req.moderator?.id;

    if (!moderatorId) {
      return res.status(401).json({
        success: false,
        message: "Authenticated moderator is required",
      });
    }

    const input = updateStatusSchema.parse(req.body);

    const report = await updateReportStatus(
      reportId,
      moderatorId,
      input.status,
      input.message
    );

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: report,
    });
  } catch (error) {
    next(error);
  }
}