import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
import { HttpError } from "../errors/httpError";

type CreateLeadInput = {
  name: string;
  companyName: string;
  email: string;
  phoneNumber: string;
  source: string;
  assignedTo?: Prisma.LeadCreateInput["assignedTo"];
  status?: Prisma.LeadCreateInput["status"];
  dealValue: number;
};

type UpdateLeadInput = Partial<CreateLeadInput>;

type UpdateLeadStatusInput = {
  status: Prisma.LeadCreateInput["status"];
};

const isUniqueConstraintError = (err: unknown): boolean => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002"
  );
};

const isRecordNotFoundError = (err: unknown): boolean => {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025"
  );
};

export const leadService = {
  async createLead(input: CreateLeadInput) {
    try {
      const lead = await prisma.lead.create({
        data: {
          name: input.name,
          companyName: input.companyName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          source: input.source,
          assignedTo: input.assignedTo,
          status: input.status,
          dealValue: input.dealValue,
        },
      });

      return { lead };
    } catch (err) {
      if (isUniqueConstraintError(err)) {
        throw new HttpError(409, "Lead email already exists", {
          code: "LEAD_EMAIL_EXISTS",
        });
      }
      throw err;
    }
  },

  async listLeads() {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { leads };
  },

  async getLeadById(id: string) {
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: "desc" },
          include: {
            createdBy: {
              select: { id: true, userName: true, email: true },
            },
          },
        },
      },
    });

    if (!lead) {
      throw new HttpError(404, "Lead not found", { code: "LEAD_NOT_FOUND" });
    }

    return { lead };
  },

  async updateLead(id: string, input: UpdateLeadInput) {
    try {
      const lead = await prisma.lead.update({
        where: { id },
        data: {
          name: input.name,
          companyName: input.companyName,
          email: input.email,
          phoneNumber: input.phoneNumber,
          source: input.source,
          assignedTo: input.assignedTo,
          status: input.status,
          dealValue: input.dealValue,
        },
      });

      return { lead };
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new HttpError(404, "Lead not found", { code: "LEAD_NOT_FOUND" });
      }
      if (isUniqueConstraintError(err)) {
        throw new HttpError(409, "Lead email already exists", {
          code: "LEAD_EMAIL_EXISTS",
        });
      }
      throw err;
    }
  },

  async updateLeadStatus(id: string, input: UpdateLeadStatusInput) {
    try {
      const lead = await prisma.lead.update({
        where: { id },
        data: { status: input.status },
      });

      return { lead };
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new HttpError(404, "Lead not found", { code: "LEAD_NOT_FOUND" });
      }
      throw err;
    }
  },

  async deleteLead(id: string) {
    try {
      await prisma.lead.delete({ where: { id } });
      return { ok: true };
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new HttpError(404, "Lead not found", { code: "LEAD_NOT_FOUND" });
      }
      throw err;
    }
  },
};
