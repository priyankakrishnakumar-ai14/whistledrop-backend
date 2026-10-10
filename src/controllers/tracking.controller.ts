import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import { hashCaseCode } from "../utils/case-code";

export async function trackReport(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const caseCode = Array.isArray(req.params.caseCode)
  ? req.params.caseCode[0]
  : req.params.caseCode;

    if (!caseCode) {
      return res.status(400).json({
        success: false,
        message: "Case code is required",
      });
    }

    const caseCodeHash = hashCaseCode(caseCode);

    const report = await prisma.report.findUnique({
      where: {
        caseCodeHash,
      },
      select: {
        id: true,
        category: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        closedAt: true,
        statusUpdates: {
          select: {
            fromStatus: true,
            toStatus: true,
            message: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Invalid case code",
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