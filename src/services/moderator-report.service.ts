import { prisma } from "../config/prisma";

export async function getReports() {
  return prisma.report.findMany({
    select: {
      id: true,
      category: true,
      description: true,
      evidenceUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      closedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getReportById(reportId: string) {
  return prisma.report.findUnique({
    where: {
      id: reportId,
    },
    select: {
      id: true,
      category: true,
      description: true,
      evidenceUrl: true,
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
}

export async function updateReportStatus(
  reportId: string,
  moderatorId: string,
  newStatus:
    | "UNDER_REVIEW"
    | "RESOLVED"
    | "DISMISSED",
  message?: string
) {
  const report = await prisma.report.findUnique({
    where: {
      id: reportId,
    },
  });

  if (!report) {
    throw new Error("Report not found");
  }

  const currentStatus = report.status;

  const allowedTransitions: Record<string, string[]> = {
    SUBMITTED: ["UNDER_REVIEW"],
    UNDER_REVIEW: ["RESOLVED", "DISMISSED"],
    RESOLVED: [],
    DISMISSED: [],
  };

  if (!allowedTransitions[currentStatus].includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${currentStatus} -> ${newStatus}`
    );
  }

  const closedAt =
    newStatus === "RESOLVED" || newStatus === "DISMISSED"
      ? new Date()
      : null;

  return prisma.report.update({
    where: {
      id: reportId,
    },
    data: {
      status: newStatus,
      closedAt,

      statusUpdates: {
        create: {
          fromStatus: currentStatus,
          toStatus: newStatus,
          message,
        },
      },

      auditLogs: {
        create: {
          moderatorId,
          action: "REPORT_STATUS_UPDATED",
        },
      },
    },

    select: {
      id: true,
      status: true,
      updatedAt: true,
      closedAt: true,
    },
  });
}

