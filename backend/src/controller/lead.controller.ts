import type { Request, Response } from "express";
import { HttpError } from "../errors/httpError";
import {
  createLeadSchema,
  leadIdParamSchema,
  updateLeadSchema,
  updateLeadStatusSchema,
  addLeadNoteSchema
} from "../schemas/lead.schema";
import { leadService } from "../services/lead.service";

export const leadController = {
  async create(req: Request, res: Response) {
    const parsed = createLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const result = await leadService.createLead(parsed.data);
    res.status(201).json(result);
  },

  async list(_req: Request, res: Response) {
    const result = await leadService.listLeads();
    res.status(200).json(result);
  },

  async getById(req: Request, res: Response) {
    const params = leadIdParamSchema.safeParse(req.params);
    if (!params.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: params.error.flatten(),
      });
    }

    const result = await leadService.getLeadById(params.data.id);
    res.status(200).json(result);
  },

  async update(req: Request, res: Response) {
    const params = leadIdParamSchema.safeParse(req.params);
    if (!params.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: params.error.flatten(),
      });
    }

    const parsed = updateLeadSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const result = await leadService.updateLead(params.data.id, parsed.data);
    res.status(200).json(result);
  },

  async updateStatus(req: Request, res: Response) {
    const params = leadIdParamSchema.safeParse(req.params);
    if (!params.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: params.error.flatten(),
      });
    }

    const body = updateLeadStatusSchema.safeParse(req.body);
    if (!body.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: body.error.flatten(),
      });
    }

    const result = await leadService.updateLeadStatus(
      params.data.id,
      body.data,
    );
    res.status(200).json(result);
  },

  async remove(req: Request, res: Response) {
    const params = leadIdParamSchema.safeParse(req.params);
    if (!params.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: params.error.flatten(),
      });
    }

    const result = await leadService.deleteLead(params.data.id);
    res.status(200).json(result);
  },

  async addNote(req: Request, res: Response) {
    const params = leadIdParamSchema.safeParse(req.params);
    if (!params.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: params.error.flatten(),
      });
    }

    const leadId = params.data.id;
    const isLeadExist = await leadService.getLeadById(leadId);
    if (!isLeadExist) {
      throw new HttpError(404, "Lead not found", {
        code: "LEAD_NOT_FOUND",
      });
    }

    const parsed = addLeadNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new HttpError(400, "Invalid request", {
        code: "VALIDATION_ERROR",
        details: parsed.error.flatten(),
      });
    }

    const result = await leadService.addLeadNote(parsed.data);
    res.status(201).json(result);
  }
};
