import { prisma } from "../config/prisma";

export async function createAuditLog(
  moderatorId: string,
  action: string,
  reportId?: string
) {
  return prisma.auditLog.create({
    data: {
      moderatorId,
      action,
      reportId,
    },
  });
}