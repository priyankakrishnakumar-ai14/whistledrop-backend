import { prisma } from "../config/prisma";
import { generateCaseCode, hashCaseCode } from "../utils/case-code";
import { CreateReportInput } from "../validators/report.validator";

export async function createReport(input: CreateReportInput) {
  const caseCode = generateCaseCode();
  const caseCodeHash = hashCaseCode(caseCode);

  const report = await prisma.report.create({
    data: {
      caseCodeHash,
      category: input.category,
      description: input.description,
      evidenceUrl: input.evidenceUrl,
    },
  });

  return {
    reportId: report.id,
    caseCode,
    status: report.status,
    createdAt: report.createdAt,
  };
}